import { container } from "tsyringe";
import { UserAuthPayload } from "./dto/user.data";
import { JwtService } from "./jwt.service";

const jwt = container.resolve(JwtService);
export function getUserFromToken(token?: string) {
  if (token) {
    const payload = jwt.verify<UserAuthPayload>(token);
    return payload;
  }
}
