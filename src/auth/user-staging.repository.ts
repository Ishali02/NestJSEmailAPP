import { EntityRepository, Repository } from 'typeorm';
import { UserStagingEntity } from './user-staging.entity';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@EntityRepository(UserStagingEntity)
export class UserStagingRepository extends Repository<UserStagingEntity> {
  private logger = new Logger('UserStagingRepository');

  async signUpVerification(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<boolean> {
    const { username, password, fullName } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const user = new UserStagingEntity();
    user.fullName = fullName;
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);
    try {
      await user.save();
      return true;
    } catch (error) {
      if (error.code === '23505') {
        //duplicate username
        this.logger.debug(
          `Failed to send mail user "${
            authCredentialsDto.username
          }" for verification due to duplication. User: ${JSON.stringify(
            authCredentialsDto,
          )}`,
          error.stack,
        );
        throw new ConflictException('Username already exists');
      } else {
        this.logger.debug(
          `Failed to send mail to verify User ${authCredentialsDto.username}`,
          error.stack,
        );
        throw new InternalServerErrorException();
      }
      return false;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
