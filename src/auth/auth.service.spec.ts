import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { UserStagingRepository } from './user-staging.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

describe('The AuthenticationService', () => {
  let emailService;
  let authenticationService: AuthService;
  let userRepo;
  let userStagingRepo;
  const mockEmailService = () => ({
    example: jest.fn(() => 'success'),
  });
  const mockUserStagingRepository = () => ({
    signUpVerification: jest.fn(),
    findOne: jest.fn(),
  });

  const mockUserRepository = () => ({
    signUpComplete: jest.fn(),
    validateUserPassword: jest.fn(),
  });

  const mockJetService = () => ({
    sign: () => jest.fn(() => ''),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: EmailService, useFactory: mockEmailService },
        { provide: JwtService, useFactory: mockJetService },
        {
          provide: UserStagingRepository,
          useFactory: mockUserStagingRepository,
        },
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();
    authenticationService = await module.get<AuthService>(AuthService);
    emailService = await module.get<EmailService>(EmailService);
    userRepo = module.get(UserRepository);
    userStagingRepo = module.get(UserStagingRepository);
  });
  describe('While testing Mock Auth Service', () => {
    let authDto1: AuthCredentialsDto;
    beforeEach(() => {
      authDto1 = {
        username: 'pqr123@gmail.com',
        password: 'PQR@123456',
        fullName: 'ABC PQR',
      };
    });
    it('Registration successful  with email verification sent', async (done) => {
      expect(authenticationService).toBeDefined();
      userStagingRepo.signUpVerification.mockResolvedValue(true);
      const result = await authenticationService.signUp(authDto1);
      expect(result).toEqual({ message: 'Check your Email for verification' });
      done();
    }, 30000);

    it('Registration failed ', async (done) => {
      expect(authenticationService).toBeDefined();
      userStagingRepo.signUpVerification.mockResolvedValue(false);
      const result = await authenticationService.signUp(authDto1);
      expect(result).toEqual({
        message: `Username ${authDto1.username} already exists`,
      });
      done();
    }, 30000);
  });
});
