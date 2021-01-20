import { Injectable } from '@nestjs/common';
import { RequestDataDto } from './dto/request-data.dto';
import { RequestRepository } from './request.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestRepository)
    private requestRepository: RequestRepository,
  ) {}

  createRequest(requestDataDto: RequestDataDto, user: User) {
    return this.requestRepository.createRequest(requestDataDto, user);
  }

  getRequests(user: User): Promise<Request[]> {
    return this.requestRepository.getRequests(user);
  }
}
