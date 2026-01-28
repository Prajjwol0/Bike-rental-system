import { Bike } from 'src/bikes/entities/bike.entity';
import { RequestStatus } from 'src/common/common.enum';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('request')
export class Requests {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  offeredPrice: number;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @ManyToOne(() => User, (user) => user.requests, { onDelete: 'CASCADE' })
  renter: User;

  @ManyToOne(() => Bike, (bike) => bike.requests, { onDelete: 'CASCADE' })
  bike: Bike;

  @CreateDateColumn()
  createdAt: Date;
}
