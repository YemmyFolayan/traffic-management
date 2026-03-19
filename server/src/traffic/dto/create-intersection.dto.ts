import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { IntersectionStatus } from '../../common/enums';

export class CreateIntersectionDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @Min(1)
  @Max(8)
  @IsOptional()
  laneCount?: number;

  @IsNumber()
  @Min(10)
  @IsOptional()
  capacity?: number;

  @IsEnum(IntersectionStatus)
  @IsOptional()
  status?: IntersectionStatus;
}
