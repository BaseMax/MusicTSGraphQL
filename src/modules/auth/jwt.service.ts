import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";

@injectable()
export class JwtService {
  constructor(
    @inject("jwt-secret") private secrett: string,
    @inject("jwt-expireTime") private expireTime: number
  ) { }
  sign(payload: any) {
    return jwt.sign(payload, this.secrett, {
      expiresIn: this.expireTime,
    });
  }
  verify<P>(token: string): P {
    return jwt.verify(token, this.secrett) as P;
  }
}
