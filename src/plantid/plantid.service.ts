import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlantidService {
  private readonly logger = new Logger(PlantidService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://plant.id/api/v3/identification';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('PLANTID_API_KEY', '');
    if (!this.apiKey) {
      throw new Error('PLANTID_API_KEY no está configurada en el archivo .env');
    }
  }

  /** Verifica que la API key se está leyendo correctamente */
  checkConnection(): { status: string; keyPreview: string } {
    return {
      status: 'ok',
      keyPreview: `${this.apiKey.substring(0, 4)}****`,
    };
  }

  /** Detecta el mimetype correcto por extensión del archivo */
  getMimetypeFromFilename(filename: string, fallback: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const map: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };
    return map[ext ?? ''] ?? fallback;
  }

  /** Recibe buffer de imagen, lo convierte a base64 y llama a Plant.id */
  async identifyPlantFromBuffer(buffer: Buffer, filename: string, fallbackMime: string) {
    const mimetype = this.getMimetypeFromFilename(filename, fallbackMime);
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowed.includes(mimetype)) {
      throw new HttpException(
        'Solo se permiten imágenes en formato JPG, PNG o WEBP',
        HttpStatus.BAD_REQUEST,
      );
    }

    const base64Image = `data:${mimetype};base64,${buffer.toString('base64')}`;
    this.logger.log(`Imagen recibida (${mimetype}), enviando a Plant.id...`);
    return this.identifyPlant(base64Image);
  }

  /** Prueba con imagen de muestra */
  async identifyWithSampleImage() {
    try {
      const imageUrl = 'https://plant.id/media/imgs/6e04c820faa44bfbb98c7e911e8fe4f8.jpg';
      this.logger.log('Descargando imagen de ejemplo...');
      const imageResponse = await firstValueFrom(
        this.httpService.get(imageUrl, { responseType: 'arraybuffer' }),
      );
      const base64Image = `data:image/jpeg;base64,${Buffer.from(imageResponse.data).toString('base64')}`;
      return await this.identifyPlant(base64Image);
    } catch (error) {
      throw new HttpException(
        { message: 'Error en la prueba con imagen de ejemplo', detail: error?.response?.data || error.message },
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** Envía imagen en base64 a Plant.id y devuelve solo los datos relevantes de la planta */
  async identifyPlant(imageBase64: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          { images: [imageBase64], similar_images: true },
          {
            headers: {
              'Api-Key': this.apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log('Identificación realizada con éxito');
      return this.parsePlantResult(response.data);
    } catch (error) {
      this.logger.error('Error al llamar a Plant.id', error?.response?.data || error.message);
      throw new HttpException(
        { message: 'Error al identificar la planta con Plant.id', detail: error?.response?.data || error.message },
        error?.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /** Filtra y devuelve solo los datos más relevantes de la planta identificada */
  private parsePlantResult(data: any) {
    const suggestions = data?.result?.classification?.suggestions ?? [];

    if (!suggestions.length) {
      return {
        esPlanta: false,
        mensaje: 'No se pudo identificar ninguna planta en la imagen',
      };
    }

    // Tomamos la sugerencia con mayor probabilidad (ya viene ordenada)
    const mejor = suggestions[0];

    return {
      esPlanta: data?.result?.is_plant?.binary ?? true,
      probabilidadPlanta: `${((data?.result?.is_plant?.probability ?? 0) * 100).toFixed(1)}%`,
      planta: {
        nombreCientifico: mejor.name,
        nombreComun: mejor.details?.common_names?.[0] ?? 'No disponible',
        otrosNombres: mejor.details?.common_names?.slice(1) ?? [],
        probabilidadIdentificacion: `${((mejor.probability ?? 0) * 100).toFixed(1)}%`,
        descripcion: mejor.details?.description?.value ?? 'No disponible',
        taxonomia: {
          reino: mejor.details?.taxonomy?.kingdom ?? 'No disponible',
          filo: mejor.details?.taxonomy?.phylum ?? 'No disponible',
          clase: mejor.details?.taxonomy?.class ?? 'No disponible',
          orden: mejor.details?.taxonomy?.order ?? 'No disponible',
          familia: mejor.details?.taxonomy?.family ?? 'No disponible',
          genero: mejor.details?.taxonomy?.genus ?? 'No disponible',
        },
        imagenesSimilares: (mejor.similar_images ?? []).slice(0, 3).map((img: any) => ({
          url: img.url,
          similitud: `${((img.similarity ?? 0) * 100).toFixed(1)}%`,
        })),
        wikipedia: mejor.details?.url ?? null,
      },
      otrasSugerencias: suggestions.slice(1, 4).map((s: any) => ({
        nombreCientifico: s.name,
        nombreComun: s.details?.common_names?.[0] ?? 'No disponible',
        probabilidad: `${((s.probability ?? 0) * 100).toFixed(1)}%`,
      })),
    };
  }
}
