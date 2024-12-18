import { ApiProperty } from "@nestjs/swagger";

export interface PublicationEntity {
  id: number;
  source: string;
  id_from_source?: string;
  title?: string;
  doi?: string;
  link?: string;
  abstract?: string;
  keywords: string[];
  authors?: string;
  journal_ref?: string;
  year?: number;
  updatedAt: Date;
  createdAt: Date;
}

export class PublicationModel implements PublicationEntity {
  
  @ApiProperty()
    id!: number;
  
  @ApiProperty()
    source!: string;
  
  @ApiProperty()
    id_from_source?: string;
  
  @ApiProperty()
    title?: string;
  
  @ApiProperty()
    doi?: string;

  @ApiProperty()
    link?: string;
  
  @ApiProperty()
    abstract?: string;
  
  @ApiProperty()
    keywords!: string[];
  
  @ApiProperty()
    authors?: string;
  
  @ApiProperty()
    journal_ref?: string;
  
  @ApiProperty()
    year?: number;
  
  @ApiProperty()
    updatedAt!: Date;
  
  @ApiProperty()
    createdAt!: Date;
}
