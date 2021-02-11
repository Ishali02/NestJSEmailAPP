import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RequestModule } from './request/request.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserStagingEntity } from './auth/user-staging.entity';
import { User } from './auth/user.entity';
import { UserStagingRepository } from './auth/user-staging.repository';
import { UserRepository } from './auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([UserStagingEntity, User]),
    AuthModule,
    EmailModule,
    RequestModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
})
export class AppModule {}
