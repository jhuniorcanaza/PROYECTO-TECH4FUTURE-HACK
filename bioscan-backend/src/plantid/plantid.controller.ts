import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
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

  /**
   * POST /plantid/identify-upload
   * Sube una imagen directamente (JPG, PNG, WEBP) y devuelve la identificación.
   * Usar: form-data con campo "file" → archivo de imagen
   */
  @Post('identify-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // máximo 10 MB
    }),
  )
  async identifyUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Debes subir una imagen en el campo "file"');
    }
    return this.plantidService.identifyPlantFromBuffer(
      file.buffer,
      file.originalname,  // usamos el nombre del archivo para detectar la extensión
      file.mimetype,
    );
  }
}
