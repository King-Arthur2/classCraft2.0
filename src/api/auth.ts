import axios from "./axios";
import { Leccion } from "../types/leccion";
import { Evaluacion } from "../types/evaluacion";

export const registerRequest = (user: any) => axios.post(`/register`, user);

export const loginRequest = (user: any) => axios.post(`/login`, user);

export const verifyTokenRequest = () => axios.get(`/verify`);

export const getCharactersRequest = () => axios.get(`/characters`);

export const sendCharacterClassRequest = (characterClass: string, id: string) =>
  axios.post(`/updateCharacterClass`, { characterClass, id });

export const getPowersUser = (powers: number[]) =>
  axios.post(`/powers-id`, { powers });

export const sendUserStats = (
  id: string,
  experience: number,
  gold?: number
) => {
  // Verificar que al menos uno de los dos parámetros esté definido
  if (experience === undefined) {
    throw new Error("Debes proporcionar la 'experiencia'.");
  }
  // Si la validación pasa, se envía la solicitud
  return axios.post(`/updateStats`, { id, gold, experience });
};

export const updateGoldAndUnlockedAvatars = (
  id: string,
  avatarId: number,
  price: number
) => axios.post(`/buyAvatar`, { id, avatarId, price });

export const getAvatar = (id: number) => axios.get(`/desings/${id}`);

export const getAvatarComprados = (avatarsUnlocked: number[]) =>
  axios.post(`/desings-comprados`, { avatarsUnlocked });

export const updateAvatar = (avatar: number, id: string) =>
  axios.post(`/updateAvatar`, { avatar, id });

export const getAvatarDispoibles = (
  avatarsUnlocked: number[],
  classKey: string
) => axios.post(`/desings-disponibles`, { avatarsUnlocked, classKey });

export const getLeaderboard = () => axios.get(`/leaderboard`);

export const unlockLevels = (id: string, idLevel: number) => {
  if (
    idLevel === 6 ||
    idLevel === 12 ||
    idLevel === 18 ||
    idLevel === 19 ||
    idLevel === 20
  ) {
    return;
  }
  return axios.post(`/unlockLevels`, { id, idLevel });
};

export const blockLevels = (id: string, idLevel: number) => {
  return axios.post(`/blockLevels`, { id, idLevel });
}

export const sendDataLeccion = (datos : Leccion) => {
  return axios.post(`/new-leccion`, datos);
}

export const sendDataEvaluacion = (datos : Evaluacion) => {
  return axios.post(`/new-evaluacion`, datos);
}

export const logoutRequest = () => axios.post(`/logout`);