import { Role } from 'src/modules/users/user.model';

export interface UserAuthPayload {
  id: string;
  role: Role;
}
