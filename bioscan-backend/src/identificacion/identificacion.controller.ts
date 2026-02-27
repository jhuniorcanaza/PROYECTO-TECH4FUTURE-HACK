/**
 * ===================================================================
 * Identificación de Especies — Controller (PERSONA B)
 * ===================================================================
 * Recibe una imagen del frontend y la envía a Plant.id para identificar.
 */
import { Controller, Post, Body } from '@nestjs/common';
import { IdentificacionService } from './identificacion.service';

@Controller('identificar')
export class IdentificacionController {
  constructor(private readonly identificacionService: IdentificacionService) {}

  @Post()
  async identificar(@Body() body: { imagen: string }) {
    return this.identificacionService.identificarEspecie(body.imagen);
  }
}
