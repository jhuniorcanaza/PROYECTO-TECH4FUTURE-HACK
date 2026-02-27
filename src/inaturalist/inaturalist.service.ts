import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FormData = require('form-data') as typeof import('form-data');
import { SearchObservationDto } from './dto/search-observation.dto';

// ── Interfaces ───────────────────────────────────────────────────────────────

interface InatPhoto {
  url?: string;
  license_code?: string;
  attribution?: string;
}

interface InatConservationStatus {
  status?: string;
  status_name?: string;
  authority?: string;
  description?: string;
  iucn?: number;
}

interface InatTaxonDetailed {
  id?: number;
  name?: string;
  preferred_common_name?: string;
  rank?: string;
  rank_level?: number;
  iconic_taxon_name?: string;
  default_photo?: { medium_url?: string; square_url?: string; attribution?: string };
  wikipedia_url?: string;
  wikipedia_summary?: string;
  ancestry?: string;
  ancestor_ids?: number[];
  observations_count?: number;
  conservation_status?: InatConservationStatus;
  conservation_statuses?: InatConservationStatus[];
  taxon_names?: Array<{ name: string; lexicon: string; is_valid: boolean }>;
  ancestors?: InatTaxonDetailed[];
  children?: InatTaxonDetailed[];
  taxon_photos?: Array<{ photo: InatPhoto }>;
  listed_taxa_count?: number;
  native_range?: string;
  establishment_means?: string;
  place_guess?: string;
  // Clasificación completa en el objeto de la API
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
}

interface InatTaxon {
  id?: number;
  name?: string;
  preferred_common_name?: string;
  rank?: string;
  default_photo?: { medium_url?: string };
  wikipedia_url?: string;
  ancestry?: string;
  observations_count?: number;
}

interface InatObservation {
  id?: number;
  uuid?: string;
  observed_on?: string;
  created_at?: string;
  quality_grade?: string;
  taxon?: InatTaxon;
  place_guess?: string;
  location?: string;
  photos?: InatPhoto[];
  user?: { login?: string };
}

interface InatObservationsResponse {
  total_results?: number;
  page?: number;
  per_page?: number;
  results?: InatObservation[];
}

interface InatTaxaResponse {
  total_results?: number;
  results?: InatTaxonDetailed[];
}

interface InatVisionTaxon extends InatTaxonDetailed {
  iconic_taxon_name?: string;
  ancestor_ids?: number[];
}

interface InatVisionSuggestion {
  score?: number;
  taxon?: InatVisionTaxon;
}

interface InatVisionResponse {
  results?: InatVisionSuggestion[];
  common_ancestor?: {
    score?: number;
    taxon?: InatVisionTaxon;
  };
}

// ── Mapa IUCN ────────────────────────────────────────────────────────────────
const IUCN_MAP: Record<number, string> = {
  0: 'No Evaluado (NE)',
  5: 'Datos Insuficientes (DD)',
  10: 'Preocupación Menor (LC)',
  20: 'Casi Amenazado (NT)',
  30: 'Vulnerable (VU)',
  40: 'En Peligro (EN)',
  50: 'En Peligro Crítico (CR)',
  60: 'Extinto en Estado Silvestre (EW)',
  70: 'Extinto (EX)',
};

// ── Servicio ─────────────────────────────────────────────────────────────────

