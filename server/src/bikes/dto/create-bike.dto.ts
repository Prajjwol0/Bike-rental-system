import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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
