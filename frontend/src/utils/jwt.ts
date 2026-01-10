// JWT utility functions for frontend

/**
 * Decode a JWT token without verification
 * @param token - The JWT token to decode
 * @returns The decoded payload or null if invalid
 */
export const decodeJWT = (token: string): any | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 * @param token - The JWT token to check
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true; // Consider invalid tokens as expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get expiration time from JWT token
 * @param token - The JWT token
 * @returns The expiration timestamp or null if not found
 */
export const getTokenExpiration = (token: string): number | null => {
  const decoded = decodeJWT(token);
  return decoded?.exp || null;
};

/**
 * Get user ID from JWT token
 * @param token - The JWT token
 * @returns The user ID or null if not found
 */
export const getUserIdFromToken = (token: string): number | null => {
  const decoded = decodeJWT(token);
  return decoded?.sub || decoded?.user_id || null;
};

/**
 * Get user email from JWT token
 * @param token - The JWT token
 * @returns The user email or null if not found
 */
export const getUserEmailFromToken = (token: string): string | null => {
  const decoded = decodeJWT(token);
  return decoded?.email || null;
};