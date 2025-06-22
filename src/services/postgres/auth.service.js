const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const userService = require('./user.service');

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await userService.isPasswordMatch(user, password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

// Dummy implementations for logout, refreshAuth, resetPassword, verifyEmail
const logout = async () => {};
const refreshAuth = async () => {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented');
};
const resetPassword = async () => {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented');
};
const verifyEmail = async () => {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented');
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
