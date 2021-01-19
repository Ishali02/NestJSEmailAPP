import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Param,
  Get,
  Logger,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { ResponseDto } from './dto/response.dto';

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

  // @Post('/:id')
  // signUpComplete(@Param('id') id: number) {
  //   return this.authService.signUpComplete(id);
  // }

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
}
