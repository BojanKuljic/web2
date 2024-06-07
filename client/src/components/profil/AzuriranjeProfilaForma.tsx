import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/useAuth";
import { useEffect, useState } from "react";
import {
  PodaciZaAzuriranjeKorisnika,
  _init_azuriranje,
} from "../../models/users/PodaciZaAzuriranjeKorisnika";
import {
  PodaciKorisnika,
  _init_korisnik,
} from "../../models/users/PodaciKorisnika";
import { AzuriranjeProfilaProps } from "../../models/props/AzuriranjeProfilaProps";
import toast from "react-hot-toast";
import ImageCompressor from "image-compressor.js";

export const AzuriranjeProfilaForma: React.FC<AzuriranjeProfilaProps> = ({
  ProcitajKorisnika,
  AzurirajKorisnickePodatke,
}) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [podaci, setPodaci] =
    useState<PodaciZaAzuriranjeKorisnika>(_init_azuriranje);
  const [korisnik, setKorisnik] = useState<PodaciKorisnika>(_init_korisnik);
  const [obrada, setObrada] = useState<boolean>(false);

  useEffect(() => {
    // Preuzimanje podataka o korisniku
    const procitajPodatke = async () => {
      const response: PodaciKorisnika = await ProcitajKorisnika(
        auth?.token ?? "",
        parseInt(auth?.id ?? "0")
      );

      if (response.id !== 0) {
        setKorisnik(response);

        setPodaci({
          username: response.username,
          email: response.email,
          password: "",
          fullname: response.fullName,
          dateOfBirth: new Date(response.dateOfBirth.toString().split("T")[0]),
          address: response.address,
          profileImage: "",
        });
      }
    };

    procitajPodatke();
  }, [ProcitajKorisnika, auth?.id, auth?.token, navigate, obrada]);

  const azuriranje = async () => {
    setObrada(true);

    const uspesno: boolean = await AzurirajKorisnickePodatke(
      auth?.token ?? "",
      parseInt(auth?.id ?? "0"),
      podaci
    );

    if (uspesno) toast.success("Korisnički podaci uspešno ažurirani!");
    else toast.error("Došlo je do greške prilikom ažuriranja podakaka!");

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
      <div className=" flex items-center justify-center min-h-screen w-full">
        <div className="flex bg-white/90 w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg lg:max-w-4xl">
          <div className="lg:block lg:w-1/2">
            <div className="bg-white py-6 sm:py-8 lg:py-12">
              <div className="max-w-screen-xl px-4 md:px-8">
                <div className="mb-4">
                  <h2 className="text-center text-2xl font-bold text-gray-800 mb-1 lg:text-2xl">
                    Hej, {korisnik.fullName}!
                  </h2>
                  <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg uppercase">
                    {korisnik.accountVerificationStatus === 1 && (
                      <span className="text-sm text-emerald-500 font-semibold md:text-base">
                        Verifikovan nalog ✅
                      </span>
                    )}
                    {korisnik.accountVerificationStatus === 0 && (
                      <span className="text-sm text-sky-500 font-semibold md:text-base">
                        Čeka se odobrenje 🔁
                      </span>
                    )}
                    {korisnik.accountVerificationStatus === 2 && (
                      <span className="text-sm text-red-500 font-semibold md:text-base">
                        Neverifikovan nalog ❌
                      </span>
                    )}
                  </p>
                </div>
                <div className="grid gap-x-4">
                  <div>
                    <div className=" mb-2 h-50 w-50 overflow-hidden rounded-lg bg-gray-100 shadow-lg sm:mb-4">
                      <img
                        src={korisnik.profileImage}
                        loading="lazy"
                        className="h-full w-full max-h-64 object-cover object-center"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sky-900 md:text-lg">
                        {korisnik.fullName}
                      </div>
                      <p className="text-sm text-gray-500 md:text-base">
                        {korisnik.email}
                      </p>
                      <p className="text-sm text-gray-500 md:text-base">
                        {korisnik.role === 0
                          ? "Administrator"
                          : korisnik.role === 1
                          ? "Korisnik"
                          : "Vozač"}
                      </p>
                      <p className="text-sm text-gray-500 md:text-base">
                        {korisnik.address}
                      </p>
                      <p className="text-sm text-gray-500 md:text-base">
                        {String(podaci.dateOfBirth.getDate()).padStart(2, "0")}.
                        {String(podaci.dateOfBirth.getMonth() + 1).padStart(
                          2,
                          "0"
                        )}
                        .{podaci.dateOfBirth.getFullYear()}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
            <div className="flex items-center justify-center text-gray-600 transition-colors duration-300 transform border rounded-lg  hover:bg-gray-50"></div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b lg:w-1/4" />
              <span className="text-xs text-center text-gray-500 uppercase hover:underline">
                Vaši korisnički podaci
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
                <div className="flex justify-between">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-600 "
                    htmlFor="loggingPassword"
                  >
                    Nova Lozinka
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
            </div>
            <div
              className={`mt-4 ${
                korisnik.isGoogleAccount && "select-none disabled"
              }`}
            >
              <label
                className="block mb-2 text-sm font-medium text-gray-600"
                htmlFor="LoggingEmailAddress"
              >
                Adresa elektronske pošte
              </label>
              <input
                placeholder="neko@google.email.com"
                className={`block ${
                  korisnik.isGoogleAccount &&
                  "select-none bg-gray-100 text-gray-400/80"
                }  w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300`}
                type="email"
                id="email"
                name="email"
                disabled={korisnik.isGoogleAccount}
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
                onClick={azuriranje}
              >
                <svg
                  className="w-6 h-6 inline mr-1 -mt-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.5 5.38468C18.6128 6.82466 20 9.25033 20 12C20 16.4183 16.4183 20 12 20C11.5898 20 11.1868 19.9691 10.7932 19.9096M13.1599 4.08348C12.7812 4.02847 12.3939 4 12 4C7.58172 4 4 7.58172 4 12C4 14.708 5.34553 17.1018 7.40451 18.5492M13.1599 4.08348L12.5 3M13.1599 4.08348L12.5 5M10.7932 19.9096L11.7561 19M10.7932 19.9096L11.5 21M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                {obrada ? "Čuvanje promena..." : "Ažuriranje podataka"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b md:w-1/4" />
              <a
                href="/tabla"
                className="text-xs text-gray-500 uppercase hover:underline"
              >
                ili se vratite početnu stranicu
              </a>
              <span className="w-1/5 border-b md:w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
