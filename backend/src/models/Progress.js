import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  lectureId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  completedAt: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'progress',
  indexes: [{ unique: true, fields: ['user_id', 'lecture_id'] }]
});
