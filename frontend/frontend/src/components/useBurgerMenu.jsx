import { useState } from "react";

const useBurgerMenu = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return { isOpen, toggleMenu };
};

export default useBurgerMenu;
