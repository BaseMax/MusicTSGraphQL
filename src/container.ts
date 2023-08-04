import { S3Client } from "@aws-sdk/client-s3";
import { container } from "tsyringe";

container.register("jwt-secret", { useValue: process.env.SECRET });
container.register("jwt-expireTime", { useValue: 3600 * 24 });
container.register(S3Client, {
    useValue: new S3Client({
        credentials: {
            accessKeyId: assertString(process.env.S3_ACCESS_KEY),
            secretAccessKey: assertString(process.env.S3_SECRET_KEY),
        },
        endpoint: assertString(process.env.S3_URI),
        forcePathStyle: true,
        region: "eu-west-1",
    }),
});
function assertString(s: string | undefined): string {
    if (!s) {
        throw new Error("expected string");
    }
    return s;
}
export { container } from "tsyringe";
