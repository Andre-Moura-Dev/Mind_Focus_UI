type NivelHumor = 1 | 2 | 3 | 4 | 5;

export interface SessoesFoco {
    idSessaoFoco: number;
    idUsuario: number // FK tabela usuarios
    duracaMinutos: number;
    humorApos: NivelHumor;
    dataSessao?: Date | string;
    criadoEm?: Date | string;
}