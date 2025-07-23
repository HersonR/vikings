import { useMask } from "@react-input/mask";
import { useRef } from "react";
import { useBlockInputChars } from "~/hooks/useBlockInputChars";

type InputCreatePayee = {
  label: string;
  placeholder: string;
  keyToUpdate: string;
  value: string;
  updateFn: (keyToUpdate: string, value: string) => void;
  isNumber?: boolean;
  allowDecimals?: boolean;
};

export default (props: InputCreatePayee) => {
  const {
    label,
    placeholder,
    keyToUpdate,
    value,
    updateFn,
    isNumber = false,
    allowDecimals = false,
  } = props;
  const { onBeforeInput, onPaste } = useBlockInputChars(["."]);
  const inputRef = isNumber
    ? useMask({
      mask: "____-____",
      replacement: { _: /\d/ },
    })
    : useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex flex-col gap-y-1">
      <label
        htmlFor={label}
        className="pl-2.5 font-inter text-[10px] text-[#2F0243] font-medium"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        type={isNumber ? "number" : "text"}
        step={!isNumber ? undefined : allowDecimals ? 0.01 : 1}
        value={value}
        onChange={(e) => updateFn(keyToUpdate, e.target.value)}
        className="w-full border-[1px] border-borderCustom rounded-[10px] px-3 py-1.5 text-gray-500"
        placeholder={placeholder}
        onBeforeInput={!isNumber ? undefined : !allowDecimals ? onBeforeInput : undefined}
        onPaste={!isNumber ? undefined : !allowDecimals ? onPaste : undefined}
      />
    </div>
  );
};