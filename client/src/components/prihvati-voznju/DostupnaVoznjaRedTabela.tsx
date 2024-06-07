import toast from "react-hot-toast";
import { DostupneVoznjeProps } from "../../models/props/DostupneVoznjeProps";
import { PodaciVoznja } from "../../models/rides/PodaciVoznja";
import { useAuth } from "../../provider/useAuth";
import { useNavigate } from "react-router-dom";

export const DostupnaVoznjaRedTabela: React.FC<DostupneVoznjeProps> = ({
  voznja,
  PrihvatiVoznju,
}) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const prihvati = async () => {
    // Postavljenj id vozaca za prihvatanje voznje
    voznja.userId = parseInt(auth?.id ?? "0");

    const response: PodaciVoznja = await PrihvatiVoznju(
      auth?.token ?? "",
      voznja
    );

    if (response.id === 0) toast.error("Vožnja nije prihvaćena. Nalog Vam nije odobren!");
    else navigate("/cekanje", { replace: true });
  };

  return (
    <>
      <tr className="text-center">
        <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
          {voznja.startAddress}
        </td>
        <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
          {voznja.endAddress}
        </td>
        <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
          {voznja.price}
        </td>
        <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
          {voznja.waitingTime} sekundi
        </td>
        <td className="flex justify-center items-center mt-2 mb-2">
          <button
            onClick={prihvati}
            className="flex items-center px-3 py-1.5 gap-y-2 justify-center font-medium tracking-wide text-gray-100 capitalize transition-colors duration-300 transform bg-teal-700 rounded-lg hover:bg-teal-700/80 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          >
            <svg
              className="w-4 h-4 mx-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 28 28"
              fill="currentColor"
            >
              <path
                d="M6.65263 14.0304C6.29251 13.6703 6.29251 13.0864 6.65263 12.7263C7.01276 12.3662 7.59663 12.3662 7.95676 12.7263L11.6602 16.4297L19.438 8.65183C19.7981 8.29171 20.382 8.29171 20.7421 8.65183C21.1023 9.01195 21.1023 9.59583 20.7421 9.95596L12.3667 18.3314C11.9762 18.7219 11.343 18.7219 10.9525 18.3314L6.65263 14.0304Z"
                fill="currentColor"
              />
              <path
                clipRule="evenodd"
                d="M14 1C6.8203 1 1 6.8203 1 14C1 21.1797 6.8203 27 14 27C21.1797 27 27 21.1797 27 14C27 6.8203 21.1797 1 14 1ZM3 14C3 7.92487 7.92487 3 14 3C20.0751 3 25 7.92487 25 14C25 20.0751 20.0751 25 14 25C7.92487 25 3 20.0751 3 14Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
            <span className="mx-1">Prihvati</span>
          </button>
        </td>
      </tr>
    </>
  );
};
