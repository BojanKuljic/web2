import { KreiranjeVoznjeProps } from "../../models/props/KreiranjeVoznjeProps";
import { Navigacija } from "../../navigavija/Navigacija";
import { KreiranjeVoznjeForma } from "./KreiranjeVoznjeForma";

export const KreiranjeVoznje: React.FC<KreiranjeVoznjeProps> = ({
  KreirajVoznju,
}) => {
  return (
    <>
      <div className="flex">
        <Navigacija />
        <div
          style={{ backgroundColor: "#192339" }}
          className="flex py-6 sm:py-8 lg:py-12 flex-grow items-center justify-center"
        >
          <KreiranjeVoznjeForma KreirajVoznju={KreirajVoznju} />
        </div>
      </div>
    </>
  );
};
