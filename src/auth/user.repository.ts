import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserStagingEntity } from './user-staging.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUpComplete(userStaging: UserStagingEntity): Promise<boolean> {
    if (userStaging) {
      const user = new User();
      user.fullName = userStaging.fullName;
      user.username = userStaging.username;
      user.password = userStaging.password;
      user.salt = userStaging.salt;
      try {
        await user.save();
        return true;
      } catch (error) {
        if (error.code === '23505') {
          //duplicate username
          this.logger.debug(
            `Failed to create/insert user "${userStaging.username}" due to duplication.`,
            error.stack,
          );
          throw new ConflictException('Username already taken');
        } else {
          this.logger.debug(
            `Failed to create/insert user "${userStaging.username}"`,
            error.stack,
          );
          throw new InternalServerErrorException();
        }
        return false;
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      this.logger.debug(
        `User "${
          authCredentialsDto.username
        } failed to login due to incorrect credentials. Data: ${JSON.stringify(
          authCredentialsDto,
        )}"`,
      );
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
