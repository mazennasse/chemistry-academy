import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';

const ensureCloudinary = () => {
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw httpError(503, 'Cloudinary is not configured on the server.');
  }
};

export const createSignedUpload = ({ folder, resourceType = 'video' }) => {
  ensureCloudinary();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, env.cloudinary.apiSecret);
  return { timestamp, signature, apiKey: env.cloudinary.apiKey, cloudName: env.cloudinary.cloudName, folder, resourceType };
};

export const deleteCloudinaryAsset = async (publicId, resourceType = 'video') => {
  if (!publicId) return;
  ensureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
};
