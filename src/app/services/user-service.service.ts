import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(http: HttpClientModule) { 
    
  }

  public getListarUsuario() {

  }

  public postCadastrarUsuario(dto: any) {

  }

  public putAtualizarUsuario(id: any) {

  }

  public deleteUsuario(id: any) {

  }

  public buscarUsuarioEmail(email: string) {

  }

  public buscarUsuarioId(id: number) {

  }
}
