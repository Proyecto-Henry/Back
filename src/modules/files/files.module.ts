import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { CloudinaryService } from "src/common/cloudinary.service";
import { AdminModule } from "../admins/admins.module";
import { StoreModule } from "../stores/stores.module";
import { cloudinaryConfig } from "src/config/cloudinary.config";

@Module({
    imports: [AdminModule, StoreModule],
    providers: [cloudinaryConfig, CloudinaryService],
    controllers: [FilesController],
    exports: []
})
export class FileModule{}