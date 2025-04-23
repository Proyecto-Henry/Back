import { Controller } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { AdminsService } from "../admins/admins.service"

@Controller('auth')
export class AuthController {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly usersService: UsersService,
    ) {}

}