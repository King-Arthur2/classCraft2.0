export interface User {
    _id: string;
    username: string;
    gold: number;
    avatarsUnlocked: number[];
    characterClass: string;
    experience: number;
    powers: number[];
    level: number;
    levelsUnlocked: number[];
    avatar: number;
}

export interface Register {
    username: string;
    email: string;
    password: string;
}

export interface Login {
    email: string;
    password: string;
}

export type CharacterName = "Mago oscuro" | "Arquero elfo" | "Caballero noble";



