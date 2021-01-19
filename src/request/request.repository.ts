import { EntityRepository, Repository } from 'typeorm';
import { Request } from './request.entity';
import { RequestDataDto } from './dto/request-data.dto';

@EntityRepository(Request)
export class RequestRepository extends Repository<Request> {
  async createRequest(requestDataDto: RequestDataDto) {
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
    await request.save();
  }

  async getRequests(): Promise<Request[]> {
    const query = this.createQueryBuilder('request');
    const requests = await query.getMany();
    return requests;
  }
}
