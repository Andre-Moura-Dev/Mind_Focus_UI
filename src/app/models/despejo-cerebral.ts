export interface DespejoCerebral {
    idDespejoCerebral: number;
    idUsuario: number; // FK tabela usuarios
    conteudo: string;
    criadoEm: Date | string;
}