import { IsString } from "class-validator";

export class CreateVolumeDto {
    @IsString()
    name: string;
}
