import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ModalTutorialMainPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: false,
    dots: true,
    slidesToShow: 1,
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#2F4F4F] p-6 rounded-lg shadow-lg w-[90%] max-w-lg flex flex-col gap-4 ">
            <h2 className="text-xl font-bold text-white text-center">
              ¡Bienvenido a Class!
            </h2>
            <p className="text-center text-white">
              Estas son algunas funciones que tienes dentro de la plataforma.
            </p>

            {/* Slider */}
            <div className="mt-4">
              <Slider {...settings} className="mx-auto">
                {[
                  "En la parte central de la pantalla podrás observar diferentes mapas con distintos niveles. Para desbloquearlos deberás completar las lecciones de los niveles anteriores.",
                  "En la parte derecha de la pantalla podrás observar tu avatar, nombre de usuario y nivel actual. Podrás personalizar tu avatar haciendo clic en el lápiz.",
                  "También podrás observar tu barra de experiencia, la cual representa el nivel necesario para alcanzar el siguiente nivel y tu experiencia actual.",
                  "Los niveles finales de cada mundo son especiales. A diferencia de los demás, estos solo los podrás hacer una vez, así que ten cuidado y elige sabiamente cuándo hacerlos.",
                  "Por último, cuentas con otras dos pantallas: 'Tienda' para utilizar tu oro ganado y comprar diferentes avatares, y la pantalla de 'Puntuaciones', en la cual podrás observar el récord de los demás jugadores y el tuyo.",
                ].map((text, index) => (
                  <div
                    key={index}
                    className="p-6 bg-[#2F4F4F] rounded-lg border-2 border-white text-white text-center"
                  >
                    <p>{text}</p>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Botón de cerrar */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#2F4F4F] text-white rounded-lg hover:bg-white hover:text-[#2F4F4F] transition border-2 border-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalTutorialMainPage;
