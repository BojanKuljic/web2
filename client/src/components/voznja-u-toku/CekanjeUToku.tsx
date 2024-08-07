import { useEffect, useRef, useState } from "react";
import { CekanjeUTokuProps } from "../../models/props/CekanjeUTokuProps";
import {
  PodaciVoznja,
  _init_podaciVoznja,
} from "../../models/rides/PodaciVoznja";
import { useAuth } from "../../provider/useAuth";
import { useNavigate } from "react-router-dom";
import { Navigacija } from "../../navigavija/Navigacija";
import Star from "./ZvezdicaOcene";
import toast from "react-hot-toast";

export const CekanjeUToku: React.FC<CekanjeUTokuProps> = ({
  ProcitajStatusNaCekanju,
  OceniVoznju,
}) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [voznja, setVoznja] = useState<PodaciVoznja>(_init_podaciVoznja);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const proveri = async () => {
      const naCekanju = await ProcitajStatusNaCekanju(
        auth?.token ?? "",
        parseInt(auth?.id ?? "0")
      );

      // If not pending and role is driver, navigate to the home page
      if (naCekanju.id === 0 && auth?.role === "Driver") {
        navigate("/tabla", { replace: true });
      }

      // If the ride is no longer pending, clear the interval
      if (naCekanju.id === 0 && auth?.role === "User") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setVoznja(naCekanju);
      }
    };

    // Check status every 0.3 seconds
    intervalRef.current = setInterval(proveri, 300);

    // Clean up the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    ProcitajStatusNaCekanju,
    auth?.id,
    auth?.role,
    auth?.token,
    navigate,
    setVoznja,
  ]);

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleMouseEnter = (index: number) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    setRating(index);
  };

  const ocenivanje = async () => {
    const uspesno: boolean = await OceniVoznju(
      auth?.token ?? "",
      voznja.id,
      rating
    );

    if (uspesno) {
      setTimeout(() => {
        toast.success("Hvala Vam. Vaše mišljenje nam je važno!");
      }, 1500);

      navigate("/tabla", { replace: true });
    } else toast.error("Nije moguće oceniti vožnju!");
  };

  return (
    <>
      <div className="flex">
        <Navigacija />
        <div
          style={{ backgroundColor: "#192339" }}
          className="flex py-6 sm:py-8 lg:py-12 flex-grow items-center justify-center"
        >
          {auth?.role === "User" &&
          voznja.waitingTime === 0 &&
          (voznja.travelTime ?? 0) <= 1 ? (
            <>
              <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="flex flex-col overflow-hidden rounded-lg shadow-xl bg-white/90 sm:flex-row md:h-80 p-4">
                  <div className="flex w-full flex-col p-4">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl lg:text-4xl">
                      Ocenite vožnju
                      <br />
                    </h2>
                    <p className="mb-4 max-w-md text-gray-800">
                      Vaša vožnja je završena. Sada je na red došlo da ocenite
                      našeg vozača i pomognete da unapredimo Vaše iskustvo.
                      <br />
                      <span className="text-sm italic text-right">
                        * Vaša recenzija je opciona
                      </span>
                    </p>
                    <div className="flex justify-center items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          filled={index < (hoverRating || rating)}
                          onClick={() => handleClick(index + 1)}
                          onMouseEnter={() => handleMouseEnter(index + 1)}
                          onMouseLeave={handleMouseLeave}
                        />
                      ))}
                    </div>
                    <div className="mt-auto flex gap-x-8">
                      <button
                        type="button"
                        onClick={ocenivanje}
                        className="inline-block rounded-lg text-gray-200 bg-teal-800 px-8 py-3 text-center text-sm font-semibold outline-none ring-gray-300 transition duration-100 hover:bg-teal-800/95 focus-visible:ring active:bg-teal-900 md:text-base"
                      >
                        <svg
                          className="w-4 h-4 inline mr-1 -mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18.6091 5.89092L15.5 9H21.5V3L18.6091 5.89092ZM18.6091 5.89092C16.965 4.1131 14.6125 3 12 3C7.36745 3 3.55237 6.50005 3.05493 11M5.39092 18.1091L2.5 21V15H8.5L5.39092 18.1091ZM5.39092 18.1091C7.03504 19.8869 9.38753 21 12 21C16.6326 21 20.4476 17.5 20.9451 13"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>{" "}
                        Pošaljite Vašu ocenu
                      </button>

                      <a
                        href="/prethodne-voznje"
                        className="inline-block rounded-lg text-gray-200 bg-gray-600 px-8 py-3 text-center text-sm font-semibold outline-none ring-gray-300 transition duration-100 hover:bg-gray-700/95 focus-visible:ring active:bg-gray-600/20 md:text-base"
                      >
                        <svg
                          className="w-4 h-4 inline mr-1 -mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.27769 1.7555C5.1348 1.01747 3.83955 1.13428 2.86078 1.80371C1.89423 2.46477 1.25 3.64507 1.25 5.03297V18.9672C1.25 20.3551 1.89423 21.5354 2.86078 22.1965C3.83956 22.8659 5.1348 22.9827 6.2777 22.2447L17.0667 15.2775C18.217 14.5347 18.75 13.2342 18.75 12.0001C18.75 10.7659 18.217 9.46544 17.0667 8.72261L6.27769 1.7555ZM2.75 5.03297C2.75 4.11167 3.17287 3.40753 3.70757 3.04182C4.23005 2.68448 4.87022 2.63219 5.46397 3.0156L16.253 9.98271C16.8895 10.3938 17.25 11.1637 17.25 12.0001C17.25 12.8364 16.8895 13.6064 16.253 14.0174L5.46397 20.9846C4.87023 21.368 4.23005 21.3157 3.70758 20.9583C3.17287 20.5926 2.75 19.8885 2.75 18.9672L2.75 5.03297Z"
                            fill="currentColor"
                          />{" "}
                          <path
                            d="M22.75 5.00008C22.75 4.58586 22.4142 4.25008 22 4.25008C21.5858 4.25008 21.25 4.58586 21.25 5.00008V19.0001C21.25 19.4143 21.5858 19.7501 22 19.7501C22.4142 19.7501 22.75 19.4143 22.75 19.0001V5.00008Z"
                            fill="currentColor"
                          />
                        </svg>{" "}
                        Preskočite ocenivanje
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <section className="container px-4 mx-auto">
              <div className="flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-950 rounded-xl shadow-lg">
                      <table className="min-w-full divide-y divide-gray-700 text-center">
                        <thead className="bg-gray-900">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Relacija
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Cena (RSD)
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Preostalo vreme dolaska
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Preostalo vreme putovanja
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-gray-700 bg-gray-900/60">
                          <tr className="text-center">
                            <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
                              {voznja.startAddress} - {voznja.endAddress}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
                              {voznja.price}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
                              {voznja.waitingTime} sekundi
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
                              {voznja.travelTime === 0
                                ? "Čeka se prihvatanje vožnje"
                                : voznja.travelTime + " sekundi"}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
                              {voznja.rideStatus === 1 ? (
                                <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-teal-500 bg-gray-800">
                                  <svg
                                    width={12}
                                    height={12}
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.5 7L2 4.5M2 4.5L4.5 2M2 4.5H8C8.53043 4.5 9.03914 4.71071 9.41421 5.08579C9.78929 5.46086 10 5.96957 10 6.5V10"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <h2 className="text-sm font-normal">
                                    Kreirana
                                  </h2>
                                </div>
                              ) : voznja.rideStatus === 0 ? (
                                <div className="inline-flex items-center px-3 py-1 text-sky-500 rounded-full gap-x-2 bg-gray-800">
                                  <svg
                                    width={12}
                                    height={12}
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M4.5 7L2 4.5M2 4.5L4.5 2M2 4.5H8C8.53043 4.5 9.03914 4.71071 9.41421 5.08579C9.78929 5.46086 10 5.96957 10 6.5V10"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <h2 className="text-sm font-normal">
                                    U toku
                                  </h2>
                                </div>
                              ) : (
                                <div className="inline-flex items-center px-3 py-1 text-emerald-500 rounded-full gap-x-2 bg-gray-800">
                                  <svg
                                    width={12}
                                    height={12}
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10 3L4.5 8.5L2 6"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <h2 className="text-sm font-normal">
                                    Gotova
                                  </h2>
                                </div>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};
