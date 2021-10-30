import { useLocation } from "react-router";

export const useRoom = () => {
  const location = useLocation();
  if (location.pathname.length === 25) {
    return location.pathname.slice(1);
  }
  return false;
};
