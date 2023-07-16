import { container } from "./container";
import { JwtService } from "./modules/auth/jwt.service";
import { GraphQLError } from "graphql";
import { UserAuthPayload } from "./modules/auth/dto/user.data";

const jwt = container.resolve(JwtService);
export const context = async ({ headers }) => {
    const token = headers.authorization;
    if (token) {
        try {
            const payload = jwt.verify<UserAuthPayload>(token);
            return {
                user: payload,
            };
        } catch {
            throw new GraphQLError("Authentication error", {
                extensions: { code: "UNAUTHENTICATED" },
            });
        }
    } else {
        return {};
    }
};

