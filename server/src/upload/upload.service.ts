import { Inject, Injectable } from '@nestjs/common';
import type {
  v2 as CloudinaryType,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof CloudinaryType,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'chatter' },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result) return reject(new Error('Upload failed'));
          resolve(result);
        },
      );
      stream.end(file.buffer);
    });
  }

  async uploadStreamBuffer(buffer: Buffer, options: UploadApiOptions) {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        },
      );
      stream.end(buffer);
    });
  }

  async removeImage(imageUrl: string) {
    if (imageUrl) {
      await this.cloudinary.uploader.destroy(imageUrl);
    }
  }
}
