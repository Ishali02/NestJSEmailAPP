import { EntityRepository, Repository } from 'typeorm';
import { Request } from './request.entity';
import { RequestDataDto } from './dto/request-data.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Request)
export class RequestRepository extends Repository<Request> {
  async createRequest(requestDataDto: RequestDataDto, user: User) {
    const { managerId, itTeamId, softwareTeamId, swId } = requestDataDto;
    console.log('request ->' + JSON.stringify(requestDataDto));
    const request = new Request();
    request.managerId = managerId;
    request.itTeamId = itTeamId;
    request.softwareTeamId = softwareTeamId;
    request.swId = swId;
    request.reqStatus = 1;
    request.reqDate = new Date();
    request.reqApproved = 0;
    request.user = user;
    await request.save();
  }

  async getRequests(user: User): Promise<Request[]> {
    const query = this.createQueryBuilder('request');
    query.where('request.userId = :userId', { userId: user.id });
    const requests = await query.getMany();
    return requests;
  }
}
