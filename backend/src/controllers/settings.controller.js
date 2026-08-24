import { SiteSetting } from '../models/index.js';
import { httpError } from '../utils/httpError.js';
import { deleteCloudinaryAsset } from '../services/cloudinary.service.js';

export const getSettings = async (_req, res) => {
  const [settings] = await SiteSetting.findOrCreate({ where: { id: 1 }, defaults: {} });
  res.json({ success: true, data: { settings } });
};

export const updateSettings = async (req, res) => {
  const [settings] = await SiteSetting.findOrCreate({ where: { id: 1 }, defaults: {} });
  const { teacherName, headline, bio, teacherImageUrl, teacherImagePublicId } = req.body;
  if (teacherName !== undefined) settings.teacherName = teacherName.trim();
  if (headline !== undefined) settings.headline = headline.trim();
  if (bio !== undefined) settings.bio = bio;
  if (teacherImageUrl !== undefined) settings.teacherImageUrl = teacherImageUrl || null;
  if (teacherImagePublicId !== undefined) settings.teacherImagePublicId = teacherImagePublicId || null;
  await settings.save();
  res.json({ success: true, message: 'Site settings updated.', data: { settings } });
};

export const removeTeacherImage = async (req, res) => {
  const settings = await SiteSetting.findByPk(1);
  if (!settings) throw httpError(404, 'Settings not found.');
  await deleteCloudinaryAsset(settings.teacherImagePublicId, 'image').catch(() => {});
  settings.teacherImageUrl = null;
  settings.teacherImagePublicId = null;
  await settings.save();
  res.json({ success: true, message: 'Teacher image removed.' });
};
