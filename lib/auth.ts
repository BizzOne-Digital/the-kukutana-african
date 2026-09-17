import { getAdminSession, AdminSessionPayload } from "./session";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Verifies there is a valid admin session. Throws UnauthorizedError if not.
 * Every admin-mutating API route must call this server-side; middleware alone
 * is not sufficient authorization.
 */
export async function requireAdmin(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}
