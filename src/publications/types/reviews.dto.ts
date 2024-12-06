import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { number } from 'joi';

export class Keywords {
  @ApiProperty()
  @IsString()
  keyword!: string;

  @ApiProperty()
  @IsNumber()
  priority!: number;
}

export class ReviewRequestDto {
  @ApiProperty({ type: [Keywords], required: false })
  keywords!: Keywords[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  numberOfResult?: number;
}

export class ReviewResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  abstract?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authors?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  journal_ref?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id_from_source?: string;

  @ApiProperty()
  @IsArray()
  keywords!: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  doi?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty()
  @IsNumber()
  value!: number;
}

class RangeStats {
  @ApiProperty()
  range!: string;

  @ApiProperty()
  count!: number;
}

export class SearchResponseDto {
  @ApiProperty({
    type: [ReviewResponseDto],
  })
  reviews!: ReviewResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty({
    type: [RangeStats],
  })
  stat!: RangeStats[];

  @ApiProperty({
    type: [Number],
  })
  arrayValue!: number[];
}
