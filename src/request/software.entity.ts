import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Software extends BaseEntity {
  @PrimaryGeneratedColumn()
  swId: number;

  @Column()
  swName: string;

  @Column()
  swDescrption: string;
}
