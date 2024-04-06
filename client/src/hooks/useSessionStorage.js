import { useState } from "react";

function useSessionStorage(key, initialValue) {
  const storedValue = sessionStorage.getItem(key);

  const [value, setValue] = useState(
    storedValue ? JSON.parse(storedValue) : initialValue
  );

  const updateValue = (newValue) => {
    sessionStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  const removeValue = () => {
    sessionStorage.removeItem(key);
    setValue(null);
  };

  return [value, updateValue, removeValue];
}

export default useSessionStorage;
