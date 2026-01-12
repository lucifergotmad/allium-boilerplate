import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserAuthInfoRequestDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }
}
