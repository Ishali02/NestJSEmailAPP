import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserStagingRepository } from './user-staging.repository';
import { EmailService } from '../email/email.service';
import { ResponseDto } from './dto/response.dto';
import { getRepository, Transaction } from 'typeorm';
import { UserStagingEntity } from './user-staging.entity';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserStagingRepository)
    private userStagingRepository: UserStagingRepository,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<ResponseDto> {
    const responseDto: ResponseDto = { message: '' };
    const result = await this.userStagingRepository.signUpVerification(
      authCredentialsDto,
    );
    console.log(`result "${JSON.stringify(result)}"`);
    if (result) {
      this.emailService.example(authCredentialsDto);
      responseDto.message = 'Check your Email for verification';
    } else {
      responseDto.message = `Username ${authCredentialsDto.username} already exists`;
      console.log('Error: ' + JSON.stringify(responseDto));
    }
    return responseDto;
  }

  async signUpComplete(username: string): Promise<ResponseDto> {
    const responseDto: ResponseDto = { message: '' };
    const userStaging = await this.userStagingRepository.findOne({
      where: { username },
    });
    const result = await this.userRepository.signUpComplete(userStaging);
    console.log(`result ${JSON.stringify(result)}`);
    if (result)
      responseDto.message = `Account with username ${username} is created. You an login now `;
    return responseDto;
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
