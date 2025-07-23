
import { PrismaClient } from "@prisma/client";
import { CONSOLE_LOG_COLORS } from "~/utils/common";

export type PrismaUtilsResponse<T> = {
  error?: boolean;
  userMsg?: string;
  data?: T;
};

const prisma = new PrismaClient();

export async function handlePossiblePrismaErrors<T>(
  action: () => Promise<T>,
  actionName: string
): Promise<PrismaUtilsResponse<T>> {
  try {
    console.log("---------------- EJECUTANDO CONSULTA PRISMA ----------------");
    console.log(
      `${CONSOLE_LOG_COLORS.FgBlue}%s${CONSOLE_LOG_COLORS.Reset}`,
      `${actionName}`
    );
    const result = await action();
    return { error: false, data: result };
  } catch (error) {
    console.log("---------------- ERROR CON CONSULTA PRISMA ----------------");
    console.log(
      `${CONSOLE_LOG_COLORS.FgRed}%s${CONSOLE_LOG_COLORS.Reset}`,
      error instanceof Error ? error.message : String(error)
    );
    return {
      error: true,
      userMsg:
        error instanceof Error ? error.message : "Ocurrió un error desconocido",
    };
  }
}

export default prisma;
