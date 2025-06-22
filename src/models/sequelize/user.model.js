const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      minlength: 8,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      default: 'user',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
  },
  {
    tableName: 'users',
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          // eslint-disable-next-line no-param-reassign
          user.password = await bcrypt.hash(user.password, 8);
        }
      },
    },
  }
);

User.prototype.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
