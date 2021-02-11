import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestRepository } from './request.repository';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestRepository]),
    AuthModule,
    EmailModule,
  ],
  controllers: [RequestController],
  providers: [RequestService, EmailService],
})
export class RequestModule {}
