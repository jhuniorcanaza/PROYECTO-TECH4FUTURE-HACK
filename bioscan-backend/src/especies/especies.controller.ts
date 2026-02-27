/**
 * ===================================================================
 * Especies — Controller (PERSONA B)
 * ===================================================================
 */
import { Controller, Get, Query } from '@nestjs/common';
import { EspeciesService } from './especies.service';

@Controller('especies')
export class EspeciesController {
  constructor(private readonly especiesService: EspeciesService) {}

  @Get()
  obtenerTodas() {
    return this.especiesService.obtenerTodas();
  }

  @Get('cerca')
  async obtenerCerca(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radio') radio: string,
  ) {
    return this.especiesService.buscarCerca(
      parseFloat(lat) || -17.383,
      parseFloat(lng) || -66.152,
      parseInt(radio) || 15,
    );
  }

  @Get('estadisticas')
  obtenerEstadisticas() {
    return this.especiesService.obtenerEstadisticas();
  }
}
