import { UserRole } from '@modules/user/domain/types/user.role.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
