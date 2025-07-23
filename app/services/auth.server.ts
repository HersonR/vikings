import pkg from "bcryptjs";
const { hash } = pkg;
import { createCookieSessionStorage, data, json, redirect } from "@remix-run/node";
import { getUserDb } from "./database/users.service";
import { modules } from "@prisma/client";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "";

// Configura la cookie de sesión
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV == "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  },
});

// Crea la sesión
const createUserSession = async (userId: number, modules: modules[], userName: string, redirectTo: string) => {
  const session = await sessionStorage.getSession();
  console.log("modules", modules)
  session.set("userId", userId);
  session.set("availableModules", modules);
  session.set("userName", userName)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

// Verifica si ya existe una sesión activa
export const requireUserSession = async (request: Request) => {
  const userId = await getUserFromSession(request);
  return userId;
};

export const destroyUserSession = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

export const getUserFromSession = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");

  if (!userId) return null;

  return userId;
};

export const login = async (email: string, password: string) => {
  const userExistsRes = await getUserDb(
    { email },
    {
      roles: {
        include: {
          permissions: {
            include: {
              modules: true,
            }
          },
        }
      }
    }
  );
  if (userExistsRes.error || !userExistsRes.data) {
    return json({
      error: true,
      type: "",
      title: "¡Usuario o Contraseña Invalidos!. Por favor vuelva a intentarlo",
      description: "",
    });
  }
  const userExists = userExistsRes.data;
  const modules = userExists.roles.permissions.flatMap(p => p.modules);

  const correctPassword = await pkg.compare(password, userExists.password_hash);
  if (!correctPassword) {
    return json({
      error: true,
      type: "",
      title: "¡Usuario o Contraseña Invalidos!. Por favor vuelva a intentarlo",
      description: "",
    });
  }

  return createUserSession(userExists.id, modules, userExists.name, "/inventario");
};
