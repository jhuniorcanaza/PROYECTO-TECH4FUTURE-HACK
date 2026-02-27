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

  /**
   * Comprueba que la API key se está leyendo (solo para pruebas).
   */
  checkConnection(): { status: string; keyPreview: string } {
    return {
      status: 'ok',
      keyPreview: `${this.apiKey.substring(0, 4)}****`,
    };
  }

  /**
   * Prueba con una imagen de muestra descargada de internet
   */
  async identifyWithSampleImage() {
    try {
      // Descargar una imagen de ejemplo de una rosa
      const imageUrl = 'https://plant.id/media/imgs/6e04c820faa44bfbb98c7e911e8fe4f8.jpg';

      this.logger.log('Descargando imagen de ejemplo...');
      const imageResponse = await firstValueFrom(
        this.httpService.get(imageUrl, { responseType: 'arraybuffer' }),
      );

      // Convertir a base64
      const base64Image = `data:image/jpeg;base64,${Buffer.from(imageResponse.data).toString('base64')}`;

      this.logger.log('Imagen convertida a base64, enviando a Plant.id...');

      // Llamar a la API de identificación
      return await this.identifyPlant(base64Image);
    } catch (error) {
      this.logger.error('Error en prueba con imagen de ejemplo', error?.response?.data || error.message);
      throw new HttpException(
        {
          message: 'Error en la prueba con imagen de ejemplo',
          detail: error?.response?.data || error.message,
        },
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Envía una imagen en base64 a Plant.id y devuelve la identificación.
   */
  async identifyPlant(imageBase64: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          {
            images: [imageBase64],
            // Datos extra que Plant.id puede devolver
            similar_images: true,
          },
          {
            headers: {
              'Api-Key': this.apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log('Identificación realizada con éxito');
      return response.data;
    } catch (error) {
      this.logger.error('Error al llamar a Plant.id', error?.response?.data || error.message);
      throw new HttpException(
        {
          message: 'Error al identificar la planta con Plant.id',
          detail: error?.response?.data || error.message,
        },
        error?.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
