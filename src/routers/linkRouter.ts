import * as trpc from "@trpc/server";
import { z } from "zod";
import { Context } from "utils/context";
import { generateUID } from "utils/generateUID";

export const linkRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: z.object({
      url: z.string().url(),
    }),
    output: z.string().length(6).nullish(),
    async resolve({ input: { url }, ctx: { redis, prisma } }) {
      const data = await prisma.link.findUnique({
        where: {
          url: url,
        },
        select: {
          uid: true,
        },
      });

      if (!data) {
        const uid = generateUID();

        try {
          await prisma.link.create({
            data: {
              uid: uid,
              url: url,
            },
          });

          await redis.set(uid, url);

          return uid;
        } catch (err) {
          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not create link",
            cause: err,
          });
        }
      }

      return data.uid;
    },
  })
  .query("get", {
    input: z.object({
      uid: z.string().length(6),
    }),
    output: z.string().url().nullish(),
    async resolve({ input: { uid }, ctx: { redis } }) {
      console.log("uid", uid);

      try {
        const url = await redis.get(uid);

        console.log("url", url);

        return url;
      } catch (err) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not get link",
          cause: err,
        });
      }
    },
  });
