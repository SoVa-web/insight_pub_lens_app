import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Keywords, ReviewRequestDto, ReviewResponseDto, SearchResponseDto } from './types/reviews.dto';
import { PublicationsRepository } from './publications.repository';
import { PublicationModel } from './types/publication.model';

type DataItem = {
  value: number;
};

type RangeStats = {
  range: string;
  count: number;
};

const DISTANCE_SAME_KEYWORDS: number = 0.3;

@Injectable()
export class PublicationsService {
  protected readonly logger = new Logger(PublicationsRepository.name);

  constructor(private readonly publicationsRepository: PublicationsRepository) {}

  async getReviews(dto: ReviewRequestDto): Promise<SearchResponseDto> {
    try {
      const preprocessData: PublicationModel[] = await this.publicationsRepository.getReviews(dto);
      const scores = this.score(dto.keywords, preprocessData);
      let rangedData = this.ranging(scores.result);
      rangedData = this.createLinks(rangedData);
      return {
        reviews: rangedData,
        total: rangedData.length,
        stat: scores.stat,
        arrayValue: scores.arrayValue,
      };
    } catch (err) {
      this.logger.error('Error in algorithm getReviews method', { err });
      throw new HttpException(`Error search: ${err}`, 500);
    }
  }

  createLinks(rangedData: ReviewResponseDto[]): ReviewResponseDto[] {
    const res = rangedData.map((r) => {
      if (r.source === 'arXiv') {
        r.link = 'https://arxiv.org/abs/' + r.id_from_source;
      }
      return r;
    });

    return res;
  }

  ranging(data: ReviewResponseDto[]): ReviewResponseDto[] {
    return data.sort((a, b) => b.value - a.value);
  }

  score(
    keywordsQuery: Keywords[],
    data: PublicationModel[],
  ): {
    result: ReviewResponseDto[];
    stat: RangeStats[];
    arrayValue: number[];
  } {
    const newData: ReviewResponseDto[] = [];

    for (const item of data) {
      let numberSimilar = 0;
      let weights = 0;
      if (item.keywords) {
        for (const keywordQuery of keywordsQuery) {
          for (const keyword of item.keywords) {
            //console.log(keyword + keywordQuery.keyword)
            const distance = this.editDistance(keyword, keywordQuery.keyword);
            if (distance <= DISTANCE_SAME_KEYWORDS) {
              numberSimilar += 1;
              weights += keywordQuery.priority;
              break;
            }
          }
        }
        //console.log(keywordsQuery)
        newData.push(
          Object.assign(
            { value: (numberSimilar * weights) / (keywordsQuery.length + item.keywords.length - numberSimilar) },
            item,
          ),
        );
      }
    }

    const stat = this.calculateRangeStats(newData);
    const arrayValue = newData.map((r) => r.value);
    return {
      result: newData,
      stat,
      arrayValue,
    };
  }

  editDistance(a: string, b: string): number {
    const matrix = [];

    // Ініціалізація першого рядка та стовпця матриці
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Заповнення матриці
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // заміна
            matrix[i][j - 1] + 1, // вставка
            matrix[i - 1][j] + 1, // видалення
          );
        }
      }
    }

    const distance = matrix[b.length][a.length];
    const maxLength = Math.max(a.length, b.length);

    // Нормалізація відстані до діапазону від 0 до 1
    return distance / maxLength;
  }

  calculateRangeStats(data: DataItem[]): RangeStats[] {
    const ranges: RangeStats[] = [
      { range: '0', count: 0 },
      { range: '(0, 0.1]', count: 0 },
      { range: '(0.1, 0.2]', count: 0 },
      { range: '(0.2, 0.3]', count: 0 },
      { range: '(0.3, 0.4]', count: 0 },
      { range: '(0.4, 0.5]', count: 0 },
      { range: '(0.5, 0.6]', count: 0 },
      { range: '(0.6, 0.7]', count: 0 },
      { range: '(0.7, 0.8]', count: 0 },
      { range: '(0.8, +infinity)', count: 0 },
    ];

    data.forEach((item) => {
      const value = item.value;
      if (value === 0) {
        ranges[0].count++;
      } else if (value > 0 && value <= 0.1) {
        ranges[1].count++;
      } else if (value > 0.1 && value <= 0.2) {
        ranges[2].count++;
      } else if (value > 0.2 && value <= 0.3) {
        ranges[3].count++;
      } else if (value > 0.3 && value <= 0.4) {
        ranges[4].count++;
      } else if (value > 0.4 && value <= 0.5) {
        ranges[5].count++;
      } else if (value > 0.5 && value <= 0.6) {
        ranges[6].count++;
      } else if (value > 0.6 && value <= 0.7) {
        ranges[7].count++;
      } else if (value > 0.7 && value <= 0.8) {
        ranges[8].count++;
      } else if (value > 0.8) {
        ranges[9].count++;
      }
    });

    return ranges;
  }
}
