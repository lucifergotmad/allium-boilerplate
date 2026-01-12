import { UserResponseDto } from '@modules/user/application/dtos/user.response.dto';
import { Expose, Type } from 'class-transformer';

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: Partial<UserResponseDto>;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
