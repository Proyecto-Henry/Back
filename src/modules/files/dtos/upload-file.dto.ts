import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Archivo de imagen',
    })
    file: any;
}