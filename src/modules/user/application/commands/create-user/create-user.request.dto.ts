import { UserRole } from '@modules/user/domain/types/user.role.enum';
import { PASSWORD_REGEX } from '@shared/core/constants/regex/regex.const';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value
  )
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(PASSWORD_REGEX, {
    message: 'Password too weak',
  })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly lastName?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  readonly role?: UserRole = UserRole.USER;
}
