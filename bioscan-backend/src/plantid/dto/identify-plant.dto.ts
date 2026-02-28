import { IsNotEmpty, IsString } from 'class-validator';

export class IdentifyPlantDto {
  /**
   * Imagen de la planta codificada en base64
   * @example "data:image/jpeg;base64,/9j/4AAQ..."
   */
  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  @IsString({ message: 'La imagen debe ser un string en base64' })
  image: string;
}

