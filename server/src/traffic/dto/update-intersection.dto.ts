import { IsString, IsNumber, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { IntersectionStatus } from '../../common/enums';

export class UpdateIntersectionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

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
