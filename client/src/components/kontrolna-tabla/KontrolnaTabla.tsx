import { Navigacija } from "../../navigavija/Navigacija";

export const KontrolnaTabla: React.FC = () => {
  return (
    <div className="flex">
      <Navigacija />
      <div
        style={{ backgroundColor: "#192339" }}
        className="flex py-6 sm:py-8 lg:py-12 flex-grow items-center justify-center"
      >
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col overflow-hidden rounded-lg bg-white/90 sm:flex-row md:h-80">
            <div className="flex w-full flex-col p-4 sm:w-1/2 sm:p-8 lg:w-2/5">
              <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl lg:text-4xl">
                Vožnja sa nama
                <br />
                pomera granice.
              </h2>
              <p className="mb-8 max-w-md text-gray-800">
                Da li ste u žurbi ili ne? Potreban Vam je hitno taksi? Odgovor
                na pitanja nalazi se kod nas.
              </p>
              <div className="mt-auto">
                <a
                  href="/profil"
                  className="inline-block rounded-lg text-gray-200 bg-gray-800 px-8 py-3 text-center text-sm font-semibold outline-none ring-gray-300 transition duration-100 hover:bg-gray-800/95 focus-visible:ring active:bg-gray-800 md:text-base"
                >
                  <svg
                    className="w-5 h-5 inline mr-1 -mt-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>{" "}
                  Pregled profila
                </a>
              </div>
            </div>
            <div className="order-first h-48 w-full bg-gray-700 sm:order-none sm:h-auto sm:w-1/2 lg:w-3/5">
              <img
                src="main.jpg"
                loading="lazy"
                alt="Photo by Dom Hill"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
