import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { redis } from "./redis";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  return {
    req: opts?.req,
    res: opts?.res,
    redis: redis,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
