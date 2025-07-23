import { useCallback } from "react";

export function useBlockInputChars(blockedChars: string[]) {
  const onBeforeInput = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement, InputEvent>) => {
      const input = e.nativeEvent.data;
      if (input && blockedChars.includes(input)) {
        e.preventDefault();
      }
    },
    [blockedChars]
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData("text");
      if (blockedChars.some(char => pasted.includes(char))) {
        e.preventDefault();
      }
    },
    [blockedChars]
  );

  return { onBeforeInput, onPaste };
}