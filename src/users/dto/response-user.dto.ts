import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  readonly id: number;

  @ApiProperty({ example: 'super_Man', description: 'Username' })
  readonly username: string;
}
