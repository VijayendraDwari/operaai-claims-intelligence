/**
 * useAuth — Standalone stub
 *
 * In the open-source standalone version, there is no authentication.
 * This hook returns a no-op authenticated state so components that
 * optionally import it continue to compile without errors.
 */

export function useAuth() {
  return {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: () => {},
    logout: async () => {},
  };
}
