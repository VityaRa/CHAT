import { useLocation } from "react-router";

//if user trying to connect to room id, return this room id, else return false
export const useRoom = () => {
  const location = useLocation();
  if (location.pathname.length === 25) {
    return location.pathname.slice(1);
  }
  return false;
};
