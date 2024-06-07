import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../provider/useAuth";
import { useNavigate } from "react-router-dom";
import { RegistracijaFormaProps } from "../../models/props/RegistracijaFormaProps";
import {
  PodaciZaRegistraciju,
  _init_registracija,
} from "../../models/auth/PodaciZaRegistraciju";
import ImageCompressor from "image-compressor.js";

export const RegistracijaForma: React.FC<RegistracijaFormaProps> = ({
  Registracija,
  GooglePrijava,
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [lozinka, setLozinka] = useState<string>("");
  const [podaci, setPodaci] =
    useState<PodaciZaRegistraciju>(_init_registracija);
  const [obrada, setObrada] = useState<boolean>(false);

  useEffect(() => {
    // Ako je korisnik vec prijavljen nema pristup stranici za prijavu
    if (auth?.token) {
      navigate("/", { replace: true });
    }
  }, [auth?.token, navigate]);

  const registracija = async () => {
    // Provera da li je lozinka dobro uneta dvaput
    if (lozinka.trim().length < 6 || lozinka.trim() !== podaci.password) {
      toast.error("Lozinke se ne poklapaju!");
      return;
    }

    setObrada(true);
    // Poziv servisa za registraciju
    const token: string = await Registracija(podaci);

    if (token !== "") {
      auth?.login(token);
      navigate("/tabla", { replace: true });
    } else
      toast.error(
        "Uneti podaci nisu tačni ili je adresa elektronske pošte zauzeta!"
      );

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

  const handleCompressImage = async (file: File | null) => {
    setObrada(true);

    if (file && file.type.startsWith("image/")) {
      // Check if file is an image
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const compressedFile = await new ImageCompressor().compress(file, {
            quality: 0.6, // Adjust the quality as needed (0.6 means 60% quality)
            maxWidth: 800, // Maximum width of the compressed image
            maxHeight: 600, // Maximum height of the compressed image
            convertSize: 5000000, // Maximum size of the compressed image (in bytes)
          });
          // Assuming setData is a function to update state
          setPodaci({
            ...podaci,
            profileImage:
              compressedFile instanceof Blob
                ? await blobToBase64(compressedFile)
                : compressedFile,
          });
        } catch (error) {
          console.error("Image compression error:", error);
        }
      };

      reader.readAsDataURL(file);
    }
    setObrada(false);
  };

  // Helper function to convert Blob to Base64
  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
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
              Zdravo, zdravo!
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
                ili kreirajte nalog
              </span>
              <span className="w-1/5 border-b lg:w-1/4" />
            </div>
            <div className="flex gap-4">
              <div className="mt-4 w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Ime i prezime
                </label>
                <input
                  placeholder="Ana Neksić"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="text"
                  id="name"
                  name="name"
                  autoFocus
                  value={podaci.fullname}
                  onChange={(e) =>
                    setPodaci({ ...podaci, fullname: e.currentTarget.value })
                  }
                />
              </div>

              <div className="mt-4 w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Adresa
                </label>
                <input
                  placeholder="Železnička bb"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="text"
                  name="address"
                  value={podaci.address}
                  onChange={(e) =>
                    setPodaci({ ...podaci, address: e.currentTarget.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-4 w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Datum rođenja
                </label>
                <input
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  min={"1950-01-01"}
                  max={"2024-01-01"}
                  value={`${podaci.dateOfBirth.getFullYear()}-${String(
                    podaci.dateOfBirth.getMonth() + 1
                  ).padStart(2, "0")}-${String(
                    podaci.dateOfBirth.getDate()
                  ).padStart(2, "0")}`}
                  onChange={(e) =>
                    setPodaci({
                      ...podaci,
                      dateOfBirth: new Date(e.currentTarget.value),
                    })
                  }
                />
              </div>

              <div className="mt-4 w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Uloga
                </label>
                <select
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  name="role"
                  value={podaci.role}
                  onChange={(e) =>
                    setPodaci({
                      ...podaci,
                      role:
                        parseInt(e.currentTarget.value) === 0
                          ? 0
                          : parseInt(e.currentTarget.value) == 1
                          ? 1
                          : 2,
                    })
                  }
                >
                  <option value={0}>Admin</option>
                  <option value={1}>Korisnik</option>
                  <option value={2}>Vozač</option>
                </select>
              </div>
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
                value={podaci.email}
                onChange={(e) =>
                  setPodaci({
                    ...podaci,
                    email: e.currentTarget.value,
                    username: e.currentTarget.value.split("@")[0],
                  })
                }
              />
            </div>
            <div className="flex gap-4">
              <div className="mt-4 w-1/2">
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
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  value={podaci.password}
                  onChange={(e) =>
                    setPodaci({ ...podaci, password: e.currentTarget.value })
                  }
                />
              </div>
              <div className="mt-4 w-1/2">
                <div className="flex justify-between">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-600 "
                    htmlFor="loggingPassword"
                  >
                    Potvrdite lozinku
                  </label>
                </div>
                <input
                  placeholder="*************"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                  type="password"
                  value={lozinka}
                  onChange={(e) => setLozinka(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium text-gray-600"
                htmlFor="LoggingEmailAddress"
              >
                Profilna fotografija
              </label>
              <input
                name="image"
                type="file"
                required
                onChange={(e) => {
                  const file =
                    e.currentTarget.files && e.currentTarget.files[0];
                  handleCompressImage(file);
                }}
                className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-2.5 outline-none mb-2 text-black"
                placeholder="Profile Image"
              />
            </div>
            <div className="mt-6">
              <button
                className="w-full px-6 py-2 uppercase text-md font-medium tracking-wide text-white  transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                type="button"
                disabled={obrada}
                onClick={registracija}
              >
                {obrada ? "Registracija..." : " Registrujte se"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b md:w-1/4" />
              <a
                href="/registracija"
                className="text-xs text-gray-500 uppercase hover:underline"
              >
                ili se prijavite na nalog
              </a>
              <span className="w-1/5 border-b md:w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
