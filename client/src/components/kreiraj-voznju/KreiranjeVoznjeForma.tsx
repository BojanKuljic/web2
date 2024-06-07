import { useState } from "react";
import { KreiranjeVoznjeProps } from "../../models/props/KreiranjeVoznjeProps";
import {
  PodaciVoznja,
  _init_podaciVoznja,
} from "../../models/rides/PodaciVoznja";
import toast from "react-hot-toast";
import { useAuth } from "../../provider/useAuth";
import { useNavigate } from "react-router-dom";

export const KreiranjeVoznjeForma: React.FC<KreiranjeVoznjeProps> = ({
  KreirajVoznju,
}) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [podaci, setPodaci] = useState<PodaciVoznja>(_init_podaciVoznja);
  const [obrada, setObrada] = useState<boolean>(false);

  const kreiranjeVoznje = async () => {
    if (podaci.startAddress.trim().length < 3) {
      toast.error("Unesite adresu polazne tačke!");
      return;
    }

    if (podaci.endAddress.trim().length < 3) {
      toast.error("Unesite adresu krajnje tačke!");
      return;
    }

    setObrada(true);

    // Poziv servisa za kreiranje voznje
    const voznja: PodaciVoznja = await KreirajVoznju(auth?.token ?? "", podaci);

    // Ako je voznja uspesno kreirana prebaci korisnika na stranicu za cekanje
    if (voznja.id !== 0) {
      navigate("/cekanje", { replace: true });
    } else {
      toast.error("Nije moguće zakazivanje vožnje!");
    }

    setObrada(false);
  };

  const proracunCene = () => {
    if (podaci.startAddress.trim().length < 3) {
      toast.error("Unesite adresu polazne tačke!");
      return;
    }

    if (podaci.endAddress.trim().length < 3) {
      toast.error("Unesite adresu krajnje tačke!");
      return;
    }

    const cena: number = Math.random() * (5000 - 280) + 280;
    const vreme_cekenja: number = Math.random() * (60 - 10) + 10;
    setPodaci({
      ...podaci,
      price: Math.round(cena),
      waitingTime: Math.round(vreme_cekenja),
      userId: parseInt(auth?.id ?? "0"),
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="flex bg-white/90 w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg lg:max-w-4xl">
          <div
            className="hidden bg-cover lg:block lg:w-1/2"
            style={{
              backgroundImage: 'url("new.jpg")',
            }}
          />
          <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
            <div className="flex justify-center mx-auto">
              <img
                className="w-auto h-7 sm:h-8 hue-rotate-180 rounded-xl"
                src="logo.png"
                alt=""
              />
            </div>
            <p className="mt-3 text-xl text-center text-gray-600">
              Hej, hoj, rezerviši vožnju!
            </p>
            <div className="flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg hover:bg-gray-50"></div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b border-gray-300" />
              <span className="flex flex-col items-center text-sm text-gray-500 uppercase">
                <span className="text-lg text-emerald-700 font-bold">
                  {podaci.price === 0 ? "Čeka se unos" : podaci.price}
                </span>
                <span className="text-xs">dinara je cena vaše vožnje</span>
                <span className="text-lg text-sky-700 font-bold">
                  {podaci.waitingTime === 0
                    ? "Čeka se unos"
                    : podaci.waitingTime}
                </span>
                <span className="text-xs">sekundi je vreme dolaska vozača</span>
              </span>
              <span className="w-1/5 border-b border-gray-300 lg:w-1/4" />
            </div>

            <div className="mt-4 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Polazište
              </label>
              <input
                placeholder="Trg Dositija Obradovića 6b"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                id="name"
                name="name"
                autoFocus
                value={podaci.startAddress}
                onChange={(e) =>
                  setPodaci({
                    ...podaci,
                    startAddress: e.currentTarget.value,
                  })
                }
              />
            </div>

            <div className="mt-4 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-600">
                Odredište
              </label>
              <input
                placeholder="Železnička bb"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                name="endaddr"
                value={podaci.endAddress}
                onChange={(e) =>
                  setPodaci({ ...podaci, endAddress: e.currentTarget.value })
                }
              />
            </div>

            <div className="mt-6 flex gap-x-4">
              <button
                className="w-1/2 px-6 py-2 uppercase text-md font-medium tracking-wide text-white  transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                type="button"
                disabled={obrada}
                onClick={proracunCene}
              >
                Poručite
              </button>
              <button
                className={`w-1/2 px-6 py-2 uppercase text-md font-medium tracking-wide text-white  transition-colors duration-300 transform ${
                  podaci.price === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-teal-800 hover:bg-teal-700"
                } rounded-lg  focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50`}
                type="button"
                disabled={obrada || podaci.price === 0.0}
                onClick={kreiranjeVoznje}
              >
                {obrada ? "Zakazivanje..." : "Zakažite"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b md:w-1/4" />
              <a
                href="/table"
                className="text-xs text-gray-500 uppercase hover:underline"
              >
                ili se vratite na početnu
              </a>
              <span className="w-1/5 border-b md:w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
