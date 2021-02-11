import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Software extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  swName: string;

  @Column()
  swDescrption: string;
}
