import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { RestApiService } from './rest-api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksServicesService extends AbstractService<object> {

  public override api: string;

  constructor(http: RestApiService) { 
    super(http);
    this.api = `${environment.apiUrl}/tarefa`;
  }

  public getAll(): Observable<any> {
    const url = this.api + '/listar';
    return this.http.sendGet(url);
  }

  public postTarefas(dto: any): Observable<any> {
    const url = this.api + '/cadastrar';
    return this.http.sendPost(url, dto);
  }

  public putTarefas(id: number, dto: any): Observable<any> {
    const url = this.api + `/atualizar/${id}`;
    return this.http.sendPut(url, dto);
  }

  public deleteTarefas(id: number): Observable<any> {
    const url = this.api + `/deletar/${id}`;
    return this.http.sendDelete(url);
  }

  public getPorId(id: number): Observable<any> {
    const url = this.api + `/buscar-por-id/${id}`;
    return this.http.sendGet(url);
  }

  public getTarefasUsuario(id: number): Observable<any> {
    const url = this.api + `/tarefas-usuario/${id}`;
    return this.http.sendGet(url);
  }

  public putTarefasConcluidas(id: number): Observable<any> {
    const url = this.api + `/tarefas-concluidas/${id}`;
    return this.http.sendPut(url);
  }

  public putTarefasReabertas(id: number): Observable<any> {
    const url = this.api + `/tarefas-reabertas/${id}`;
    return this.http.sendPut(url);
  }

  public getTarefasPendentes(): Observable<any> {
    const url = this.api + '/tarefas-pendentes';
    return this.http.sendGet(url);
  }

  public getTarefasAtrasadas(): Observable<any> {
    const url = this.api + '/tarefas-atrasadas';
    return this.http.sendGet(url);
  }

  public getFilterPrioridadeTarefas(prioridade: any): Observable<any> {
    const url = this.api + `/prioridade-tarefas/${prioridade}`;
    return this.http.sendGet(url);
  }

  public getDataTarefas(dataStr: Date | string): Observable<any> {
    const url = this.api + `/data-tarefas/${dataStr}`;
    return this.http.sendGet(url);
  }

  public getCountTarefasUsuario(id: number): Observable<any> {
    const url = this.api + `/contar-tarefas-usuario/${id}`;
    return this.http.sendGet(url);
  }
}
