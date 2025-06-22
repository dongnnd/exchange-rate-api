const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { User } = require('../../models/sequelize');
const ApiError = require('../../utils/ApiError');

const createUser = async (userBody) => {
  if (await User.findOne({ where: { email: userBody.email } })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
};

const getUserByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

const getUserById = async (id) => {
  return User.findByPk(id);
};

const isPasswordMatch = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  isPasswordMatch,
};
