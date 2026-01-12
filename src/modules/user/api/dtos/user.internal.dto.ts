export class UserInternalDto {
  id: string;
  email: string;
  role: string;
  passwordHashed: string;
  refreshTokenHashed?: string | null;
}
