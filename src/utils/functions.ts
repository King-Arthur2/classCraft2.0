//Importaciones de peticiones.
import { getPowersUser } from "../api/auth";

export const calculateExperienceForLevel = (level: number): number => {
  const base = 250; // Experiencia base para el primer nivel
  const factor = 1.5; // Incremento progresivo
  return Math.floor(base * Math.pow(level, factor));
};

export const getPowers = async (userId: number[]) => {
  try {
    const res = await getPowersUser(userId);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//Funciones para calcular las recompensas al terminar el nivel. 

export const calculateGold = (respuestas: number, bonoGeneral: boolean, bonoEspecial: boolean): number => {
     return bonoGeneral ? (respuestas * 10 ) * 1.25 : bonoEspecial ? (respuestas * 10 ) * 1.5 : respuestas * 10;
 }

 export const calculateExperience = (respuestas: number, bonoGeneral: boolean, bonoEspecial: boolean): number => {
     return bonoGeneral ? (respuestas * 100 ) * 1.25 : bonoEspecial ? (respuestas * 100 ) * 1.5 : respuestas * 100;
 }