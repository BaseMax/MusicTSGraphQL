import {
    HeadObjectCommand,
    NotFound,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import path from "path";

import sharp from "sharp";
import cuid from "cuid";
import { sizes } from "./config";
import { injectable } from "tsyringe";
import { BadRequestException } from "../../errors/badrequest.exception";
import { NotFoundException } from "../../errors/notfound.exception";

interface UploadInput {
    image: Buffer;
    name: string;
}

interface SizedUploadInput extends UploadInput {
    bucket: string;
    width: number;
    height: number;
}

@injectable()
export class UploadService {
    constructor(private readonly s3: S3Client) { }
    async uploadCover(input: UploadInput) {
        return await this.uploadImageSized({
            ...input,
            ...sizes.cover,
            bucket: "backdrop",
        });
    }

    private async uploadImageSized({
        image,
        width,
        height,
        name,
        bucket,
    }: SizedUploadInput) {
        const resized = await this.resizeAndFormat(image, width, height);

        return await this.uploadFile(name, bucket, resized);
    }
    private async uploadFile(name: string, bucket: string, file: Buffer) {
        const key = this.getKey(name);

        await this.s3.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file,
            })
        );

        return `/${bucket}/${key}`;
    }
    public async uploadMusic(name: string, file: Buffer) {
        return this.uploadFile(name, "musics", file);
    }

    public async checkWithBucketOrFail(path: string, expectedBucket: string) {
        const { bucket, exists } = await this.check(path);

        if (!exists || bucket !== expectedBucket) {
            throw new NotFoundException(`invalid path :${path}`);
        }
    }
    public async check(path: string) {
        if (!path.startsWith("/")) {
            throw new BadRequestException("path must start with '/' ");
        }
        const [_, bucket, ...rest] = path.split("/");
        const name = rest.join("/");

        let exists = true;
        try {
            await this.s3.send(
                new HeadObjectCommand({
                    Bucket: bucket,
                    Key: name,
                })
            );
        } catch (e) {
            console.log(e);
            if (e instanceof NotFound) exists = false;
            else throw e;
        }
        return { bucket, exists };
    }

    private getKey(name: string) {
        const extension = path.extname(name);
        const nameWithoutExt = path.basename(name,extension);
        return `${nameWithoutExt}-${cuid()}${extension}`;
    }

    private async resizeAndFormat(
        image: Buffer,
        width: number,
        height: number
    ) {
        try {
            return await sharp(image).resize(width, height).jpeg().toBuffer();
        } catch {
            throw new BadRequestException("invalid image");
        }
    }
}
