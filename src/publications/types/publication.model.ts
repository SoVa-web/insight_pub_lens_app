export interface PublicationEntity {
  id: number;
  source: string;
  id_from_source?: string;
  title?: string;
  doi?: string;
  abstract?: string;
  keywords: string[];
  authors?: string;
  journal_ref?: string;
  year?: number;
  updatedAt: Date;
  createdAt: Date;
}

export class PublicationModel implements PublicationEntity {
  id!: number;
  source!: string;
  id_from_source?: string;
  title?: string;
  doi?: string;
  abstract?: string;
  keywords!: string[];
  authors?: string;
  journal_ref?: string;
  year?: number;
  updatedAt!: Date;
  createdAt!: Date;
}
