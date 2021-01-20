import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Request extends BaseEntity {
  @PrimaryGeneratedColumn()
  requestId: number;

  @Column()
  managerId: number;

  @Column()
  itTeamId: number;

  @Column()
  softwareTeamId: number;

  @Column()
  swId: number;

  @Column()
  reqDate: Date;

  @Column()
  reqStatus: number;

  @Column()
  reqApproved: number;

  @ManyToOne((type) => User, (user) => user.requests, { eager: false })
  user: User;

  @Column()
  userId: number;
}
