import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Param,
  Get,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { ResponseDto } from './dto/response.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<ResponseDto> {
    this.logger.verbose(
      `User "${
        authCredentialsDto.username
      } is signing up for email verification". SignUp Data: ${JSON.stringify(
        authCredentialsDto,
      )}`,
    );
    return this.authService.signUp(authCredentialsDto);
  }

  @Get('/:username')
  signUpComplete1(@Param('username') username: string) {
    this.logger.verbose(`User ${username}  email verified.`);
    return this.authService.signUpComplete(username);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`User "${authCredentialsDto.username}" logged in`);
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  getTest(
    @GetUser()
    user: User,
  ) {
    console.log(user);
  }
}
