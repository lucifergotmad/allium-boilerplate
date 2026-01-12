import { IsEmail, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserRequestDto {
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value
  )
  readonly email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  readonly password?: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  readonly refreshToken: string | null;
}
