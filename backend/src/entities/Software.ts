import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AccessRequest } from "./AccessRequest";

@Entity()
export class Software {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => AccessRequest, (accessRequest) => accessRequest.Software)
  accessRequests!: AccessRequest[];

  @Column({
    type: 'simple-array',
    default: 'read,write,admin',
  })
  accessLevels!: string[];
} 
