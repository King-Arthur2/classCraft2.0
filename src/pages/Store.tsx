//Importaciones externas, librerías.
import React, { useState, useEffect } from "react";

//Importaciones internas, componentes, hooks, contextos, estilos.
import HeaderNav from "../components/layouts/header-nav";
import { useAuth } from "../context/AuthContext";
import { unlockAvatar, avatarDisponibles } from "../utils/fetchData";
import { User } from "../types/user";
import { successModal } from "../utils/modals";
import "../styles/styles-Store.css";

//Componente principal.
const Store: React.FC = () => {
  //Estados y referencias local del componente.
  const [activeTab, setActiveTab] = useState("personalize");
  const [listaAvataresDisponibles, setListaAvataresDisponibles] =
    useState<any>();
  const { user, setUser } = useAuth() as {
    user: User;
    setUser: (user: User) => void;
  };

  //Hook de efecto y ciclo de vida del componente.
  useEffect(() => {
    const fetchData = async () => {
      const res = await avatarDisponibles(
        user.avatarsUnlocked,
        user.characterClass
      );
      setListaAvataresDisponibles(res);
      
    };
    fetchData();
  }, [user]);

  //Funciones y métodos del componente.

  const comprarAvatar = async (price: number, idAvatar: number) => {
    if (user.gold >= price) {
      const res = await unlockAvatar(user._id, idAvatar, price);
      if (res) {
        console.log(res);
        setUser({ ...user, gold: res.gold, avatarsUnlocked: res.avatarsUnlocked });
        successModal("Avatar comprado con éxito");
      } else {
        alert("Hubo un error al comprar el avatar");
      }
    } else {
      alert("No tienes suficientes monedas");
    }
  };

  return (
    <div className="store-container">
      {/* Barra Superior */}
      <HeaderNav />

      {/* Contenido Principal */}
      <main className="store-main">
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === "personalize" ? "active" : ""}`}
            onClick={() => setActiveTab("personalize")}
          >
            Personaliza tu personaje
          </button>
        </div>

        {/* Contenido según Tab Activo */}
        {activeTab === "personalize" && listaAvataresDisponibles && (
          <section className="store-section">
            <div className="p-4 bg-[#99582a] mb-6 flex flex-col gap-3 rounded-xl">
              <h2 className="font-bold font-merriweathe text-white text-2xl">
                Desbloquea nuevos personajes
              </h2>
              <p className="flex flex-row items-center gap-2 ">
                <i className="fa-solid fa-coins text-[#FFD43B]"></i>
                <span className="">Oro:</span>
                {user.gold}
              </p>
            </div>
            <div className="bg-[#ffe6a7] grid grid-cols-3 gap-6">
              {listaAvataresDisponibles.map((character: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col border-8 border-[#99582a] shadow-pixel justify-center items-center px-2 gap-2 pb-2"
                >
                  <div className="bg-[#99582a] w-full h-3/12 rounded-b-3xl flex flex-col justify-center items-center">
                    <h3 className="font-bold text-white font-merriweather text-xl">
                      {character.label}
                    </h3>
                  </div>
                  <div className="flex flex-col justify-center items-center image-avatar w-full h-80  ">
                    <img
                      src={character.image}
                      alt={character.label}
                      className="w-64 h-64"
                    />
                  </div>
                  <div className="w-full">
                    <button
                      className="text-white text-xl text-bold px-8 py-2  w-full bg-[#99582a] hover:bg-[#edc531] "
                      onClick={() =>
                        comprarAvatar(character.costo, character._id)
                      }
                    >
                      ${character.costo}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Store;
