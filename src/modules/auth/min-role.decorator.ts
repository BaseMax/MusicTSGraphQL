import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/user.model';

export const MIN_ROLE_KEY = 'MIN_ROLE';
export const MinRole = (role: Role) => SetMetadata(MIN_ROLE_KEY, role);
