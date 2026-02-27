/**
 * ===================================================================
 * Identificación de Especies — Service (PERSONA B)
 * ===================================================================
 * Lógica para conectar con Plant.id API (o Azure Custom Vision).
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IdentificacionService {
  private readonly plantIdKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.plantIdKey = this.configService.get<string>('PLANT_ID_KEY', '');
  }

  async identificarEspecie(imagenBase64: string) {
    try {
      if (!this.plantIdKey) {
        // Sin API key → devolver dato demo
        return this.datoDemo();
      }

      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://plant.id/api/v3/identification',
          {
            images: [imagenBase64],
            similar_images: true,
          },
          {
            headers: {
              'Api-Key': this.plantIdKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const mejor = data.result.classification.suggestions[0];
      return {
        nombre: mejor.name,
        nombre_cientifico: mejor.name,
        probabilidad: Math.round(mejor.probability * 100),
        descripcion:
          mejor.details?.description?.value ||
          'Especie identificada en el Cerro San Pedro.',
        tipo: 'planta',
        estado_conservacion: 'por evaluar',
        similar_images: mejor.similar_images || [],
      };
    } catch (error) {
      console.error('Error en Plant.id:', error?.message);
      return this.datoDemo();
    }
  }

  private datoDemo() {
    const demos = [
      {
        nombre: 'Quewiña (Polylepis besseri)',
        nombre_cientifico: 'Polylepis besseri',
        probabilidad: 94,
        descripcion:
          'Árbol nativo de gran importancia ecológica. Sus bosques albergan la Monterita de Cochabamba.',
        tipo: 'planta',
        estado_conservacion: 'vulnerable',
      },
      {
        nombre: 'Molle (Schinus molle)',
        nombre_cientifico: 'Schinus molle',
        probabilidad: 91,
        descripcion:
          'Árbol nativo aromático, tradicionalmente usado como medicina.',
        tipo: 'planta',
        estado_conservacion: 'preocupacion menor',
      },
    ];
    return demos[Math.floor(Math.random() * demos.length)];
  }
}
