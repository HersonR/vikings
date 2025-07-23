import { ProductViewModel } from "~/types/common";
import InputLabelComponent from "../common/InputLabelComponent";
import { Dispatch, SetStateAction } from "react";
import { createProductFn } from "~/utils/common";

type PoupuCreateProduct = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  product: ProductViewModel;
  setProduct: Dispatch<SetStateAction<ProductViewModel>>;
  handleCreateProduct: (productToCreate: ProductViewModel) => void;
};

export default (props: PoupuCreateProduct) => {
  const { show, setShow, product, setProduct, handleCreateProduct } = props;

  const updateProduct = (keyToUpdate: string, value: string) => {
    setProduct((prev) => ({
      ...prev,
      [keyToUpdate]: value,
    }));
  };

  return (
    <div
      className={`${show ? "w-screen h-screen" : "h-0 w-0"
        } overflow-hidden bg-black bg-opacity-30 fixed top-0 left-0 flex justify-center items-center z-[9]`}
    >
      <div
        className={`w-[600px] h-auto bg-white transition-all rounded-[20px] relative overflow-hidden py-6 px-6 flex flex-col justify-center items-end gap-y-4 ${show
          ? "translate-y-0 duration-200 opacity-100 ease-out delay-100"
          : "translate-y-3 duration-100 opacity-20"
          }`}
      >
        <h1 className="w-full font-inter text-center font-semibold text-primary text-[18px]">
          Crear Producto
        </h1>
        <section className="w-full flex flex-col justify-start items-start gap-y-2.5">
          <InputLabelComponent
            keyToUpdate="name"
            label="Nombre del producto"
            placeholder="Nombre"
            value={product.name}
            updateFn={updateProduct}
          />
          <InputLabelComponent
            keyToUpdate="description"
            label="Descripción del producto"
            placeholder="Descripción"
            value={product.description}
            updateFn={updateProduct}
          />
          <div className="w-full flex flex-row justify-center items-center gap-x-3">
            <div className="w-1/2">
              <InputLabelComponent
                keyToUpdate="minimum_stock_threshold"
                label="Punto de reorden"
                placeholder="Punto de reorden"
                value={product.minimum_stock_threshold}
                allowDecimals={false}
                isNumber={true}
                updateFn={updateProduct}
              />
            </div>
            <div className="w-1/2">
              <InputLabelComponent
                keyToUpdate="unit_price"
                label="Precio unitario"
                placeholder="Precio unitario"
                value={product.unit_price}
                allowDecimals={true}
                isNumber={true}
                updateFn={updateProduct}
              />
            </div>
          </div>
        </section>
        <button
          onClick={() => handleCreateProduct(product)}
          className="w-auto px-16 h-[36px] border-[1px] border-[#28C8F2] bg-[#E8FAFF] rounded-[18px] flex justify-center items-center font-inter text-[#28C8F2] leading-none text-[16px] font-normal"
        >
          Guardar
        </button>
        <button
          onClick={() => { setShow(false); setProduct(createProductFn()) }}
          className="absolute top-3 right-5 font-inter text-[18px] font-light text-gray-400">
          X
        </button>
      </div>
    </div>
  );
};
