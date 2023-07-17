import { S3Client } from "@aws-sdk/client-s3";
import { container } from "tsyringe";

container.register("jwt-secret", { useValue: process.env.SECRET });
container.register("jwt-expireTime", { useValue: 3600 * 24 });
container.register(S3Client, {
    useValue: new S3Client({
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_KEY!,
        },
        endpoint: process.env.S3_URI!,
        forcePathStyle: true,
        region: "eu-west-1",
    }),
});
export { container } from "tsyringe";
