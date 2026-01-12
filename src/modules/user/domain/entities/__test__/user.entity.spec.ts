import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRole } from '@modules/user/domain/types/user.role.enum';

jest.mock('uuid', () => ({
  v7: () => 'mock-uuid-v7',
}));

describe('UserEntity', () => {
  it('should create a user instance successfully', () => {
    const user = UserEntity.create({
      email: 'john@doe.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
    });

    expect(user.id).toBeDefined();
    expect(user.getProps().email.value).toBe('john@doe.com');
    expect(user.getProps().role).toBe(UserRole.USER);
    expect(user.createdAt).toBeDefined();
  });
});
