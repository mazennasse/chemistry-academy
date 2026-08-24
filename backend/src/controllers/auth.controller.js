import { User } from '../models/index.js';
import { comparePassword, hashPassword, signToken } from '../utils/auth.js';
import { httpError } from '../utils/httpError.js';

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, 'Email and password are required.');
  const user = await User.unscoped().findOne({ where: { email: email.toLowerCase().trim() } });
  if (!user || !user.isActive || !(await comparePassword(password, user.passwordHash))) throw httpError(401, 'Invalid email or password.');
  res.json({ success: true, data: { user: publicUser(user), token: signToken(user) } });
};

export const me = async (req, res) => res.json({ success: true, data: { user: publicUser(req.user) } });

export const changeMyPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) throw httpError(400, 'Current password and a new password of at least 8 characters are required.');
  const user = await User.unscoped().findByPk(req.user.id);
  if (!(await comparePassword(currentPassword, user.passwordHash))) throw httpError(400, 'Current password is incorrect.');
  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  res.json({ success: true, message: 'Password changed successfully.' });
};
