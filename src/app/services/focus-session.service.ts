import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { RestApiService } from './rest-api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FocusSessionService extends AbstractService<object> {

  public override api: string;

  constructor(http: RestApiService) { 
    super(http);
    this.api = `${environment.apiUrl}/sessao-foco`;
  }

  public getAll(): Observable<any> {
    const url = this.api + '/listar';
    return this.http.sendGet(url);
  }

  public postSessoesFoco(dto: any): Observable<any> {
    const url = this.api + '/cadastrar';
    return this.http.sendPost(url, dto);
  }

  public putSessoesFoco(id: number, dto: any): Observable<any> {
    const url = this.api + `/atualizar/${id}`;
    return this.http.sendPut(url, dto);
  }

  public deleteSessoesFoco(id: number): Observable<any> {
    const url = this.api + `/deletar/${id}`;
    return this.http.sendDelete(url);
  }

  public getPorId(id: number): Observable<any> {
    const url = this.api + `/buscar-por-id/${id}`;
    return this.http.sendGet(url);
  }

  public getSessoesFocoUsuario(id: number): Observable<any> {
    const url = this.api + `/sessoes-foco-usuario/${id}`;
    return this.http.sendGet(url);
  }

  public getDataSessoesFoco(dataStr: Date | string): Observable<any> {
    const url = this.api + `/data-sessoes-foco/${dataStr}`;
    return this.http.sendGet(url);
  }

  public getTotalMinutosUsuario(id: number): Observable<any> {
    const url = this.api + `/total-minutos-foco/${id}`;
    return this.http.sendGet(url);
  }
}
