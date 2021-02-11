import { Injectable } from '@nestjs/common';
import { RequestDataDto } from './dto/request-data.dto';
import { RequestRepository } from './request.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { User } from '../auth/user.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestRepository)
    private requestRepository: RequestRepository,
    private emailService: EmailService,
  ) {}

  async createRequest(requestDataDto: RequestDataDto, user: User) {
    try {
      const requestData = await this.requestRepository.createRequest(
        requestDataDto,
        user,
      );
      this.emailService.sendApprovalMail(requestData);
      // return this.requestRepository.createRequest(requestDataDto, user);
    } catch (error) {
      return error;
    }
  }

  getRequests(user: User): Promise<Request[]> {
    return this.requestRepository.getRequests(user);
  }

  getHomePageData() {
    return this.requestRepository.getHomePageData();
  }
}
