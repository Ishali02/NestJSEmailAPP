import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserStagingEntity } from './user-staging.entity';
import { UserStagingRepository } from './user-staging.repository';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUpComplete(userStaging: UserStagingEntity): Promise<boolean> {
    if (userStaging) {
      const user = new User();
      user.username = userStaging.username;
      user.password = userStaging.password;
      user.salt = userStaging.salt;
      try {
        await user.save();
        return true;
      } catch (error) {
        if (error.code === '23505') {
          //duplicate username
          throw new ConflictException('Username already taken');
        } else {
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
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}