export interface JwtUserPayload {
  sub: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

export function decodeToken(token: string | null): JwtUserPayload | null {
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    return null;
  }
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    }
    return null;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  const payload = decodeToken(token);
  if (!payload) return false;
  if (payload.exp && typeof payload.exp === 'number') {
    if (payload.exp * 1000 <= Date.now()) {
      return false;
    }
  }
  return true;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('bis_access_token');
  } catch {
    return null;
  }
}

export function getAuthPayload(): JwtUserPayload | null {
  if (typeof window === 'undefined') return null;
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) return null;
  return decodeToken(token);
}

export function getUserRole(): string | null {
  const payload = getAuthPayload();
  return payload?.role || null;
}

export function isAdmin(): boolean {
  return getUserRole() === 'ADMIN';
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const token = localStorage.getItem('bis_access_token');
    if (token && isTokenValid(token)) {
      return true;
    } else {
      if (token) {
        localStorage.removeItem('bis_access_token');
      }
      return false;
    }
  } catch {
    return false;
  }
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      localStorage.setItem('bis_access_token', token);
    } else {
      localStorage.removeItem('bis_access_token');
    }
    window.dispatchEvent(new Event('auth-change'));
  } catch {
    // ignore
  }
}

export function clearAuthToken(): void {
  setAuthToken(null);
}

