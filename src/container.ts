import { container } from "tsyringe";

container.register("jwt-secret", { useValue: process.env.SECRET });
container.register("jwt-expireTime", { useValue: 3600 * 24 });

export { container } from "tsyringe";
