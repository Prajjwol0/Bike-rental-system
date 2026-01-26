import { Bike } from 'src/bikes/entities/bike.entity';
import { Status } from 'src/common/common.enum';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  offeredPrice: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.requests)
  user: User[];

  @ManyToOne(() => Bike, (bike) => bike.requests)
  bikes: Bike[];

  @CreateDateColumn()
  createdAt: Date;
}
