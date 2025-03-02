import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
    file: any,
    folder: string = 'uploads',
): Promise<UploadApiResponse> => {
    if (!file || !file.tempFilePath) {
        throw new Error('Invalid file object');
    }
    return await cloudinary.uploader.upload(file.tempFilePath, {
        folder: folder,
    });
};
