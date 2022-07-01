import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Context, createContext } from "utils/context";
import { linkRouter } from "routers/linkRouter";

export const appRouter = trpc.router<Context>().merge("link.", linkRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
