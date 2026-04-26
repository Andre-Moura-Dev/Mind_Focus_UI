export interface Usuario {
    idUsuario: number;
    nome: string;
    email: string;
    senha?: string;
    criadoEm?: Date | string;
}