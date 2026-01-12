import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value?.toLowerCase().trim() : value
  )
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
