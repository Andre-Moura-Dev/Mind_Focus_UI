import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { RestApiService } from './rest-api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService extends AbstractService<object> {

  public override api: string;

  constructor(http: RestApiService) {
    super(http);
    this.api = `${environment.apiUrl}/usuario`;
  }

  public getAll(): Observable<any> {
    const url = this.api + '/listar';
    return this.http.sendGet(url);
  }

  public postUsuarios(dto: any): Observable<any> {
    const url = this.api + '/cadastrar';
    return this.http.sendPost(url, dto);
  }

  public putUsuarios(id: number, dto: any): Observable<any> {
    const url = this.api + `/atualizar/${id}`;
    return this.http.sendPut(url, dto);
  }

  public deleteUsuarios(id: number): Observable<any> {
    const url = this.api + `/deletar/${id}`;
    return this.http.sendDelete(url);
  }

  public getUsuarioEmail(email: string): Observable<any> {
    const url = this.api + `/buscar-por-email/${email}`;
    return this.http.sendGet(url);
  }

  public getPorId(id: number): Observable<any> {
    const url = this.api + `/buscar-por-id/${id}`;
    return this.http.sendGet(url);
  }
}
