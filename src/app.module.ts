import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    EmailModule,
    RequestModule,
  ],
})
export class AppModule {}
