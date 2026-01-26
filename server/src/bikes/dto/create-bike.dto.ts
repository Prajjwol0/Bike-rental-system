import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateBikeDto {
  @ApiProperty({ example: 'Yamaha' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 76 })
  @Type(() => Number)
  @IsNumber()
  lot: number;

  @ApiProperty({ example: 'ba 1 pa 999' })
  @IsString()
  bikeNum: string;
}
