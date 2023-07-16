import { Role } from '../../users/user.model';

export interface UserAuthPayload {
  id: string;
  role: Role;
}
