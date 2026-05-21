import { RestApiService } from './rest-api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbstractService<T> {
  protected headers = new Headers();
  public api = '';

  constructor(
    public http: RestApiService
  ) { }

  public list(
    filter?: object,
    page?: number,
    url = this.api
  ): Observable<object> {
    const urlFilter =
      filter === undefined ? '?filter={}' : '?filter=' + JSON.stringify(filter);
    const pageFilter = page === undefined ? '' : '&&page=' + page;

    return this.http.sendGet(url + urlFilter + pageFilter);
  }

  public find(filter?: object): Observable<object> {
    const urlFilter =
      filter === undefined
        ? this.api
        : this.api + '?filter=' + JSON.stringify(filter);

    return this.http.sendGet(urlFilter);
  }

  public count(filter?: any): Observable<any> {
    if (!filter !== null) {
      filter.skip = 0;
      filter.limit = 0;
    }

    const urlFilter = filter !== null
      ? this.api
      : this.api + '?filter=' + JSON.stringify(filter);
    return this.http.sendGet(urlFilter);
  }

  public exclui(item: any): Observable<object> {
    return this.http.sendDelete(this.api + '/' + item);
  }

  public saveUpdate(object: any): Observable<object> {
    if (object.id === undefined) {
      return this.http.sendPost(this.api, object);
    } else {
      return this.http.sendGet(this.api + '/atualizar', object);
    }
  }

  public saveUpdateFilter(object: any, update: boolean): Observable<object> {
    if (!update) {
      return this.http.sendPost(this.api, object);
    } else {
      return this.http.sendPost(this.api, object);
    }
  }

  public update(obj: object): Promise<object> {
    return this.http
      .sendPut(this.api, obj)
      .toPromise()
      .then((res) => {
        return res as object;
      })
      .catch(this.handleError);
  }

  public delete(id: number): Observable<object> {
    return this.http.sendDelete(this.api + '/' + id);
  }

  protected handleError(error: any): Promise<any> {
    const msg = error.error;
    return Promise.reject(msg || error);
  }

  appendParams(obj: any): URLSearchParams {
    const params = new URLSearchParams();
    params.append('filter', JSON.stringify(obj));
    return params;
  }

  public getListAllOrder(order: string): Observable<object> {
    if (order === null) {
      order = 'id';
    }
    const url = this.api + '?order=' + order;
    return this.http.sendGet(url);
  }

  public getListAll(): Observable<object> {
    const url = this.api;
    return this.http.sendGet(url);
  }

  public getJSON(nomArquivo: string): Promise<any> {
    return this.http.getJson(nomArquivo);
  }
}
