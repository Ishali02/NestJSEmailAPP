import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestRepository } from './request.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RequestRepository]), AuthModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
