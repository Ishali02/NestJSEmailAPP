import { Injectable } from '@nestjs/common';
import { RequestDataDto } from './dto/request-data.dto';
import { RequestRepository } from './request.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestRepository)
    private requestRepository: RequestRepository,
  ) {}

  createRequest(requestDataDto: RequestDataDto) {
    return this.requestRepository.createRequest(requestDataDto);
  }

  getRequests(): Promise<Request[]> {
    return this.requestRepository.getRequests();
  }
}
