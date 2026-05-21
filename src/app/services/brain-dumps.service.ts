import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { AbstractService } from './abstract.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrainDumpsService extends AbstractService<object> {

  public override api: string;

  constructor(http: RestApiService) { 
    super(http);
    this.api = `${environment.apiUrl}/despejo-cerebral`;
  }

  public getAll(): Observable<any> {
    const url = this.api + '/listar';
    return this.http.sendGet(url);
  }

  public postDespejosCerebrais(dto: any): Observable<any> {
    const url = this.api + '/cadastrar';
    return this.http.sendPost(url, dto);
  }

  public putDespejosCerebrais(id: number, dto: any): Observable<any> {
    const url = this.api + `/atualizar/${id}`;
    return this.http.sendPut(url, dto);
  }

  public deleteDespejosCerebrais(id: number): Observable<any> {
    const url = this.api + `/deletar/${id}`;
    return this.http.sendDelete(url);
  }

  public getPorId(id: number): Observable<any> {
    const url = this.api + `/buscar-por-id/${id}`;
    return this.http.sendGet(url);
  }
}
