import {
  EntityRepository,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';
import { Request } from './request.entity';
import { RequestDataDto } from './dto/request-data.dto';
import { User } from '../auth/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Software } from './software.entity';

@EntityRepository(Request)
export class RequestRepository extends Repository<Request> {
  private logger = new Logger('RequestRepository');

  async createRequest(
    requestDataDto: RequestDataDto,
    user: User,
  ): Promise<Request> {
    const { managerId, itTeamId, softwareTeamId, swId } = requestDataDto;
    console.log('request ->' + JSON.stringify(requestDataDto));
    const request = new Request();
    request.manager = managerId;
    request.itTeam = itTeamId;
    request.softwareTeam = softwareTeamId;
    request.sw = +swId;
    request.reqStatus = 1;
    request.reqDate = new Date();
    request.reqApproved = 0;
    request.user = user;
    try {
      await request.save();
      // const req = await getManager()
      //   .createQueryBuilder(Request, 'request')
      //   .select('request.requestId')
      //   .addSelect('request.reqDate')
      //   .addSelect('request.reqStatus')
      //   .addSelect('request.reqApproved')
      //   .addSelect('request.userId')
      //   .addSelect('request.managerId')
      //   .addSelect('request.itTeamId')
      //   .addSelect('request.softwareTeamId')
      //   .addSelect('request.swId')
      //   .addSelect('u1.username', 'userEmailId')
      //   .addSelect('u2.username', 'managerEmailId')
      //   .addSelect('u3.username', 'itEmailId')
      //   .addSelect('u4.username', 'softwareEmailId')
      //   .addSelect('u1.fullName', 'userName')
      //   .addSelect('u2.fullName', 'managerName')
      //   .addSelect('u3.fullName', 'itName')
      //   .addSelect('u4.fullName', 'softwareName')
      //   .addSelect('sw.swName', 'swName')
      //   .innerJoin(User, 'u1', 'u1.id=request.userId')
      //   .innerJoin(User, 'u2', 'u2.id=request.managerId')
      //   .innerJoin(User, 'u3', 'u3.id=request.itTeamId')
      //   .innerJoin(User, 'u4', 'u4.id=request.softwareTeamId')
      //   .innerJoin(Software, 'sw', 'sw.id=request.swId')
      //   .where('request.requestId = 1')
      //   .getRawMany();
      const repo1 = getRepository(Request);
      const data = await repo1.findOne({
        where: { requestId: 1 },
        relations: ['user', 'manager', 'itTeam', 'softwareTeam', 'sw'],
      });
      console.log(`data : ${JSON.stringify(data)}`);
      this.getHomePageData();

      return data;
      // const user = data.manager['fullName'];
      // console.log(`user : ${JSON.stringify(user)}`);
    } catch (error) {
      console.log(error.code);
      if (error.code === '23503') {
        //foreign key violation:
        this.logger.debug(
          `Failed to create/insert request for user"${user.username}" due to foreign key violation.`,
          error.stack,
        );
        throw new ConflictException();
      } else {
        this.logger.debug(
          `Failed to create/insert request for user "${user.username}"`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
    }
  }

  async getRequests(user: User): Promise<Request[]> {
    const query = this.createQueryBuilder('request');
    query.where('request.userId = :userId', { userId: user.id });
    return await query.getMany();
  }

  async getHomePageData() {
    const repo = getRepository(User);
    const repo1 = getRepository(Software);
    const managerData = await repo
      .createQueryBuilder('user')
      .select(['user.id', 'user.fullName'])
      .where('user.role= :manager', { manager: 'manager' })
      .getRawMany();
    const itTeamData = await repo
      .createQueryBuilder('user')
      .select(['user.id', 'user.fullName'])
      .where('user.role= :manager', { manager: 'it_Team' })
      .getRawMany();
    const softwareTeamData = await repo
      .createQueryBuilder('user')
      .select(['user.id', 'user.fullName'])
      .where('user.role= :manager', { manager: 'software_Team' })
      .getRawMany();
    const swData = await repo1.find();
    console.log(`MAnger Data ${JSON.stringify(managerData[0])}`);
    console.log(`MAnger Data ${JSON.stringify(itTeamData[0].user_id)}`);
    console.log(`MAnger Data ${JSON.stringify(softwareTeamData[0].user_id)}`);
    console.log(`MAnger Data ${JSON.stringify(swData)}`);
    const arrayData: [any[]] = [['']];
    arrayData.push(managerData);
    arrayData.push(itTeamData);
    arrayData.push(softwareTeamData);
    arrayData.push(swData);

    return arrayData;
  }
}
