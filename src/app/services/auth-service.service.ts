import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private isLoggedInMock = false;
  private currentUserMock = {
    id: 1, nome: 'André Oliveira', email: 'andreteste@email.com'
  }

  constructor() { }

  loginMock(): void {
    this.isLoggedInMock = true;
    console.log("Teste Login!");
  }

  logoutMock(): void {
    this.isLoggedInMock = false;
    console.log('Teste Logout!');
  }

  isAuthenticated(): boolean {
    return this.isLoggedInMock;
  }

  getCurrentUser() {
    return this.currentUserMock;
  }
}
