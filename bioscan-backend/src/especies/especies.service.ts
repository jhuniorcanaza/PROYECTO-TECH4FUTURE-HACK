/**
 * ===================================================================
 * Especies — Service (PERSONA B)
 * ===================================================================
 * Datos locales + iNaturalist API para buscar especies.
 */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Datos del Cerro San Pedro (los mismos que tiene el frontend en especies.json)
const ESPECIES_LOCAL = [
  { id: 1, nombre_comun: 'Monterita de Cochabamba', nombre_cientifico: 'Poospiza garleppi', tipo: 'ave', estado_conservacion: 'en peligro', latitud: -17.381, longitud: -66.153 },
  { id: 2, nombre_comun: 'Zorro Andino', nombre_cientifico: 'Lycalopex culpaeus', tipo: 'mamifero', estado_conservacion: 'preocupacion menor', latitud: -17.385, longitud: -66.148 },
  { id: 3, nombre_comun: 'Quewiña', nombre_cientifico: 'Polylepis besseri', tipo: 'planta', estado_conservacion: 'vulnerable', latitud: -17.379, longitud: -66.155 },
  { id: 4, nombre_comun: 'Colibrí Gigante', nombre_cientifico: 'Patagona gigas', tipo: 'ave', estado_conservacion: 'preocupacion menor', latitud: -17.377, longitud: -66.149 },
  { id: 5, nombre_comun: 'Molle', nombre_cientifico: 'Schinus molle', tipo: 'planta', estado_conservacion: 'preocupacion menor', latitud: -17.383, longitud: -66.157 },
  { id: 6, nombre_comun: 'Cóndor Andino', nombre_cientifico: 'Vultur gryphus', tipo: 'ave', estado_conservacion: 'vulnerable', latitud: -17.372, longitud: -66.148 },
];

@Injectable()
export class EspeciesService {
  constructor(private readonly httpService: HttpService) {}

  obtenerTodas() {
    return ESPECIES_LOCAL;
  }

  async buscarCerca(lat: number, lng: number, radio: number) {
    try {
      const url = `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lng}&radius=${radio}&per_page=30&order=desc&order_by=created_at&quality_grade=research`;
      const { data } = await firstValueFrom(this.httpService.get(url));

      return data.results.map((obs: any) => ({
        id: obs.id,
        nombre: obs.species_guess || 'Desconocida',
        nombre_cientifico: obs.taxon?.name || '',
        foto: obs.photos?.[0]?.url?.replace('square', 'medium') || '',
        lat: parseFloat(obs.location?.split(',')[0]) || lat,
        lng: parseFloat(obs.location?.split(',')[1]) || lng,
        fecha: obs.observed_on || 'Sin fecha',
        tipo: obs.taxon?.iconic_taxon_name?.toLowerCase() || 'otro',
      }));
    } catch (error) {
      console.error('Error en iNaturalist:', error?.message);
      return ESPECIES_LOCAL;
    }
  }

  obtenerEstadisticas() {
    return {
      totalEspecies: 724,
      enPeligro: 47,
      observacionesHoy: Math.floor(Math.random() * 20) + 12,
      voluntariosActivos: 156,
      avesRegistradas: 104,
      plantasRegistradas: 527,
      mariposasRegistradas: 41,
    };
  }
}
