import { ReactNode } from "react";

export interface PrivateRouteProps {
  roles: string[];
  children: ReactNode;
}
