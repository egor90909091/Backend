import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({ example: 'eyJh...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJh...' })
  refreshToken: string;
}
