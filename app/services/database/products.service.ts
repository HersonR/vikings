import { Prisma, products } from "@prisma/client";
import prisma, {
  handlePossiblePrismaErrors,
  PrismaUtilsResponse,
} from "./prisma";
import { CONSOLE_LOG_COLORS } from "~/utils/common";

/*==================================================| CREATE |==================================================*/
export const createProductDb = async (
  data: Prisma.productsCreateInput
): Promise<PrismaUtilsResponse<products | null>> => {
  console.log(
    `${CONSOLE_LOG_COLORS.FgYellow}%s${CONSOLE_LOG_COLORS.Reset}`,
    `--- CREANDO PRODUCTO ---`
  );
  console.log(
    `${CONSOLE_LOG_COLORS.FgBlue}%s${CONSOLE_LOG_COLORS.Reset}`,
    `${JSON.stringify(data)}`
  );
  return handlePossiblePrismaErrors(async () => {
    const response = await prisma.products.create({
      data,
    });
    return response;
  }, `applicants.create()`);
};

/*==================================================| READ |==================================================*/
export const listProductsDb = async <T extends Prisma.productsInclude>(
  whereObj?: Prisma.productsWhereInput,
  includeObj?: T,
): Promise<PrismaUtilsResponse<Prisma.productsGetPayload<{ include: T }>[]>> => {
  return handlePossiblePrismaErrors(async () => {
    const response = await prisma.products.findMany({
      where: whereObj,
      include: includeObj,
    });

    return response as Prisma.productsGetPayload<{ include: T }>[];
  }, "products.findMany()");
};
