import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestDataDto } from './dto/request-data.dto';
import { Request } from './request.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('request')
@UseGuards(AuthGuard())
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post()
  createRequest(@GetUser() user: User, @Body() requestDataDto: RequestDataDto) {
    this.requestService.createRequest(requestDataDto, user);
  }

  @Get()
  getRequests(@GetUser() user: User): Promise<Request[]> {
    return this.requestService.getRequests(user);
  }
}
