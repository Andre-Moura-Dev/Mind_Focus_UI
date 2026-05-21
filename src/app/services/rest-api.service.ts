import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  protected headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    protected http: HttpClient
  ) { }

  public createAuthorizationHeader(token: any): HttpHeaders {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      });

    return headers;
  }

  public uploadAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + token,
      });
    return headers;
  }

  public sendPost<O>(url: string, obj?: object): Observable<any> {
    const token = localStorage.getItem('token');
    const headersReq = this.createAuthorizationHeader(token);
    return this.http.post(url, JSON.stringify(obj), { headers: headersReq });
  }

  public sendPut(url: string, obj?: object): Observable<any> {
    const token = localStorage.getItem('token');
    const headersReq = this.createAuthorizationHeader(token);
    return this.http.put(url, JSON.stringify(obj), { headers: headersReq });
  }

  public sendDelete<O>(url: string, parametter?: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headersReq = this.createAuthorizationHeader(token);
    return this.http.delete(url, { headers: headersReq, params: parametter });
  }

  public sendGet(url: string, parametter?: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headersReq = this.createAuthorizationHeader(token);
    return this.http.get(url, { headers: headersReq, params: parametter });
  }

  public sendGetWithCustomHeaders(url: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(url, { headers: headers });
  }

  public sendPostWithCustomHeaders(url: string, body: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(url, body, { headers: headers });
  }

  public sendGetResponse(url: string, token: string = '', searchParametter?: URLSearchParams): Observable<object> {
    const headersReq = this.createAuthorizationHeader(token);
    const parametterQuery: string = (searchParametter != null) ? '?' + searchParametter.toString(): '';
    return this.http.get(url + parametterQuery, { headers: headersReq, observe: 'response' });
  }

  getJson(arquivoJson: string): Promise<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(arquivoJson)
      .toPromise()
      .then(res => <any>res);
  }

  public login(url: string, username: any, password: any): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(url, 
      body.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  public refreshToken(url: string): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.get(url, {
      headers: new HttpHeaders(
        { 'Authorization': 'Bearer ' + refreshToken, }
      ).set('Content-Type', 'application/json',)
    });
  }

  public getWithoutToken(url: any): Observable<any> {
    return this.http.get(url);
  }

  public postWithoutToken(url: any, dto: any): Observable<any> {
    return this.http.post(url, JSON.stringify(dto), { headers: { 'Content-Type': 'application/json' } });
  }

  public putWithoutToken(url: any, dto: any): Observable<any> {
    return this.http.put(url, JSON.stringify(dto), { headers: { 'Content-Type': 'application/json' } });
  }

  public upload(url: string, files: any): Observable<any> {
    const headersReq = this.uploadAuthorizationHeader();
    return this.http.put(url, files, { headers: headersReq });
  }
}
