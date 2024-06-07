import { AzuriranjeProfilaProps } from "../../models/props/AzuriranjeProfilaProps";
import { Navigacija } from "../../navigavija/Navigacija";
import { AzuriranjeProfilaForma } from "./AzuriranjeProfilaForma";

export const Profil: React.FC<AzuriranjeProfilaProps> = ({
  ProcitajKorisnika,
  AzurirajKorisnickePodatke,
}) => {
  return (
    <>
      <div className="flex">
        <Navigacija />
        <div
          style={{ backgroundColor: "#192339" }}
          className="flex flex-grow items-center justify-center"
        >
          <AzuriranjeProfilaForma
            ProcitajKorisnika={ProcitajKorisnika}
            AzurirajKorisnickePodatke={AzurirajKorisnickePodatke}
          />
        </div>
      </div>
    </>
  );
};
