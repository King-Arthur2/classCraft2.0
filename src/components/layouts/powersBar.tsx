import { useState, useEffect } from "react";
import { getPowers  } from "../../utils/functions";

interface PowersBarProps {
  userPowers: number[];
  userLevel: number;
  handlePowers: (powerId: number, index: number) => void;
  powersDisabled: boolean[];
}

const PowersBar: React.FC<PowersBarProps> = ({ userPowers, userLevel, handlePowers, powersDisabled}) => {
  const [powers, setPowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPowers || userPowers.length === 0) return;

    const fetchPowers = async () => {
      const data = await getPowers(userPowers);
      setPowers(data);
      setLoading(false);
    };

    fetchPowers();
  }, [userPowers]);

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {powers.map((power, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center relative group w-40"
        >
          <div className="bg-beige-dark bg-opacity-50 w-24 flex items-center justify-center shadow-pixel">
            <p className="text-center texts-sm text-black">{power.nombre}</p>
          </div>
          <div className="flex items-center w-24 h-24 bg-beige border-4 border-beige-dark shadow-pixel">
            <img
              src={power.image}
              alt={power.descripcion}
              className={`block w-20 h-20 mx-auto ${userLevel < power.desbloqueado || powersDisabled[index] ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => handlePowers(power._id, index)}
            />
          </div>
          <span className="absolute top-0 right-36 w-full transform-translate-x-1/2 mt-2 rounded-br-lg rounded-tl-lg bg-[#6D9773] border-4 border-beige-dark shadow-pixel bg-opacity-100 text-white text-center px-4 py-2 opacity-0 group-hover:opacity-100 transition duration-300">
            {power.descripcion}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PowersBar;
