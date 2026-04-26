type PrioridadeTarefa = "ALTA" | "MEDIA" | "BAIXA";

export interface Tarefa {
    idTarefa: number;
    idUsuario: number // FK tabela usuarios
    titulo: string;
    descricao: string;
    prioridade: PrioridadeTarefa;
    completada: boolean;
    dataTarefa?: Date | string;
    criadaEm?: Date | string;
}