import React, { useEffect, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PrivateRouteProps } from "./models/props/PrivateRouteProps";
import { useAuth } from "./provider/useAuth";
import { PodaciVoznja } from "./models/rides/PodaciVoznja";
import { ProcitajStatusNaCekanju } from "./services/users/ProcitajStatusNaCekanju";

const PrivatneRute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const provera_stanja = useCallback(async () => {
    if (auth?.token && auth?.id) {
      const naCekanju: PodaciVoznja = await ProcitajStatusNaCekanju(
        auth.token,
        parseInt(auth.id)
      );

      if (naCekanju.id !== 0) {
        navigate("/cekanje", { replace: true });
      }
    }
  }, [auth, navigate]);

  useEffect(() => {
    provera_stanja();
  }, [provera_stanja]);

  if (!roles.includes(auth?.role ?? "")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PrivatneRute;
