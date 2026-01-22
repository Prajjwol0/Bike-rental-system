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

  @Column({
    nullable: false,
    // default:""
  })
  ownerMail: string;

  @CreateDateColumn()
  createdAt: Date;
}
