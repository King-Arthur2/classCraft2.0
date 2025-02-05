export interface Leccion {
    leccion: number;
    aprobada: boolean;
    dificultad: string;
    respuestasCorrectas: number;
    respuestasIncorrectas: number;
    preguntasRespuestas: string[];
    tiempo: number;
}