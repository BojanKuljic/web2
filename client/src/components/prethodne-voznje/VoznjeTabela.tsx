import { PodaciVoznja } from "../../models/rides/PodaciVoznja";

export const TabelaVoznja: React.FC<{ voznja: PodaciVoznja }> = ({
  voznja,
}) => {
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
        <td className="px-4 py-4 text-sm font-medium text-gray-300 whitespace-nowrap">
          {voznja.travelTime ? voznja.travelTime + " sekundi" : "Nije započeta"}
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
              <h2 className="text-sm font-normal">Kreirana</h2>
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
              <h2 className="text-sm font-normal">U toku</h2>
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
              <h2 className="text-sm font-normal">Gotova</h2>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};
