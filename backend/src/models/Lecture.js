import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Lecture = sequelize.define('Lecture', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING(180),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  order: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    unique: false
  },

  videoUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  videoPublicId: {
    type: DataTypes.STRING(500),
    allowNull: true
  },

  videoDuration: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  thumbnailUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  levelId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },

  subjectId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  }
}, {
  tableName: 'lectures'
});