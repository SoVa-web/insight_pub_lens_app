import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Keywords {
  @ApiProperty()
  @IsString()
  keyword!: string;

  @ApiProperty()
  @IsNumber()
  priority!: number;
}

export class ReviewRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  query!: string;

  @ApiProperty({ type: [Keywords], required: false })
  @IsOptional()
  keywords?: Keywords[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  numberOfResult?: number;
}

export class ReviewResponseDto {
  @ApiProperty()
  id!: string;

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
