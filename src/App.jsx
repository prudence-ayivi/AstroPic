import { useState, useEffect, useCallback } from "react";
import DatePicker from "./components/DatePicker";
import APODdata from "./components/APODdata";
import { fetchAPOD } from "./api/ApodAPI";
import { FaSun, FaMoon, FaRandom, FaWhatsapp } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { Analytics } from '@vercel/analytics/react';



function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [date, setDate] = useState("1995-06-16");
  const [apod, setApod] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Récupération des données APOD selon la date
  const getAPOD = useCallback(async () => {
    const data = await fetchAPOD(date);
    setApod(data);
  }, [date]);

  useEffect(() => {
    getAPOD();
  }, [getAPOD]);

  const shareOnTwitter = useCallback((title, url) => {
    const tweet = `See this APOD! ${title} 🌌🚀 ${url}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      "_blank"
    );
  }, []);

  const shareOnWhatsApp = useCallback((title, url) => {
    const message = `See this APOD! ${title} 🌌🚀 ${url}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }, []);

  const downloadAPOD = useCallback(() => {
    if (apod && apod.hdurl) {
      window.open(apod.hdurl, "_blank");
    }
  }, [apod]);

  const getRandomDate = () => {
    const start = new Date(1995, 5, 16); 
    const end = new Date();
    const randomTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTime);
    return randomDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <div
        className="flex justify-between w-full bg-[url('./assets/banner.jpg')] bg-no-repeat bg-cover bg-center border-b min-h-[20vh] overflow-hidden pl-[5%] pt-[3%] md:pt-[1%]"
      >
        <div className="text-white text-left">
          <h1 className="text-4xl font-bold font-title">
            AstroPic
          </h1>
          <p className="py-4 w-[260px] text-lg">
            Explore APOD by date and see the APOD of your birth date
          </p>
        </div>
        <div>
        <div className="p-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-600 text-white"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col items-center justify-center gap-8 p-2 md:p-8 font-sans ${
            darkMode ? "bg-black text-white" : "bg-white text-black"
          } transition-colors`}>
        <div className="text-xl text-center font-bold mt-2">Starting only after June 16, 1995 ! 😉</div>
        <div className="flex-col items-center justify-center gap-8 p-4 border border-[#eee] rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 mb-4">
          <DatePicker onDateChange={setDate}/>
          <button
            onClick={() => setDate(getRandomDate())}
            className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
          >
            <FaRandom /> See Random APOD
          </button>
        </div>

        {/* APOD Data */}
        {apod ? <APODdata apod={apod} /> : <p>Loading Image...</p>}

        {/* Boutons Download & Share */}
        {apod && (
          <div className="flex flex-row gap-4 mt-4 pl-4">
            <button
              onClick={downloadAPOD}
              className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all"
            >
              Download HD Image
            </button>
            <button
              onClick={() => shareOnTwitter(apod.title, apod.url)}
              className="cursor-pointer bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RiTwitterXLine /> X
            </button>
            <button
              onClick={() => shareOnWhatsApp(apod.title, apod.url)}
              className="cursor-pointer bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaWhatsapp /> WhatsApp
            </button>
          </div>
        )}
        </div>
      </div>

      <Analytics />

    </div>
  );
}

export default App;
