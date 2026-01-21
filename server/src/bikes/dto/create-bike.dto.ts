import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateBikeDto {
    @ApiProperty({
        example: "Yamaha"
    })
    @IsString()
    brand:string;

    @ApiProperty({
        example:76
    })
    @IsNumber()
        lot:number

        @ApiProperty({
            example:"ba 1 pa 999"
        })
        bikeNum:string

}
