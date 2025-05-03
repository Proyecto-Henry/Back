import {IsNotEmpty,IsString} from 'class-validator';

export class payloadGoogle {
    @IsString()
    @IsNotEmpty()
    googleId: string
    @IsString()
    @IsNotEmpty()
    name: string
    @IsString()
    @IsNotEmpty()
    email: string
}