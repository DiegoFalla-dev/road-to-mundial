import { IsString, Length } from 'class-validator';

/** Parámetros para comparar/predicir entre dos selecciones. */
export class CompareQueryDto {
  @IsString()
  @Length(2, 40)
  home!: string;

  @IsString()
  @Length(2, 40)
  away!: string;
}
