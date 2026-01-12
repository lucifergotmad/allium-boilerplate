import { UserRole } from '@modules/user/domain/types/user.role.enum';
import { EmailVO } from '@shared/domain/value-objects/email.value-object';

export interface UserProps {
  email: EmailVO;
  password?: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  refreshToken?: string;
}

export interface CreateUserProps extends Omit<UserProps, 'email'> {
  email: string;
}

export type UpdateUserProps = Omit<CreateUserProps, 'role' | 'refreshToken'>;
