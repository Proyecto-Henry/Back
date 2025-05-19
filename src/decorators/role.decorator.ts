import { SetMetadata } from "@nestjs/common";
import { Role } from "src/enums/roles.enum";

// en la metadata se define una clave roles (informacion adicional que acompaña a la solicitud) donde almacenan los roles
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);