import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Bike {
  @PrimaryColumn({
    unique: true,
    nullable:false,
  })
  bikeNum: string;

  @Column({
    nullable:false,
  })
  brand: string;


  @Column({
    nullable:false,
  })
  lot: number;

}
