import { modules } from "@prisma/client";
import { data, json, LoaderFunction, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { useState } from "react";
import InventarioIcon from "~/components/icons/InventarioIcon";
import LogoutIcon from "~/components/icons/LogoutIcon";
import MenuIcon from "~/components/icons/MenuIcon";
import { sessionStorage } from "~/services/auth.server";

const parseIcons = (iconName: string): React.ElementType => {
  switch (iconName) {
    case "EntidadesIcon":
      return InventarioIcon;
    // case "EstructuraOrganizacionalIcon":
    //   return EstructuraOrganizacionalIcon;
    // case "ReclutamientoIcon":
    //   return ReclutamientoIcon;
    default:
      return InventarioIcon;
  }
};

/*==============================| Loader Function |==============================*/
export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  console.log("session", userId);
  if (!session.has("userId")) return redirect("/");
  const availableModules = session.get("availableModules");
  console.log("availbalmod", availableModules);
  const userName = session.get("userName");
  const url = new URL(request.url);
  const path = url.pathname;

  return json({
    userName,
    availableModules,
  });
};

/*=================================| Component |=================================*/
export default () => {
  type ModuleSerialized = {
    name: string;
    id: number;
    icon_name: string;
    slug: string;
    creator_id: number;
    created_at: string; // <- Aquí está el cambio
  };
  type LoaderData = {
    availableModules: ModuleSerialized[];
    userName: string;
  };

  const loader = useLoaderData<LoaderData>();
  console.log("soy loader", loader);
  const availableModules = loader.availableModules;
  const userName = loader.userName;

  const location = useLocation();
  const currentPathname = location.pathname;

  const [expandMenu, setExpandMenu] = useState(false);
  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center bg-[#2F0243]">
      <div
        onClick={() => setExpandMenu(false)}
        className={`fixed flex flex-col items-start justify-start gap-y-10 top-0 left-0 h-full z-[9] ${expandMenu ? "w-full" : "w-0 md:w-[64px]"
          } bg-black opacity-20 pt-5 md:pt-8 pb-8 overflow-hidden`}
      ></div>
      <div
        className={`fixed flex flex-col items-start justify-start gap-y-10 top-0 left-0 h-full z-[9] ${expandMenu ? "w-[280px]" : "w-0 md:w-[64px]"
          } bg-[#2F0243] pt-5 md:pt-8 pb-8 transition-all duration-300 overflow-hidden`}
      >
        <button
          onClick={() => setExpandMenu(!expandMenu)}
          className="flex relative flex-row w-full pb-3 after:content-[''] after:absolute after:bottom-0 after:left-[5%] after:w-[90%] after:h-[0.5px] after:bg-gray-50"
        >
          <div className="w-[64px] flex justify-center items-center">
            <MenuIcon />
          </div>
          <span className="text-start flex-1 overflow-hidden text-white font-inter text-[12px]">
            <p className="truncate block">{userName}</p>
          </span>
        </button>
        <div className="w-full flex flex-col gap-y-4">
          {availableModules.map((module, index) => (
            <Link
              key={index}
              onClick={() => setExpandMenu(false)}
              to={`${module.slug}`}
              className="flex flex-row items-center w-full"
            >
              <div className="w-[64px] flex justify-center items-center">
                {module.icon_name &&
                  (() => {
                    const Icon = parseIcons(module.icon_name);
                    return (
                      <Icon
                        opacity={currentPathname === module.slug ? 1 : 0.6}
                        className="text-white w-6 h-6"
                      />
                    );
                  })()}
              </div>
              <span
                className={`whitespace-nowrap flex-1 overflow-hidden text-white font-inter`}
              >
                {module.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full h-full bg-white ml-0 md:ml-[70px] rounded-tl-none md:rounded-tl-[24px] overflow-hidden">
        <div className="w-full flex flex-row justify-center items-center h-[65px] md:h-[85px] pl-4 pr-10 border-b-[1px] border-[#DADADA] relative">
          <img
            width={120}
            src="/images/logo_vikings_morado.png"
            alt="vikings-logo"
            className="mr-[40px]"
          />
          <Form className="absolute top-0 right-8 h-full flex justify-center items-center" action="/logout" method="POST">
            <button
              type="submit"
              className="w-auto flex justify-center items-center"
            >
              <LogoutIcon />
            </button>
          </Form>
        </div>
        <div className="h-[calc(100%-85px)] w-full px-8 py-6 overflow-y-auto flex flex-col justify-start items-start">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
