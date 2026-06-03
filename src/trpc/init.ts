import { auth, getAuth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { NextRequest } from "next/server";

type CreateTRPCContextOptions = {
  req?: NextRequest;
};

/**
 * Create a request-scoped tRPC context.
 * - For API route handlers, use `getAuth(req)` so auth is read directly from
 *   the incoming request headers/cookies.
 * - For server components/callers, fall back to `auth()`.
 */
export const createTRPCContext = async (opts?: CreateTRPCContextOptions) => {
  if (opts?.req) {
    return { auth: getAuth(opts.req) };
  }

  return { auth: await auth() };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

//TODO: ADD Usage Procedure Here for better protection.
