import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

export interface UserContext {
  userId: string;
  userName: string;
}

/**
 * Resolves the current user from the request.
 *
 * In production this should be replaced with a JWT-based auth guard
 * that populates `request.user`. As a fallback (and to keep the API
 * usable without a full auth stack) the user is read from headers:
 *
 *   x-user-id   - stable user identifier (defaults to "anonymous")
 *   x-user-name - human-readable display name (defaults to "Anonymous")
 *
 * The userName is required for any write operation; the controller
 * passes `{ requireName: true }` to enforce this.
 */
export const CurrentUser = createParamDecorator(
  (
    data: { requireName?: boolean } | undefined,
    ctx: ExecutionContext,
  ): UserContext => {
    const req = ctx.switchToHttp().getRequest<Request & { user?: UserContext }>();

    // Prefer a guard-populated user object when available.
    if (req.user?.userId && req.user?.userName) {
      return req.user;
    }

    const headerId = headerValue(req.headers['x-user-id']);
    const headerName = headerValue(req.headers['x-user-name']);

    const userId = (headerId ?? '').trim() || 'anonymous';
    const userName = (headerName ?? '').trim() || 'Anonymous';

    if (data?.requireName && (!headerName || !headerName.trim())) {
      throw new BadRequestException(
        'Missing user context: please provide an "x-user-name" header (and ideally "x-user-id").',
      );
    }

    return { userId, userName };
  },
);

function headerValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
