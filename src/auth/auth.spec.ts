import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { UserStagingRepository } from './user-staging.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { PassportModule } from '@nestjs/passport';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserStagingEntity } from './user-staging.entity';
import { AuthModule } from './auth.module';
import { typeOrmConfig } from '../config/typeorm.config';
import {
  getConnection,
  getCustomRepository,
  getRepository,
  Repository,
} from 'typeorm';
import {
  initialiseTestTransactions,
  runInTransaction,
} from 'typeorm-test-transactions';

describe('The AuthenticationService', () => {
  let emailService;
  let authenticationService: AuthService;
  let userStagingRepo: UserStagingRepository;
  let userRepo: UserRepository;
  const mockEmailService = () => ({
    example: jest.fn(() => 'success'),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
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
    authenticationService = await module.get<AuthService>(AuthService);
    emailService = await module.get<EmailService>(EmailService);
    // userStagingRepo = await module.get<UserStagingRepository>(
    //   UserStagingRepository,
    // );
    // userRepo = await module.get<UserRepository>(UserRepository);
  });

  describe('Auth Service', () => {
    let authDto: AuthCredentialsDto;
    beforeEach(() => {
      authDto = {
        username: 'pqr4@gmail.com',
        password: 'PQR@123456',
        fullName: 'ABC POQ',
      };
    });
    it('New user signing in with email verification sent', async (done) => {
      expect(authenticationService).toBeDefined();
      const resultValue = {
        message: 'Check your Email for verification',
      };
      const result = await authenticationService.signUp(authDto);
      expect(result).toEqual(resultValue);
      done();
    }, 30000);

    it('Duplicate user signing and signUp is failed', async () => {
      const resultValue = {
        message: `Username ${authDto.username} already exists`,
      };
      const result = await authenticationService
        .signUp(authDto)
        .catch((err) => console.log(`Error : ${err}`));
      expect(result).toEqual(resultValue);
    });

    it('Email Sign up verification done', async (done) => {
      let data;
      data = await getRepository(UserStagingEntity).findOne({
        where: { username: authDto.username },
      });
      data = await getCustomRepository(UserRepository).signUpComplete(data);
      expect(data).toEqual(true);
      done();
    }, 30000);

    it('Email Sign up verification failed', async (done) => {
      let data;
      data = await getRepository(UserStagingEntity).findOne({
        where: { username: authDto.username },
      });
      data = await getCustomRepository(UserRepository).signUpComplete(data);
      expect(data).toEqual(false);
      done();
    }, 30000);

    it('Logged in successfully and returning Access Token', async (done) => {
      await expect(
        typeof (await authenticationService.signIn(authDto)),
      ).toEqual('object');
      done();
    });
    it('Login failed creating Access Token', async (done) => {
      const authDTO: AuthCredentialsDto = {
        username: 'pqr4@gmail.com',
        password: 'PQR@123456567',
        fullName: '',
      };
      await expect(authenticationService.signIn(authDTO)).rejects.toThrow();
      done();
    });
  });
});
