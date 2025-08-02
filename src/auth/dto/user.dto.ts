import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'nice@mail.ru' })
  mail: string;

  @ApiProperty({ example: 'Егор' })
  name: string;

  @ApiProperty({ example: Role.ADMIN, enum: Role })
  role: Role;
}