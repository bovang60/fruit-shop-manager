/**
 * Profile Component Type Definitions
 *
 * Defines the data structures for Profile API requests and responses
 */

// ============= API Response Types =============

export interface UserDto {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  image?: string; // Avatar/profile image URL from backend
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  createdAt: string; // ISO 8601 format
}

// ============= API Request Types =============

export interface UpdateProfileDto {
  fullName: string; // Required, 2-100 characters
  phoneNumber?: string; // Optional, Vietnamese phone format
  address?: string; // Optional, max 255 characters
}

// ============= UI State Types =============

export interface UserProfile {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  avatar?: string;
  role?: string;
  stats: {
    orders: number;
    points: number;
  };
  settings: {
    twoFactorAuth: boolean;
    orderNotifications: boolean;
  };
}
