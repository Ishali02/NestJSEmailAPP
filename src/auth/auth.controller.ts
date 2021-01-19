import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Param,
  Get,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { ResponseDto } from './dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<ResponseDto> {
    console.log(JSON.stringify(ResponseDto));
    return this.authService.signUp(authCredentialsDto);
  }

  // @Post('/:id')
  // signUpComplete(@Param('id') id: number) {
  //   return this.authService.signUpComplete(id);
  // }

  @Get('/:username')
  signUpComplete1(@Param('username') username: string) {
    return this.authService.signUpComplete(username);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
