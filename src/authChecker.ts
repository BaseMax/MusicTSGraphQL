import { AuthCheckerFn } from "type-graphql";
import { GqlContext } from "./utils/gql-context";
import { Role } from "./modules/users/user.model";


export const authChecker: AuthCheckerFn<GqlContext, Role> = ({ context }, roles) => {
    if (!context.user) {
        return false;
    }
    if (roles.length === 0) {
        return true;
    }
    if (!roles.includes(context.user.role)) {
        return false;
    }
    return true;
};

