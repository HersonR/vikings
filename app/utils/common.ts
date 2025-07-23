import { products } from "@prisma/client";
import { ProductViewModel } from "~/types/common";

export const CONSOLE_LOG_COLORS = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  FgGray: "\x1b[90m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",
};

export type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
};

// Convertir Base64 a un objeto File
export const dataURLtoFile = (dataUrl: string, fileName: string) => {
  // Separar el encabezado Base64 de los datos
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Crear y retornar el archivo
  return new File([u8arr], fileName, { type: mime });
};

export const fileToBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  return base64String;
};

export function createProductFn(): ProductViewModel {
  return {
    id: -1,
    creator_id: -1,
    description: "",
    minimum_stock_threshold: "",
    name: "",
    stock_quantity: "0",
    unit_price: "",
    updater_id: -1,
  }
}

export function getTodayGt(): Date {
  const today = new Date();
  return new Date(today.getTime() - 6 * 60 * 60 * 1000);
}

export const commonErrorResponse = (title: string) => ({
  error: true,
  type: "",
  title,
  description: ""
})

export const commonSuccessResponse = (title: string) => ({
  error: false,
  type: "",
  title,
  description: ""
})
