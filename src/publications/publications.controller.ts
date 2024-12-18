import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReviewRequestDto, ReviewResponseDto, SearchResponseDto } from './types/reviews.dto';
import { PublicationsService } from './publications.service';
import { PublicationModel } from './types/publication.model';

@ApiTags('publications')
@Controller('publications')
export class PublicationsController {
  constructor(private publicatiionsService: PublicationsService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SearchResponseDto })
  async search(@Body(ValidationPipe) dto: ReviewRequestDto): Promise<SearchResponseDto> {
    return await this.publicatiionsService.getReviews(dto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PublicationModel })
  async getPublication(@Param('id', ValidationPipe) id: number): Promise<PublicationModel> {
    return await this.publicatiionsService.getReview(id);
  }
}
