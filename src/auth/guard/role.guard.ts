import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем требуемые роли из метадаты @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('Запрашиваемые роли', requiredRoles);
    if (!requiredRoles) {
      // Если роли не указаны, разрешаем доступ
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('Пользоваетль из запроса:', user);
    if (!user || !user.role) {
      // Если пользователь не найден или у него нет ролей — доступ запрещён
      console.log('Пользователь не найден или у него нет ролей ')
      return false;
    }
    
    // Проверяем, есть ли у пользователя хотя бы одна из требуемых ролей
    return requiredRoles.includes(user.role);

  }
}
