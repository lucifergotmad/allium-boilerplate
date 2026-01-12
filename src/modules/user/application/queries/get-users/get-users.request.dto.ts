import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUsersRequestDto {
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
