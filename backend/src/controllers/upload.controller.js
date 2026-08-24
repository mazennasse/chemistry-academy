import { createSignedUpload } from '../services/cloudinary.service.js';

export const signature = async (req, res) => {
  const type = req.query.type === 'image' ? 'image' : 'video';
  const folder = type === 'image' ? 'chemistry-academy/teacher' : 'chemistry-academy/lectures';
  res.json({ success: true, data: createSignedUpload({ folder, resourceType: type }) });
};
