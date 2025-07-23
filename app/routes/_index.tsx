import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { data, Form, json, redirect, useFetcher } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { FormEvent, useEffect, useState } from "react";
import { showAlert } from "~/components/ShowAlert";
import { login, requireUserSession } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Iniciar Sesión" }
  ];
};

// ===============================  LOADER FUNCTION =============================== 
export const loader: LoaderFunction = async ({ request }) => {
  const sessionExists = await requireUserSession(request);
  if (sessionExists) return redirect("/inventario");

  // const saltRounds = 10;
  // const hashedPassword = await bcrypt.hash("admin", saltRounds);
  // console.log(hashedPassword);
  return json({})
};

// ===============================  ACTION FUNCTION ===============================
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { action, payload } = Object.fromEntries(formData);
  if (action === "validateUser") {
    if (typeof payload === "string") {
      const information: {
        email: string;
        password: string;
      } = JSON.parse(payload);
      console.log(information);

      if (information.email && information.password) {
        const successLogin = await login(information.email, information.password);
        console.log(successLogin);
        return successLogin;
      }

      return json({})
    }
  }
};

// ===============================  COMPONENT ===============================
export default function Index() {
  const fetcher = useFetcher<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (fetcher?.data?.title) {
      setShowModal(false);
      showAlert({
        title: fetcher.data.title,
        type: fetcher.data.type,
        description: fetcher.data.desctiption,
      })
    }
  }, [fetcher.data])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowModal(true);
    fetcher.submit(
      {
        action: "validateUser",
        payload: JSON.stringify({
          email,
          password,
        }),
      },
      {
        method: "POST",
      }
    );
  };
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      <aside className="w-1/2 h-full font-inter text-[60px] bg-primary flex justify-center items-center">
        <img src="images/logo_vikings_blanco.png" alt="logo_vinkings_blanco" />
      </aside>
      <main className="w-1/2 flex justify-center items-center">
        <section className="w-2/3 flex flex-col">
          <Form
            onSubmit={(e) => handleSubmit(e)}
            className="w-full flex flex-col justify-start items-center h-1/2 gap-y-5 px-6"
          >
            <h1 className="text-[36px] font-bold text-primary">Iniciar Sesión</h1>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="w-full px-3 py-1.5 rounded-[8px] border-[1px] border-borderCustom text-secondary"
              placeholder="Ingrese correo electrónico"
            />
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              className="w-full px-3 py-1.5 rounded-[8px] border-[1px] border-borderCustom text-secondary"
              placeholder="Ingrese contraseña"
            />
            <button
              type="submit"
              className="text-white border-[1px] bg-primary rounded-full w-full py-2 font-semibold"
            >
              Enviar
            </button>
          </Form>
        </section>
      </main>
    </div>
  );
}
