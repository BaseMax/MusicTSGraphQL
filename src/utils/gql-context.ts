import { UserAuthPayload } from "../modules/auth/dto/user.data";

export type GqlContext = {
    user?: UserAuthPayload;
};
