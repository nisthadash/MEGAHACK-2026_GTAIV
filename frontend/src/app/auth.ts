/**
 * Auth utility — JWT + user info stored in localStorage
 */

const TOKEN_KEY = "emc_token";
const USER_KEY = "emc_user";

export interface StoredUser {
  id: number;
  username: string;
  email: string;
}

/** Save token + user after login/signup */
export function saveAuth(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Get stored JWT token (or null) */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Get stored user object (or null) */
export function getUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

/** True if user is logged in (token present) */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/** Clear all auth state (logout) */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Authorization header value ready to use */
export function authHeader(): string {
  const token = getToken();
  return token ? `Bearer ${token}` : "";
}
