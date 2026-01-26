import { ApiProperty } from "@nestjs/swagger";

export class CreateRequestDto {
    @ApiProperty({example:"ba 1 pa 999"})
    bikeId:string

    @ApiProperty({example:"5000"})
    offeredPrice:number


}
