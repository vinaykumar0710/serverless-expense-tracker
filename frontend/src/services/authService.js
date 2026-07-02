import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchUserAttributes,
  updatePassword,
} from 'aws-amplify/auth';

/**
 * Maps Cognito error codes to user-friendly messages.
 */
const getErrorMessage = (err) => {
  const code = err?.name || err?.code || '';
  const map = {
    UserNotFoundException: 'No account found with this email address.',
    NotAuthorizedException: 'Incorrect email or password.',
    UsernameExistsException: 'An account with this email already exists.',
    InvalidPasswordException: 'Password does not meet the requirements.',
    CodeMismatchException: 'Invalid verification code. Please try again.',
    ExpiredCodeException: 'Verification code has expired. Please request a new one.',
    LimitExceededException: 'Too many attempts. Please wait and try again.',
    UserNotConfirmedException: 'Account not verified. Please confirm your email.',
    InvalidParameterException: 'Invalid input. Please check your entries.',
  };
  return map[code] || err?.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Wraps an async auth operation with user-friendly error mapping.
 */
const withErrorHandling = async (operation) => {
  try {
    return await operation();
  } catch (err) {
    const friendlyError = new Error(getErrorMessage(err));
    friendlyError.code = err?.name || err?.code || 'UnknownError';
    throw friendlyError;
  }
};

export const authService = {
  async signUp(name, email, password) {
    return withErrorHandling(async () => {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
      return result;
    });
  },

  async confirmSignUp(email, code) {
    return withErrorHandling(async () => {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return result;
    });
  },

  async signIn(email, password) {
    return withErrorHandling(async () => {
      const result = await signIn({
        username: email,
        password,
      });
      return result;
    });
  },

  async signOut() {
    return withErrorHandling(async () => {
      await signOut();
    });
  },

  async getCurrentUser() {
    return withErrorHandling(async () => {
      const { userId } = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      return {
        id: userId,
        name: attributes.name || '',
        email: attributes.email || '',
      };
    });
  },

  async forgotPassword(email) {
    return withErrorHandling(async () => {
      const result = await resetPassword({ username: email });
      return result;
    });
  },

  async resetPassword(email, code, newPassword) {
    return withErrorHandling(async () => {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    });
  },

  async changePassword(oldPassword, newPassword) {
    return withErrorHandling(async () => {
      await updatePassword({ oldPassword, newPassword });
    });
  },
};
