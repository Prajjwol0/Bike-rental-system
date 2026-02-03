
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { RequestStatus } from "src/common/common.enum";



export class UpdateRequestDto {
  @ApiProperty({
    description: 'The status of the request',
    enum: RequestStatus,
    example: RequestStatus.PENDING,
  })
  @IsEnum(RequestStatus) 
  status: RequestStatus;
}