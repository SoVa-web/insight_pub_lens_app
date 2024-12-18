import { Injectable, Logger } from '@nestjs/common';
import { AppRepository } from '../app.repository';
import { ReviewRequestDto } from './types/reviews.dto';
import { PublicationModel } from './types/publication.model';
import { TABLE_PUBLICATIONS } from '../database/tables';

@Injectable()
export class PublicationsRepository extends AppRepository {
  protected readonly logger = new Logger(PublicationsRepository.name);

  async getReviews(dto: ReviewRequestDto): Promise<PublicationModel[]> {
    try {
      const keywords: string[] = dto.keywords.map((r) => r.keyword.replace(' ', ' | '));
      const queryString = keywords.join(' | ');

      let conditions: string = `search_vector @@ to_tsquery('english', $1)`
      if (dto.title) conditions = `search_vector @@ to_tsquery('english', '${dto.title}') AND ` + conditions
      if (dto.author) conditions = `authors ILIKE '%${dto.author}%' AND ` + conditions
      if (dto.year) conditions = `year = ${dto.year} AND ` + conditions
      
      const result = await this.databaseService.query<PublicationModel>(
        `
      SELECT *, ts_rank(search_vector, to_tsquery('english', $1)) AS rank
      FROM "${TABLE_PUBLICATIONS}"
      WHERE ${conditions}
      ORDER BY rank DESC
      LIMIT 1000;
      `,
        [queryString],
      );

      return result.rows ?? [];
    } catch (err) {
      this.logger.error('Database error in getReview method', { err });
      return [];
    }
  }

  async getReview(id: number): Promise<PublicationModel> {
    const result = await this.databaseService.query<PublicationModel>(
      `
    SELECT *
    FROM "${TABLE_PUBLICATIONS}"
    WHERE id = $1;
    `,
      [id],
    );

    return result.rows[0] ?? null
  }
}
