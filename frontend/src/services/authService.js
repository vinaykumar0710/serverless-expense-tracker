import { mockUser } from '../data/user';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay();
    if (email && password) {
      return { success: true, user: { ...mockUser, email } };
    }
    throw new Error('Invalid credentials');
  },

  async register({ name, email, password }) {
    await delay(500);
    if (name && email && password) {
      return { success: true, user: { ...mockUser, name, email } };
    }
    throw new Error('Registration failed');
  },

  async forgotPassword(email) {
    await delay(500);
    if (email) {
      return { success: true, message: 'Password reset link sent to your email' };
    }
    throw new Error('Email is required');
  },

  async logout() {
    await delay(200);
    return { success: true };
  },

  async getCurrentUser() {
    await delay(200);
    return { ...mockUser };
  },

  async updateProfile(data) {
    await delay(400);
    return { success: true, user: { ...mockUser, ...data } };
  },

  async changePassword(currentPassword, newPassword) {
    await delay(400);
    if (currentPassword && newPassword) {
      return { success: true, message: 'Password changed successfully' };
    }
    throw new Error('Invalid password');
  },
};
