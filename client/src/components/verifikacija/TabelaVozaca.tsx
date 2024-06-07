import { useState } from "react";
import { PodaciKorisnika } from "../../models/users/PodaciKorisnika";
import { TabelaVozacaProps } from "../../models/props/TabelaVozacaProps";
import { useAuth } from "../../provider/useAuth";
import toast from "react-hot-toast";

export const TabelaVozaca: React.FC<TabelaVozacaProps> = ({
  vozac,
  PromenaStatusaVerifikacije,
  PromenaStatusaBlokiranja,
}) => {
  const auth = useAuth();
  const [vozacRed, setVozac] = useState<PodaciKorisnika>(vozac);

  const promeniStatusVerifikacije = async (novi_status: boolean) => {
    const uspesno: boolean = await PromenaStatusaVerifikacije(
      auth?.token ?? "",
      vozacRed.id,
      novi_status
    );

    if (uspesno) {
      toast.success(`Vozač je ${novi_status ? "verifikovan" : "odbijen"}!`);
      setVozac({ ...vozacRed, accountVerificationStatus: novi_status ? 1 : 2 });
    } else {
      toast.error("Status verifikacije vozača nije promenjen!");
    }
  };

  const promeniStatusBlokiranja = async () => {
    const uspesno: boolean = await PromenaStatusaBlokiranja(
      auth?.token ?? "",
      vozacRed.id,
      !vozacRed.isBlocked
    );

    if (uspesno) {
      toast.success(
        `Vozač je ${vozacRed.isBlocked ? "odblokiran" : "blokiran"}!`
      );
      setVozac({ ...vozacRed, isBlocked: !vozacRed.isBlocked });
    } else {
      toast.error("Status blokiranja vozača nije promenjen!");
    }
  };

  return (
    <>
      <tr className="text-center">
        <td className="px-4 py-4 text-sm text-left text-gray-300 whitespace-nowrap">
          <div className="flex items-center gap-x-2">
            <img
              className="object-cover w-8 h-8 rounded-full"
              src={vozacRed.profileImage}
              alt=""
            />
            <div>
              <h2 className="text-sm font-medium text-white ">
                {vozacRed.fullName}
              </h2>
              <p className="text-xs font-normal text-gray-400">
                {vozacRed.email}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
          {new Date(vozacRed.dateOfBirth).toLocaleDateString("sr-RS")}
        </td>
        <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
          {vozacRed.ratingScore === 0 ? "Nije ocenjen" : vozacRed.ratingScore}
        </td>
        <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
          {vozacRed.isBlocked === false ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-gray-800">
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
              <h2 className="text-sm font-normal">Bez blokade</h2>
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-gray-800">
              <svg
                width={12}
                height={12}
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-sm font-normal">Blokiran</h2>
            </div>
          )}
        </td>
        <td className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap">
          {vozacRed.accountVerificationStatus === 1 ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-gray-800">
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
              <h2 className="text-sm font-normal">Odobren</h2>
            </div>
          ) : vozacRed.accountVerificationStatus === 2 ? (
            <div className="inline-flex items-center px-3 py-1 text-red-500 rounded-full gap-x-2 bg-gray-800">
              <svg
                width={12}
                height={12}
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-sm font-normal">Odbijen</h2>
            </div>
          ) : (
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

              <h2 className="text-sm font-normal">Čeka odobrenje</h2>
            </div>
          )}
        </td>
        <td className="px-4 py-4 text-sm whitespace-nowrap">
          <div className="flex items-center gap-x-6">
            {vozacRed.accountVerificationStatus === 0 && (
              <>
                <button
                  onClick={() => promeniStatusVerifikacije(true)}
                  className="flex items-center px-3 py-1.5 font-medium tracking-wide text-gray-100 capitalize transition-colors duration-300 transform bg-emerald-600 rounded-lg hover:bg-emerald-600/80 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
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
                  <span className="mx-1">Odobri</span>
                </button>
                <button
                  onClick={() => promeniStatusVerifikacije(false)}
                  className="flex items-center px-3 py-1.5 font-medium tracking-wide text-gray-100 capitalize transition-colors duration-300 transform bg-amber-700 rounded-lg hover:bg-amber-700/80 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                >
                  <svg
                    className="w-4 h-4 mx-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g id="SVGRepo_iconCarrier">
                      <style
                        type="text/css"
                        dangerouslySetInnerHTML={{
                          __html:
                            "\n      .st0 {\n        fill: none;\n        stroke: lightgray;\n        stroke-width: 2;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        stroke-miterlimit: 10;\n      }\n    ",
                        }}
                      />
                      <circle className="st0" cx={16} cy={16} r={13} />
                      <line
                        className="st0"
                        x1="6.8"
                        y1="6.8"
                        x2="25.2"
                        y2="25.2"
                      />
                    </g>
                  </svg>
                  <span className="mx-1">Odbij</span>
                </button>
              </>
            )}{" "}
            {/* blokiraj odblokiraj */}
            {vozacRed.isBlocked ? (
              <button
                onClick={() => promeniStatusBlokiranja()}
                className="flex items-center px-3 py-1.5 font-medium tracking-wide text-gray-100 capitalize transition-colors duration-300 transform bg-teal-700 rounded-lg hover:bg-teal-700/80 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
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
                <span className="mx-1">Odblokiraj</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => promeniStatusBlokiranja()}
                  className="flex items-center px-3 py-1.5 font-medium tracking-wide text-gray-100 capitalize transition-colors duration-300 transform bg-red-700 rounded-lg hover:bg-red-700/80 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
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
                  <span className="mx-1">Blokiraj</span>
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};
