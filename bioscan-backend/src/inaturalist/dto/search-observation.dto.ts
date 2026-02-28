import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchObservationDto {
  @IsOptional()
  @IsString()
  q?: string; // Búsqueda por nombre común o científico

  @IsOptional()
  @IsString()
  taxon_name?: string; // Nombre del taxón

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  taxon_id?: number; // ID del taxón

  @IsOptional()
  @IsString()
  place_name?: string; // Nombre del lugar

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  @Type(() => Number)
  per_page?: number = 10; // Resultados por página (máx 200)

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
}

