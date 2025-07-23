import { Prisma, users } from "@prisma/client";
import prisma, { handlePossiblePrismaErrors, PrismaUtilsResponse } from "./prisma";
import { CONSOLE_LOG_COLORS } from "~/utils/common";

/*==================================================| READ |==================================================*/
export const getUserDb = async <T extends Prisma.usersInclude>(
  whereObj?: Prisma.usersWhereInput,
  includeObj?: T,
): Promise<PrismaUtilsResponse<Prisma.usersGetPayload<{ include: T }>>> => {
  return handlePossiblePrismaErrors(async () => {
    const response = await prisma.users.findFirst({
      where: whereObj,
      include: includeObj,
    });

    return response as Prisma.usersGetPayload<{ include: T }>;
  }, "groups.findMany()");
};