@Injectable()
export class InaturalistService {
  private readonly logger = new Logger(InaturalistService.name);
  private readonly apiToken: string;
  private readonly baseUrl = 'https://api.inaturalist.org/v1';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiToken = this.configService.get<string>('INATURALIST_API_TOKEN', '');
    if (!this.apiToken) {
      throw new Error(
        'INATURALIST_API_TOKEN no está configurada en el archivo .env',
      );
    }
  }

  private get authHeaders() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  checkConnection(): { status: string; tokenPreview: string } {
    return {
      status: 'ok',
      tokenPreview: `${this.apiToken.substring(0, 10)}****`,
    };
  }

  private handleError(context: string, error: unknown): never {
    const err = error as {
      response?: { data?: unknown; status?: number };
      message?: string;
    };
    this.logger.error(context, err?.response?.data ?? err?.message);
    throw new HttpException(
      { message: context, detail: err?.response?.data ?? err?.message },
      err?.response?.status ?? HttpStatus.BAD_GATEWAY,
    );
  }

  // ── Obtener detalles completos de un taxón por ID ─────────────────────────

  private async fetchTaxonDetails(id: number): Promise<InatTaxonDetailed | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<InatTaxaResponse>(
          `${this.baseUrl}/taxa/${id}`,
          {
            headers: this.authHeaders,
            params: {
              all_names: true,
            },
          },
        ),
      );
      return response.data?.results?.[0] ?? null;
    } catch {
      this.logger.warn(`No se pudieron obtener detalles del taxón ${id}`);
      return null;
    }
  }

  // ── Construir árbol taxonómico a partir de ancestry ───────────────────────

  private buildTaxonomyFromAncestors(
    taxon: InatTaxonDetailed,
    ancestors: InatTaxonDetailed[],
  ) {
    const rankOrder = [
      'kingdom', 'phylum', 'subphylum', 'superclass', 'class',
      'subclass', 'superorder', 'order', 'suborder', 'superfamily',
      'family', 'subfamily', 'tribe', 'genus', 'subgenus',
      'species', 'subspecies', 'variety',
    ];

    const tree: Record<string, string> = {};
    for (const anc of ancestors) {
      if (anc.rank && anc.name && rankOrder.includes(anc.rank)) {
        tree[anc.rank] = anc.name;
      }
    }
    // incluir el taxón en sí
    if (taxon.rank && taxon.name) {
      tree[taxon.rank] = taxon.name;
    }
    return tree;
  }

  // ── Extraer estado de conservación ────────────────────────────────────────

  private buildConservation(taxon: InatTaxonDetailed) {
    const cs = taxon.conservation_status;
    if (!cs) return null;
    return {
      estado: cs.status_name ?? cs.status ?? 'Desconocido',
      codigo: cs.status ?? null,
      autoridad: cs.authority ?? null,
      descripcionIUCN:
        cs.iucn !== undefined ? (IUCN_MAP[cs.iucn] ?? `Código IUCN: ${cs.iucn}`) : null,
      descripcion: cs.description ?? null,
    };
  }

  // ── Enriquecer sugerencia con detalles completos ──────────────────────────

  private async enrichSuggestion(s: InatVisionSuggestion, rank: number) {
    const taxonId = s.taxon?.id;
    const details = taxonId ? await this.fetchTaxonDetails(taxonId) : null;
    const ancestors = details?.ancestors ?? [];

    const taxonomia = details
      ? this.buildTaxonomyFromAncestors(details, ancestors)
      : {};

    // Nombres en otros idiomas (lexicon = español, english, etc.)
    const nombres: Record<string, string> = {};
    if (details?.taxon_names) {
      for (const n of details.taxon_names) {
        if (n.is_valid && n.lexicon && n.name) {
          nombres[n.lexicon.toLowerCase()] = n.name;
        }
      }
    }

    // Fotos adicionales del taxón
    const fotosAdicionales = (details?.taxon_photos ?? [])
      .slice(0, 4)
      .map((tp) => ({
        url: tp.photo?.url?.replace('square', 'medium') ?? null,
        atribucion: tp.photo?.attribution ?? null,
        licencia: tp.photo?.license_code ?? null,
      }));

    const conservacion = details ? this.buildConservation(details) : null;

    // Determinar tipo de ser vivo en español
    const tipoEsp = this.translateIconicTaxon(
      s.taxon?.iconic_taxon_name ?? details?.iconic_taxon_name,
    );

    return {
      posicion: rank,
      confianza: `${((s.score ?? 0) * 100).toFixed(1)}%`,
      confianzaNumero: parseFloat(((s.score ?? 0) * 100).toFixed(1)),
      identificacion: {
        id: s.taxon?.id ?? null,
        nombreCientifico: s.taxon?.name ?? 'Desconocido',
        nombreComun: s.taxon?.preferred_common_name ?? nombres['english'] ?? 'No disponible',
        nombresEspanol: nombres['spanish'] ?? nombres['castellano'] ?? null,
        nombresAdicionales: nombres,
        rango: s.taxon?.rank ?? null,
        tipoOrganismo: tipoEsp,
        totalObservaciones: details?.observations_count ?? null,
      },
      taxonomiaCompleta: {
        reino: taxonomia['kingdom'] ?? null,
        filo: taxonomia['phylum'] ?? null,
        clase: taxonomia['class'] ?? null,
        orden: taxonomia['order'] ?? null,
        familia: taxonomia['family'] ?? null,
        subfamilia: taxonomia['subfamily'] ?? null,
        genero: taxonomia['genus'] ?? null,
        subgenero: taxonomia['subgenus'] ?? null,
        especie: taxonomia['species'] ?? s.taxon?.name ?? null,
        subespecie: taxonomia['subspecies'] ?? null,
      },
      estadoConservacion: conservacion,
      descripcion: details?.wikipedia_summary ?? null,
      enlaces: {
        wikipedia: s.taxon?.wikipedia_url ?? details?.wikipedia_url ?? null,
        inaturalist: `https://www.inaturalist.org/taxa/${s.taxon?.id ?? ''}`,
      },
      imagenes: [
        details?.default_photo?.medium_url
          ? {
              url: details.default_photo.medium_url,
              atribucion: details.default_photo.attribution ?? null,
            }
          : null,
        ...fotosAdicionales,
      ].filter(Boolean),
    };
  }

  private translateIconicTaxon(iconic?: string): string {
    const map: Record<string, string> = {
      Animalia: 'Animal',
      Mammalia: 'Mamífero',
      Aves: 'Ave / Pájaro',
      Reptilia: 'Reptil',
      Amphibia: 'Anfibio',
      Actinopterygii: 'Pez (actinopterigios)',
      Mollusca: 'Molusco',
      Arachnida: 'Arácnido',
      Insecta: 'Insecto',
      Plantae: 'Planta',
      Fungi: 'Hongo',
      Protozoa: 'Protozoario',
      Chromista: 'Chromista',
    };
    return map[iconic ?? ''] ?? iconic ?? 'Desconocido';
  }

  // ── identifyFromBuffer ────────────────────────────────────────────────────

  private getMimetypeFromFilename(filename: string, fallback: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    return map[ext ?? ''] ?? fallback;
  }

  async identifyFromBuffer(buffer: Buffer, filename: string, fallbackMime: string) {
    const mimetype = this.getMimetypeFromFilename(filename, fallbackMime);
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowed.includes(mimetype)) {
      throw new HttpException(
        'Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      this.logger.log(`Identificando imagen con iNaturalist CV (${mimetype})...`);

      const form = new FormData();
      form.append('image', buffer, { filename, contentType: mimetype });

      const response = await firstValueFrom(
        this.httpService.post<InatVisionResponse>(
          `${this.baseUrl}/computervision/score_image`,
          form,
          {
            headers: {
              ...form.getHeaders(),
              Authorization: `Bearer ${this.apiToken}`,
            },
          },
        ),
      );

      return await this.parseVisionResult(response.data);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.handleError('Error al identificar imagen con iNaturalist CV', error);
    }
  }

  private async parseVisionResult(data: InatVisionResponse) {
    const topResults = (data?.results ?? []).slice(0, 5);

    // Enriquecer todas las sugerencias en paralelo
    const sugerencias = await Promise.all(
      topResults.map((s, i) => this.enrichSuggestion(s, i + 1)),
    );

    const mejorCoincidencia = sugerencias[0] ?? null;
    const ancestro = data?.common_ancestor;

    return {
      // Resultado principal — lo más probable
      mejorCoincidencia,

      // Ancestro común (útil cuando hay baja confianza)
      ancestroComun: ancestro?.taxon
        ? {
            confianza: `${((ancestro.score ?? 0) * 100).toFixed(1)}%`,
            nombreCientifico: ancestro.taxon.name ?? 'Desconocido',
            nombreComun:
              ancestro.taxon.preferred_common_name ?? 'No disponible',
            rango: ancestro.taxon.rank ?? null,
            tipoOrganismo: this.translateIconicTaxon(
              ancestro.taxon.iconic_taxon_name,
            ),
            imagen: ancestro.taxon.default_photo?.medium_url ?? null,
            urlInaturalist: `https://www.inaturalist.org/taxa/${ancestro.taxon.id ?? ''}`,
          }
        : null,

      // Todas las sugerencias rankeadas
      todasLasSugerencias: sugerencias,
    };
  }

  // ── Buscar observaciones ──────────────────────────────────────────────────

  async searchObservations(dto: SearchObservationDto) {
    try {
      const params: Record<string, unknown> = {
        per_page: dto.per_page ?? 10,
        page: dto.page ?? 1,
      };
      if (dto.q) params.q = dto.q;
      if (dto.taxon_name) params.taxon_name = dto.taxon_name;
      if (dto.taxon_id) params.taxon_id = dto.taxon_id;
      if (dto.place_name) params.place_name = dto.place_name;

      this.logger.log(`Buscando observaciones: ${JSON.stringify(params)}`);

      const response = await firstValueFrom(
        this.httpService.get<InatObservationsResponse>(
          `${this.baseUrl}/observations`,
          { headers: this.authHeaders, params },
        ),
      );
      return this.parseObservationsResult(response.data);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.handleError('Error al buscar observaciones en iNaturalist', error);
    }
  }

  // ── Obtener taxón por ID (público) ────────────────────────────────────────

  async getTaxonById(id: number) {
    try {
      this.logger.log(`Obteniendo taxón con ID: ${id}`);
      const details = await this.fetchTaxonDetails(id);
      if (!details) {
        throw new HttpException('Taxón no encontrado', HttpStatus.NOT_FOUND);
      }
      return this.parseTaxon(details);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.handleError('Error al obtener taxón de iNaturalist', error);
    }
  }

  // ── Buscar taxones ────────────────────────────────────────────────────────

  async searchTaxa(query: string, perPage = 10) {
    try {
      this.logger.log(`Buscando taxones: ${query}`);
      const response = await firstValueFrom(
        this.httpService.get<InatTaxaResponse>(`${this.baseUrl}/taxa`, {
          headers: this.authHeaders,
          params: { q: query, per_page: perPage },
        }),
      );
      return {
        total: response.data?.total_results ?? 0,
        resultados: (response.data?.results ?? []).map((t) => this.parseTaxon(t)),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.handleError('Error al buscar taxones en iNaturalist', error);
    }
  }

  // ── Parsers de apoyo ──────────────────────────────────────────────────────

  private parseObservationsResult(data: InatObservationsResponse) {
    const results = data?.results ?? [];
    return {
      total: data?.total_results ?? 0,
      pagina: data?.page ?? 1,
      porPagina: data?.per_page ?? 10,
      observaciones: results.map((obs) => {
        const coords = obs.location
          ? {
              latitud: obs.location.split(',')[0],
              longitud: obs.location.split(',')[1],
            }
          : null;
        return {
          id: obs.id,
          uuid: obs.uuid,
          fecha: obs.observed_on ?? obs.created_at,
          calidad: obs.quality_grade,
          especie: {
            id: obs.taxon?.id ?? null,
            nombreCientifico: obs.taxon?.name ?? 'Desconocido',
            nombreComun: obs.taxon?.preferred_common_name ?? 'No disponible',
            rango: obs.taxon?.rank ?? null,
            imagen: obs.taxon?.default_photo?.medium_url ?? null,
          },
          lugar: obs.place_guess ?? 'No especificado',
          coordenadas: coords,
          fotos: (obs.photos ?? []).slice(0, 3).map((p) => ({
            url: p.url?.replace('square', 'medium') ?? p.url ?? null,
            licencia: p.license_code ?? 'desconocida',
          })),
          observador: obs.user?.login ?? 'Desconocido',
          urlObservacion: `https://www.inaturalist.org/observations/${obs.id ?? ''}`,
        };
      }),
    };
  }

  private parseTaxon(taxon: InatTaxonDetailed) {
    const conservacion = this.buildConservation(taxon);
    return {
      id: taxon.id,
      nombreCientifico: taxon.name,
      nombreComun: taxon.preferred_common_name ?? 'No disponible',
      rango: taxon.rank,
      tipoOrganismo: this.translateIconicTaxon(taxon.iconic_taxon_name),
      imagen: taxon.default_photo?.medium_url ?? null,
      wikipedia: taxon.wikipedia_url ?? null,
      descripcion: taxon.wikipedia_summary ?? null,
      estadoConservacion: conservacion,
      observacionesTotales: taxon.observations_count ?? 0,
      urlInaturalist: `https://www.inaturalist.org/taxa/${taxon.id ?? ''}`,
    };
  }
}

