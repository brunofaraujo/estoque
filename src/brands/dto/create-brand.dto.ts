import { Item } from "@prisma/client";
import { IsString } from "class-validator";

export class CreateBrandDto {

    @IsString()
    name: string;

}
