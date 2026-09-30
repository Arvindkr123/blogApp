import { useContext } from "react";
import { UserContext } from "./userContext.jsx";

export const useUser = () => useContext(UserContext);