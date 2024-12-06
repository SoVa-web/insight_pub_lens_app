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
      const result = await this.databaseService.query<PublicationModel>(
        `
      SELECT *, ts_rank(search_vector, to_tsquery('english', $1)) AS rank
      FROM "${TABLE_PUBLICATIONS}"
      WHERE search_vector @@ to_tsquery('english', $1)
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
}
