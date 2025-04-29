import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/common/cloudinary.service";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { AdminsService } from "../admins/admins.service";
import { StoresService } from "../stores/stores.service";
import { UploadFileDto } from "./dtos/upload-file.dto";

@Controller('files')
export class FilesController {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly adminsService: AdminsService,
        private readonly storesService: StoresService
    ){}

    @ApiBearerAuth()
    @Post('uploadImageAdmin/:admin_id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Subir una imagen de perfil de Admin',
        type: UploadFileDto,
    })
    async uploadImageAdmin(
        @Param('admin_id', ParseUUIDPipe) admin_id: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 5000000,
                        message: "El archivo debe ser menor a 5MB"
                    }),
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|webp)$/
                    })
                ]
            })
        ) file: Express.Multer.File
    ) {
        const result = await this.cloudinaryService.uploadImage(file)
        const imgUrl = result.secure_url
        return this.adminsService.updateProfileAdmin({admin_id, img_profile: imgUrl})
        
    }

    @ApiBearerAuth()
    @Post('uploadImageStore/:store_id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Subir una imagen de la tienda',
        type: UploadFileDto,
    })
    async uploadImageStore(
        @Param('store_id', ParseUUIDPipe) store_id: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: 5000000,
                        message: "El archivo debe ser menor a 5MB"
                    }),
                    new FileTypeValidator({
                        fileType: /(jpg|jpeg|png|webp)$/
                    })
                ]
            })
        ) file: Express.Multer.File
    ) {
        const result = await this.cloudinaryService.uploadImage(file)
        const imgUrl = result.secure_url
        return this.storesService.uploadImageStore({store_id, img_store: imgUrl})
    }
}