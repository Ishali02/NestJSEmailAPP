import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { UserStagingEntity } from './user-staging.entity';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { UserStagingRepository } from './user-staging.repository';
import { UserRepository } from './user.repository';
import { AuthController } from './auth.controller';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as request from 'supertest';
import { AuthModule } from './auth.module';

describe('Authentication Controller', () => {
  let authController: AuthController;
  const mockEmailService = () => ({
    example: jest.fn(() => 'success'),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        AuthModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        TypeOrmModule.forFeature([UserStagingEntity, User]),
        JwtModule.registerAsync({
          useFactory: async () => ({
            secret: 'topSecret51',
            signOptions: {
              expiresIn: 3600,
            },
          }),
        }),
        EmailModule,
        PassportModule,
      ],
      providers: [
        AuthService,
        { provide: EmailService, useFactory: mockEmailService },
        UserStagingRepository,
        UserRepository,
      ],
    }).compile();
    authController = module.get<AuthController>(AuthController);
  });
  describe('When registering', () => {
    let authDto2: AuthCredentialsDto;
    beforeEach(() => {
      authDto2 = {
        username: 'xyz123@gmail.com',
        password: 'XYZ@123456',
        fullName: 'ABC XYZ',
      };
    });
    it(' done successfully and email is sent', async (done) => {
      const result = await authController.signUp(authDto2);
      expect(result).toEqual({ message: 'Check your Email for verification' });
      done();
    });
    it(' is failed and email is not sent', async (done) => {
      const result = await authController.signUp(authDto2);
      expect(result).toEqual({
        message: `Username ${authDto2.username} already exists`,
      });
      done();
    });
  });
});
