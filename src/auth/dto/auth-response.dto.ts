import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { TokensDto } from './tokens.dto';

export class AuthResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;
}