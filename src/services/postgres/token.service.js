// eslint-disable-next-line no-unused-vars
const generateAuthTokens = async (user) => {
  // Dummy: return a fake token
  return { access: 'fake-access-token', refresh: 'fake-refresh-token' };
};

// eslint-disable-next-line no-unused-vars
const generateResetPasswordToken = async (email) => {
  return 'fake-reset-token';
};

// eslint-disable-next-line no-unused-vars
const generateVerifyEmailToken = async (user) => {
  return 'fake-verify-token';
};

module.exports = {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
