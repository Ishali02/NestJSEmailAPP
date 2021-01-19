import { Body, Controller, Get, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestDataDto } from './dto/request-data.dto';
import { Request } from './request.entity';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post()
  createRequest(@Body() requestDataDto: RequestDataDto) {
    this.requestService.createRequest(requestDataDto);
  }

  @Get()
  getRequests(): Promise<Request[]> {
    return this.requestService.getRequests();
  }
}
