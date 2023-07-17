import { Role } from "./modules/users/user.model";
import { UserAuthPayload } from "./modules/auth/dto/user.data";

export const authChecker =
    (roles: Role[]) => (user: UserAuthPayload | undefined) => {
        if (!user) {
            return false;
        }
        if (roles.length === 0) {
            return true;
        }
        if (!roles.includes(user.role)) {
            return false;
        }
        return true;
    };
