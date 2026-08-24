import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'subjects'
});