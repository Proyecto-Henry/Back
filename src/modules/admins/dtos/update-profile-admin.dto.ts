import { IsUUID, IsOptional, IsString, IsEmail } from 'class-validator';
export class updateAdminDto {

    @IsOptional()
    @IsUUID()
    admin_id?: string
    @IsOptional()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @IsOptional()
    @IsString()
    password?: string;
    
    @IsOptional()
    @IsString()
    phone?: string;
    
    @IsOptional()
    @IsString()
    img_profile?: string;
      
}
    
