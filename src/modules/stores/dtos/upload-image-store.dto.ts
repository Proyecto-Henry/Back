import { IsUUID, IsOptional, IsString } from 'class-validator';
export class uploadImageStoreDto {

    @IsOptional()
    @IsUUID()
    store_id?: string
    
    @IsOptional()
    @IsString()
    img_store?: string;
      
}