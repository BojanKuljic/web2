import { useEffect, useState } from "react";
import { Navigacija } from "../../navigavija/Navigacija";
import { useAuth } from "../../provider/useAuth";
import { PodaciKorisnika } from "../../models/users/PodaciKorisnika";
import { VerifikacijaVozacaProps } from "../../models/props/VerifikacijaVozacaProps";
import { TabelaVozaca } from "./TabelaVozaca";

export const VerifikacijaVozaca: React.FC<VerifikacijaVozacaProps> = ({
  ProcitajVozace,
  PromenaStatusaVerifikacije,
  PromenaStatusaBlokiranja,
}) => {
  const auth = useAuth();
  const [vozaci, setVozaci] = useState<PodaciKorisnika[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 3;

  useEffect(() => {
    // Dobavljanje liste svih vozaca
    const dobaviPodatke = async () => {
      const response: PodaciKorisnika[] = await ProcitajVozace(auth?.token ?? "");
      setVozaci(response);
    };

    dobaviPodatke();
  }, [ProcitajVozace, auth?.token]);

  const totalPages = Math.ceil(vozaci.length / resultsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginatedVozaci = vozaci.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <div className="flex">
        <Navigacija />
        <div
          style={{ backgroundColor: "#192339" }}
          className="flex py-6 sm:py-8 lg:py-12 flex-grow items-center justify-center"
        >
          {vozaci.length === 0 ? (
            <>
              <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="flex flex-col overflow-hidden rounded-lg bg-white/90 sm:flex-row md:h-80">
                  <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-2/5">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl lg:text-4xl">
                      Uh, on, ne!
                      <br />
                    </h2>
                    <p className="mb-8 max-w-md text-gray-800">
                      U našem sistemu nije registrovan nijedan vozač. To nužno
                      ne mora da predstavlja problem, ali za svaki slučaj
                      osvežite stranicu.
                    </p>
                    <div className="mt-auto">
                      <a
                        href="/verifikacija-vozaca"
                        className="inline-block rounded-lg text-gray-200 bg-gray-800 px-8 py-3 text-center text-sm font-semibold outline-none ring-gray-300 transition duration-100 hover:bg-gray-800/95 focus-visible:ring active:bg-gray-900 md:text-base"
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
                        Dobavite nove podatke
                      </a>
                    </div>
                  </div>
                  <div className="order-first h-48 w-full bg-gray-700 sm:order-none sm:h-auto sm:w-1/2 lg:w-3/5">
                    <img
                      src="notfound.jpg"
                      loading="lazy"
                      className="h-full w-full object-cover object-center"
                    />
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
                              Osnovni podaci
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Datum rođenja
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Meta ocena
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Blokiran
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-semibold rtl:text-right text-gray-400"
                            >
                              Verifikacija
                            </th>
                            <th scope="col" className="relative py-3.5 px-4  text-sm font-semibold rtl:text-right text-gray-400">
                              <span>Dostupne opcije</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-gray-700 bg-gray-900">
                          {paginatedVozaci.map(
                            (vozac: PodaciKorisnika, index: number) => (
                              <TabelaVozaca
                                key={index}
                                vozac={vozac}
                                PromenaStatusaVerifikacije={
                                  PromenaStatusaVerifikacije
                                }
                                PromenaStatusaBlokiranja={
                                  PromenaStatusaBlokiranja
                                }
                              />
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-5 py-2 text-sm capitalize transition-colors duration-200 border rounded-md gap-x-2 bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 rtl:-scale-x-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>
                  <span>Prethodno</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-5 py-2 text-sm capitalize transition-colors duration-200 border rounded-md gap-x-2 bg-gray-900 text-gray-200 border-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Sledeće</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 rtl:-scale-x-100"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};
