import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PASSWORD_REGEX } from '@shared/core/constants/regex/regex.const';

export class RegisterRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value?.toLowerCase().trim() : value
  )
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and be at least 8 characters long',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value?.trim() : value))
  readonly firstName: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value?.trim() : value))
  readonly lastName?: string;
}
