import { ActionFunction } from "@remix-run/node";
import { destroyUserSession } from "~/services/auth.server";

export const action: ActionFunction = async ({ request }) => {
  return await destroyUserSession(request);
}