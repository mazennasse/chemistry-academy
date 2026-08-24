import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const SiteSetting = sequelize.define('SiteSetting', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, defaultValue: 1 },
  teacherName: { type: DataTypes.STRING(120), allowNull: false, defaultValue: 'Dr. Your Name' },
  headline: { type: DataTypes.STRING(180), allowNull: false, defaultValue: 'Chemistry & Science made simple.' },
  bio: { type: DataTypes.TEXT, allowNull: true },
  teacherImageUrl: { type: DataTypes.TEXT, allowNull: true },
  teacherImagePublicId: { type: DataTypes.STRING(500), allowNull: true }
}, { tableName: 'site_settings' });
