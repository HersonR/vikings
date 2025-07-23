import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = { show: boolean };

export function Modal(props: Props) {
  const { show } = props;

  if (!show) return null;

  return (
    <div className="bg-black bg-opacity-60 fixed top-0 left-0 w-full h-full flex items-center justify-center z-[999]">
      <div className="bg-white w-1/9 min-h-1/3 max-h-full rounded-md p-8 flex items-center justify-center">
        <div className="w-7 h-7 flex items-center justify-center border-b">
          <AiOutlineLoading3Quarters className="animate-spin w-7 h-7 items-center justify-center" color="black" />
        </div>
      </div>
    </div>
  );
}