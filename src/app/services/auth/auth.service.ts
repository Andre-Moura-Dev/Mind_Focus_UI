import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RestApiService } from '../rest-api.service';
import { UsuarioLogadoStorageService } from '../usuario-logado-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly authUrl = `${environment.apiUrl}/auth`;

  private autenticadoSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  private autenticado$ = this.autenticadoSubject.asObservable();

  constructor(
    private restApi: RestApiService,
    private usuarioLogadoStorage: UsuarioLogadoStorageService
  ) { }

  public login(credentials: { email: string, senha?: string }): Observable<any> {
    return this.restApi.postWithoutToken(`${this.authUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.accessToken && res.refreshToken) {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);

          const emailPrefix = credentials.email.split('@')[0];
          this.usuarioLogadoStorage.setUsuario({
            nome: res.nome || emailPrefix,
            email: credentials.email,
            token: res.accessToken
          });

          this.setAutenticado(true);
        }
      })
    );
  }

  public refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return throwError(() => new Error('Refresh token não encontrado. Faça login novamente.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer_${refreshToken}`
    });

    return this.restApi.sendGetWithCustomHeaders(`${this.authUrl}/refresh-token`, headers).pipe(
      tap((res: any) => {
        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken);

          const usuarioAtual = this.usuarioLogadoStorage.getUsuario();
          if (usuarioAtual) {
            usuarioAtual.token = res.accessToken;
            this.usuarioLogadoStorage.setUsuario(usuarioAtual);
          }
        }
      })
    );
  }

  public setAutenticado(value: boolean): void {
    this.autenticadoSubject.next(value);
  }

  public checarAutenticacao(): boolean {
    const possuiToken = !!localStorage.getItem('token');
    this.autenticadoSubject.next(possuiToken);
    return possuiToken;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.usuarioLogadoStorage.limparCache();
    this.setAutenticado(false);
  }

}
