import { useRef, useState } from "react";

const getItem = (key: string): number | null => {
  const val = localStorage.getItem(key);
  return val === null ? null : parseInt(val);
};

export const cachedValues = {
  initialValue: getItem("initialValue"),
  upFactor: getItem("upFactor"),
  downFactor: getItem("downFactor"),
};

export function useCachedValue(name: keyof typeof cachedValues, defaultInitialValue: number) {
  const [val, setVal] = useState(cachedValues[name] ?? defaultInitialValue);
  const setValAndUpdateCache = (newVal: typeof val) => {
    setVal(newVal);
    localStorage.setItem(name, newVal.toString());
  };
  const valInputRef = useRef<HTMLInputElement>(null);

  return [val, setValAndUpdateCache, valInputRef] as const;
}
