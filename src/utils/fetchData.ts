import { updateGoldAndUnlockedAvatars, getAvatarDispoibles } from "../api/auth";

export const unlockAvatar = async (id: string, idAvatar: number, price: number) => {
  try {
    const res = await updateGoldAndUnlockedAvatars(id, idAvatar, price);
    return res.data;
  } catch (error) {
    if (error instanceof Error && (error as any).response) {
      return (error as any).response.data;
    } else {
      throw error;
    }
  }
};

export const avatarDisponibles = async (avatarsUnlocked: number[], classKey: string) => {
  try {
    const res = await getAvatarDispoibles(avatarsUnlocked, classKey);
    return res.data;
  } catch (error) {
    if (error instanceof Error && (error as any).response) {
      return (error as any).response.data;
    } else {
      throw error;
    }
  }
}
