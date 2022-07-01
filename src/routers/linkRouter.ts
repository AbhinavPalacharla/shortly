import trpc, { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "utils/context";
import { generateUID } from "utils/generateUID";

export const linkRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: z.object({
      link: z.string().url({ message: "Invalid URL provided" }),
    }),
    output: z.string().length(7),
    async resolve({ input: { link }, ctx: { prisma } }) {
      const data = await prisma.link.findUnique({
        where: {
          link: link,
        },
      });

      if (data) {
        return data.uid;
      }

      const createLink = await prisma.link.create({
        data: {
          uid: generateUID(),
          link: link,
        },
      });

      return createLink.uid;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input: { id }, ctx: { prisma } }) {
      try {
        const link = await prisma.link.findUnique({
          where: {
            id: id,
          },
        });

        if (!link) throw new Error("Failed to find link with matching cui");
      } catch (err) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Link not found",
          cause: err,
        });
      }
    },
  });
