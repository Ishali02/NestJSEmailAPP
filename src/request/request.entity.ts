import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Software } from './software.entity';

@Entity()
export class Request extends BaseEntity {
  @PrimaryGeneratedColumn()
  requestId: number;

  @ManyToOne((type) => User, (manager) => manager.id)
  manager: number;

  @ManyToOne((type) => User, (itTeam) => itTeam.id)
  itTeam: number;

  @ManyToOne((type) => User, (softwareTeam) => softwareTeam.id)
  softwareTeam: number;

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

  @ManyToOne((type) => Software, (sw) => sw.id)
  @JoinColumn()
  sw: number;
}
