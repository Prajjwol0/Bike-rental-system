import { Requests } from 'src/requests/entities/request.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Bike {
  @PrimaryColumn({
    unique: true,
    nullable: false,
  })
  bikeNum: string;

  @Column({
    nullable: false,
  })
  brand: string;

  @Column({
    nullable: false,
  })
  lot: number;

  @ManyToOne(() => User, (user) => user.bikes)
  owner: User;

  @ManyToOne(()=> Requests,(requests)=>requests.bikes)
  requests: Request[]

  @Column({
    nullable: false,
    // default:""
  })
  ownerMail: string;

  @CreateDateColumn()
  createdAt: Date;
}
