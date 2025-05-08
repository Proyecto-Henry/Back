import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // propiedad para leer la metadata
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [ // roles esperados por el decorador
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const user = request.user; // obtengo el usuario autenticado por token
    const hasRequiredRole = () =>
      requiredRoles.some((role) => user?.role?.includes(role)); // funcion flecha para leer los roles del usuario, si es que tiene alguno
    const valid = user && user.role && hasRequiredRole(); 
    if(!valid) throw new ForbiddenException('🛑No cuenta con los permisos para acceder a la ruta')
    return valid;
  }
}
