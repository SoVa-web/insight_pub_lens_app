import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReviewRequestDto, SearchResponseDto } from './types/reviews.dto';
import { PublicationsService } from './publications.service';

@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private publicatiionsService: PublicationsService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SearchResponseDto })
  async getAllPropertyAds(@Body(ValidationPipe) dto: ReviewRequestDto): Promise<SearchResponseDto> {
    return await this.publicatiionsService.getReviews(dto);
  }
}
