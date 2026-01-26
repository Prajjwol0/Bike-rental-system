import { Bike } from 'src/bikes/entities/bike.entity';
import { UserRoles } from 'src/common/common.enum';
import { Requests } from 'src/requests/entities/request.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  roles: UserRoles;

  @OneToMany(() => Bike, (bike) => bike.owner)
  bikes: Bike[]; //array of bikes owned by this user

  @OneToMany(()=>Requests, request => request.user)
  requests: Request[]

}
