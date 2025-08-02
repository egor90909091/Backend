// user-dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from "src/common/enums/role.enum";

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Электронная почта' })
  mail: string;

  @ApiProperty({ example: 'Егор', description: 'Имя' })
  name: string;

  @ApiProperty({ example: 'ADMIN', description: 'Роль пользователя' })
  role: Role;
}
