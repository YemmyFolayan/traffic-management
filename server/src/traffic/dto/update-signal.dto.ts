import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { SignalPhase } from '../../common/enums';

export class UpdateSignalDto {
  @IsEnum(SignalPhase)
  @IsOptional()
  currentPhase?: SignalPhase;

  @IsNumber()
  @Min(5)
  @IsOptional()
  greenDuration?: number;

  @IsNumber()
  @Min(2)
  @IsOptional()
  yellowDuration?: number;

  @IsNumber()
  @Min(5)
  @IsOptional()
  redDuration?: number;
}
