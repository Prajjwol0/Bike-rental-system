import { BikeStatus } from 'src/common/common.enum';
import { Requests } from 'src/requests/entities/request.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.bikes, { onDelete: 'CASCADE' }) 
  // { cascade: true } on OneToMany or onDelete: 'CASCADE' on ManyToOne tells TypeORM/Postgres to delete dependent entities automatically.
  owner: User;

  @OneToMany(() => Requests, (requests) => requests.bike, {cascade:true})
  requests: Requests[];

  @Column({
    nullable: false,
    // default:""
  })
  ownerMail: string;

  @Column({
    type: 'enum',
    enum: BikeStatus,
    default: BikeStatus.AVAILABLE,
  })
  status: BikeStatus;

  @CreateDateColumn()
  createdAt: Date;
}
