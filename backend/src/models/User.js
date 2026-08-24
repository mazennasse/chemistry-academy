import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },

  email: {
    type: DataTypes.STRING(190),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM('admin', 'student'),
    allowNull: false,
    defaultValue: 'student'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  tableName: 'users',
  defaultScope: {
    attributes: {
      exclude: ['passwordHash']
    }
  }
});