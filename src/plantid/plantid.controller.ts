import { Controller, Get, Post, Body } from '@nestjs/common';
import { PlantidService } from './plantid.service';
import { IdentifyPlantDto } from './dto/identify-plant.dto';

@Controller('plantid')
export class PlantidController {
  constructor(private readonly plantidService: PlantidService) {}

  /**
   * GET /plantid/test
   * Endpoint de prueba: verifica que la API key se lee correctamente.
   */
  @Get('test')
  testConnection() {
    return this.plantidService.checkConnection();
  }

  /**
   * GET /plantid/test-with-sample
   * Prueba con una imagen de ejemplo descargada de internet
   */
  @Get('test-with-sample')
  async testWithSample() {
    return this.plantidService.identifyWithSampleImage();
  }

  /**
   * POST /plantid/identify
   * Envía una imagen en base64 y devuelve la identificación de la planta.
   *
   * Body esperado (JSON):
   * {
   *   "image": "data:image/jpeg;base64,/9j/4AAQ..."
   * }
   */
  @Post('identify')
  async identify(@Body() dto: IdentifyPlantDto) {
    return this.plantidService.identifyPlant(dto.image);
  }
}
