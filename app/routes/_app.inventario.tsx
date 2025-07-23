import { products } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ActionFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "@remix-run/react";
import { div } from "framer-motion/client";
import { useEffect, useState } from "react";
import { json, LoaderFunction, redirect } from "react-router";
import { ErrorBoundaryAlert } from "~/components/ErrorBoundaryAlert";
import PencilIcon from "~/components/icons/PencilIcon";
import PopupCrateProduct from "~/components/inventario/PopupCrateProduct";
import { Modal } from "~/components/Modal";
import { showAlert } from "~/components/ShowAlert";
import { getUserFromSession, requireUserSession } from "~/services/auth.server";
import {
  createProductDb,
  listProductsDb,
} from "~/services/database/products.service";
import { ProductViewModel } from "~/types/common";
import {
  commonErrorResponse,
  commonSuccessResponse,
  createProductFn,
  getTodayGt,
} from "~/utils/common";

// ===============================  LOADER FUNCTION ===============================
export const loader: LoaderFunction = async ({ request }) => {
  const sessionExists = await requireUserSession(request);

  return json({});
};

// ===============================  ACTION FUNCTION ===============================
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = await getUserFromSession(request);
  const { action, payload } = Object.fromEntries(formData);

  if (action === "loadInformation") {
    const productsRes = await listProductsDb();
    if (productsRes.error || !productsRes.data) {
      return json(commonErrorResponse("Hubo un error al obtener productos"));
    }
    const products: ProductViewModel[] = productsRes.data.map((p) => ({
      creator_id: p.creator_id,
      description: p.description,
      id: p.id,
      minimum_stock_threshold: p.minimum_stock_threshold
        ? String(p.minimum_stock_threshold)
        : "",
      name: p.name,
      stock_quantity: String(p.stock_quantity),
      unit_price: String(p.unit_price),
      updater_id: p.updater_id,
    }));
    return json({
      loadInformation: {
        products,
      },
    });
  }

  if (action === "createProduct") {
    if (typeof payload === "string") {
      const information: {
        productToCreate: ProductViewModel;
      } = JSON.parse(payload);
      const todayGt = getTodayGt();
      const productToCreate = information.productToCreate;

      console.log(information);
      const createProductDbRes = await createProductDb({
        created_at: todayGt,
        description: productToCreate.description,
        minimum_stock_threshold: Number(
          productToCreate.minimum_stock_threshold
        ),
        stock_quantity: Number(productToCreate.stock_quantity),
        name: productToCreate.name,
        unit_price: new Decimal(productToCreate.unit_price),
        updated_at: todayGt,
        users_products_creator_idTousers: {
          connect: {
            id: userId,
          },
        },
        users_products_updater_idTousers: {
          connect: {
            id: userId,
          },
        },
      });
      if (createProductDbRes.error || !createProductDbRes.data) {
        return json(commonErrorResponse("Hub un error al crear producto"));
      }
      return json(commonSuccessResponse("¡Producto creado exitosamente!"));
    }
  }

  return json({});
};

/*==============================| Error Function |==============================*/
export function ErrorBoundary() {
  const route = "/login/index.tsx";
  const error = useRouteError();

  //Lo que usualment iría a `CatchBoundary`...
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorBoundaryAlert
        title={`CatchBoundary - ${error.status} - app/routes${route}`}
        description={error.data.message}
      />
    );
  }

  return (
    <ErrorBoundaryAlert
      title={`Error - app/routes${route}`}
      description={error?.toString() ?? ""}
    />
  );
}

// ===============================  COMPONENT ===============================
export default () => {
  type AlertResponse = {
    loadInformation: {
      products: ProductViewModel[];
    };
    title: string;
    description: string;
    type: "success" | "error" | "info" | "warning";
  };
  const fetcher = useFetcher<AlertResponse>();
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [productToCreate, setProductToCreate] = useState<ProductViewModel>(
    createProductFn()
  );
  const [products, setProducts] = useState<ProductViewModel[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
    fetcher.submit(
      {
        action: "loadInformation",
      },
      {
        method: "POST",
      }
    );
  }, []);

  useEffect(() => {
    if (fetcher?.data?.loadInformation) {
      setProducts(fetcher.data.loadInformation.products);
      setShowModal(false);
    }
    if (fetcher?.data?.title) {
      setShowModal(false);
      showAlert({
        description: fetcher.data.description,
        title: fetcher.data.title,
        type: fetcher.data.type,
        beforeClose: () => window.location.reload(),
      });
    }
  }, [fetcher.data]);

  const handleCreateProduct = (productToCreate: ProductViewModel) => {
    setShowModal(true);
    setShowCreateProduct(false);
    fetcher.submit(
      {
        action: "createProduct",
        payload: JSON.stringify({
          productToCreate,
        }),
      },
      {
        method: "POST",
      }
    );
  };

  return (
    <>
      <div className="w-full h-auto flex justify-end items-center">
        <button
          onClick={() => setShowCreateProduct(true)}
          className="w-auto px-16 h-[36px] border-[1px] border-[#28C8F2] bg-[#E8FAFF] rounded-[18px] flex justify-center items-center font-inter text-[#28C8F2] leading-none text-[16px] font-normal"
        >
          + Producto
        </button>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-y-2 mt-4">
        <div className="w-full flex flex-row bg-primary rounded-[5px] px-3 text-white">
          <p className="w-2/12 font-inter text-[13px] font-primary">
            Nombre del producto
          </p>
          <p className="w-3/12 font-inter text-[13px] font-primary text-center">
            Descripción del producto
          </p>
          <p className="w-2/12 font-inter text-[13px] font-primary text-center">
            Precio unitario
          </p>
          <p className="w-2/12 font-inter text-[13px] font-primary text-center">
            Punto de reorden
          </p>
          <p className="w-2/12 font-inter text-[13px] font-primary text-center">
            Stock
          </p>
          <div className="w-1/12"></div>
        </div>
        {products.map((p) => (
          <div
            key={p.id}
            className="w-full flex flex-row justify-center center border-borderCustom border-[1px] rounded-[8px] py-2.5 px-3"
          >
            <p className="w-2/12 font-inter text-[13px] font-primary">
              {p.name}
            </p>
            <p className="w-3/12 font-inter text-[13px] font-primary text-center">
              {p.description}
            </p>
            <p className="w-2/12 font-inter text-[13px] font-primary text-center">
              {`Q.${p.unit_price}`}
            </p>
            <div className="w-2/12 flex justify-center items-center font-inter text-[13px] font-primary text-center">
              <div className="min-w-6 w-auto aspect-square p-1 leading-none flex justify-center items-center relative rounded-full border-[1px] border-borderCustom">
                {p.minimum_stock_threshold}
                {Number(p.stock_quantity) <= Number(p.minimum_stock_threshold) && (
                  <span className="absolute -top-1 left-[70%] w-2.5 h-2.5 rounded-full bg-red-600"></span>
                )}
              </div>
            </div>
            <p className="w-2/12 font-inter text-[13px] font-primary text-center">
              {p.stock_quantity}
            </p>
            <div className="w-1/12 flex justify-center items-center">
              <button onClick={() => { setProductToCreate(p); setShowCreateProduct(true) }}>
                <PencilIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <PopupCrateProduct
        show={showCreateProduct}
        setShow={setShowCreateProduct}
        product={productToCreate}
        setProduct={setProductToCreate}
        handleCreateProduct={handleCreateProduct}
      />
      <Modal show={showModal} />
    </>
  );
};
