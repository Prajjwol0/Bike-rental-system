// import { PartialType } from '@nestjs/swagger';
// import { CreateRequestDto } from './create-request.dto';

import { IsEnum } from "class-validator";
import { RequestStatus } from "src/common/common.enum";

// export class UpdateRequestDto extends PartialType(CreateRequestDto) {}


export class UpdateRequestDto {
    @IsEnum( RequestStatus, {
        message: "Status must be either accepted or rejected!!",
    })
    status: RequestStatus;
}