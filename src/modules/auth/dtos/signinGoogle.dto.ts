import {IsEmail, IsNotEmpty,IsString} from 'class-validator';

export class payloadGoogle {
    @IsString()
    @IsNotEmpty()
    googleId: string
    /**
   * @example nombre
   */
    @IsString()
    @IsNotEmpty()
    name: string

    /**
       * @example example@gmail.com
       */
    @IsEmail()
    @IsNotEmpty()
    email: string;
}