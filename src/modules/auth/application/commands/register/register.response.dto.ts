import { UserResponseDto } from '@modules/user/application/dtos/user.response.dto';
import { Expose, Type } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
