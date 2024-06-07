import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../provider/useAuth";
import { useNavigate } from "react-router-dom";
import {
  PodaciZaPrijavu,
  _init_podaci,
} from "../../models/auth/PodaciZaPrijavu";
import { PrijavaFormaProps } from "../../models/props/PrijavaFormaProps";

export const PrijavaForma: React.FC<PrijavaFormaProps> = ({
  Prijava,
  GooglePrijava,
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [podaci, setPodaci] = useState<PodaciZaPrijavu>(_init_podaci);
  const [obrada, setObrada] = useState<boolean>(false);

  useEffect(() => {
    // Ako je korisnik vec prijavljen nema pristup stranici za prijavu
    if (auth?.token) {
      navigate("/tabla", { replace: true });
    }
  }, [auth?.token, navigate]);

  const prijava = async () => {
    setObrada(true);
    // Poziv servisa za prijavu
    const token: string = await Prijava(podaci);

    if (token !== "") {
      auth?.login(token);
      navigate("/tabla", { replace: true });
    } else toast.error("Uneti podaci nisu tačni!");

    setObrada(false);
  };

  const google = async (googleToken: string) => {
    setObrada(true);
    // Poziv servisa za prijavu
    const token: string = await GooglePrijava(googleToken);

    if (token !== "") {
      auth?.login(token);
      navigate("/tabla", { replace: true });
    } else toast.error("Uneti podaci nisu tačni!");

    setObrada(false);
  };

  return (
    <>
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex bg-white/90 w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg lg:max-w-4xl">
          <div
            className="hidden bg-cover lg:block lg:w-1/2"
            style={{
              backgroundImage: 'url("loginbg.jpg")',
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
              Zdravo, ponovo!
            </p>
            <div className="flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg  hover:bg-gray-50">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  google(credentialResponse.credential ?? "");
                }}
                onError={() => {
                  toast.error("Prijava putem Google naloga nije dostupna.");
                }}
                shape="rectangular"
                logo_alignment="center"
                theme="outline"
                size="large"
                width={1000}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b lg:w-1/4" />
              <span className="text-xs text-center text-gray-500 uppercase hover:underline">
                ili se prijavite putem
              </span>
              <span className="w-1/5 border-b lg:w-1/4" />
            </div>
            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-600"
                htmlFor="LoggingEmailAddress"
              >
                Adresa elektronske pošte
              </label>
              <input
                placeholder="neko@google.email.com"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
                id="email"
                name="email"
                autoFocus
                value={podaci.email}
                onChange={(e) =>
                  setPodaci({ ...podaci, email: e.currentTarget.value })
                }
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label
                  className="block mb-2 text-sm font-medium text-gray-600 "
                  htmlFor="loggingPassword"
                >
                  Lozinka
                </label>
              </div>
              <input
                placeholder="*************"
                id="loggingPassword"
                className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                value={podaci.password}
                onChange={(e) =>
                  setPodaci({ ...podaci, password: e.currentTarget.value })
                }
              />
            </div>
            <div className="mt-6">
              <button
                className="w-full px-6 py-2 uppercase text-md font-medium tracking-wide text-white  transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                type="button"
                disabled={obrada}
                onClick={prijava}
              >
                {obrada ? "Prijavljivanje..." : " Prijavite se"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b md:w-1/4" />
              <a
                href="/registracija"
                className="text-xs text-gray-500 uppercase hover:underline"
              >
                ili kreirajte novi nalog
              </a>
              <span className="w-1/5 border-b md:w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
