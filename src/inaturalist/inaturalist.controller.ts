import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { InaturalistService } from './inaturalist.service';
import { SearchObservationDto } from './dto/search-observation.dto';

@Controller('inaturalist')
export class InaturalistController {
  constructor(private readonly inaturalistService: InaturalistService) {}

  /**
   * GET /api/inaturalist/test
   * Verifica que el token de iNaturalist está configurado correctamente.
   */
  @Get('test')
  testConnection() {
    return this.inaturalistService.checkConnection();
  }

  /**
   * GET /api/inaturalist/observations
   * Busca observaciones en iNaturalist.
   *
   * Query params opcionales:
   *   - q            : término de búsqueda general
   *   - taxon_name   : nombre del taxón  (ej: "Panthera leo")
   *   - taxon_id     : ID numérico del taxón
   *   - place_name   : nombre del lugar
   *   - per_page     : resultados por página (máx 200, default 10)
   *   - page         : número de página (default 1)
   *
   * Ejemplo: GET /api/inaturalist/observations?taxon_name=Quercus&per_page=5
   */
  @Get('observations')
  async searchObservations(@Query() query: SearchObservationDto) {
    return this.inaturalistService.searchObservations(query);
  }

  /**
   * GET /api/inaturalist/taxa/search?q=leon
   * Busca taxones (plantas, animales, hongos…) por nombre.
   *
   * Query params:
   *   - q        : término de búsqueda
   *   - per_page : resultados por página (default 10)
   *
   * Ejemplo: GET /api/inaturalist/taxa/search?q=leon&per_page=5
   */
  @Get('taxa/search')
  async searchTaxa(
    @Query('q') query: string,
    @Query('per_page') perPage?: number,
  ) {
    return this.inaturalistService.searchTaxa(query, perPage ?? 10);
  }

  /**
   * GET /api/inaturalist/taxa/:id
   * Información detallada de un taxón por su ID.
   *
   * Ejemplos de IDs conocidos:
   *   - 1      → Animalia (Reino Animal)
   *   - 47126  → Angiosperms (Plantas con flores)
   *   - 47792  → Aves (Pájaros)
   *   - 40151  → Mammalia (Mamíferos)
   *
   * Ejemplo: GET /api/inaturalist/taxa/47792
   */
  @Get('taxa/:id')
  async getTaxon(@Param('id', ParseIntPipe) id: number) {
    return this.inaturalistService.getTaxonById(id);
  }

  /**
   * POST /api/inaturalist/identify
   * Sube una imagen y devuelve las sugerencias de identificación de
   * animales, plantas, hongos u otros seres vivos usando la Computer
   * Vision de iNaturalist.
   *
   * Body: form-data
   *   - file : archivo de imagen (JPG, PNG, WEBP, GIF) — máx 10 MB
   *
   * Ejemplo de respuesta:
   * {
   *   "ancestroComun": { "nombreCientifico": "Felidae", ... },
   *   "sugerencias": [
   *     { "puntuacion": "92.5%", "taxon": { "nombreComun": "León", ... } },
   *     ...
   *   ]
   * }
   */
  @Post('identify')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB máx
    }),
  )
  async identifyFromUpload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Debes enviar un archivo de imagen en el campo "file"',
      );
    }
    return this.inaturalistService.identifyFromBuffer(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }
}
