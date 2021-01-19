import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
