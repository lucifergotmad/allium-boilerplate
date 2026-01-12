import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  readonly refreshToken: string;
}
