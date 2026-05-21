import { Injectable } from '@angular/core';
import { decryptItem, encryptItem } from '../utils/crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {

  private readonly STORAGES_KEY = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    THEME: 'user_theme'
  };

  constructor() {}

  setToken(token: string): void {

    const encrypted = encryptItem(token);

    sessionStorage.setItem(
      this.STORAGES_KEY.TOKEN,
      encrypted
    );
  }

  getToken(): string | null {

    const encrypted = sessionStorage.getItem(
      this.STORAGES_KEY.TOKEN
    );

    if (!encrypted) {
      return null;
    }

    return decryptItem<string>(
      encrypted
    );
  }

  removeToken(): void {

    sessionStorage.removeItem(
      this.STORAGES_KEY.TOKEN
    );
  }

  refreshToken(refreshToken: string): void {
    
    const encrypted = encryptItem(refreshToken);

    localStorage.setItem(
      this.STORAGES_KEY.REFRESH_TOKEN,
      encrypted
    );
  }

  getRefreshToken(): string | null {
    
    const encrypted = localStorage.getItem(
      this.STORAGES_KEY.REFRESH_TOKEN
    );

    if (!encrypted) {
      return null;
    }

    return decryptItem<string>(
      encrypted
    );
  }

  removeRefreshToken(): void {

    localStorage.removeItem(
      this.STORAGES_KEY.REFRESH_TOKEN
    );
  }

  setTheme(theme: 'dark' | 'light'): void {

    const encrypted = encryptItem(theme);

    localStorage.setItem(
      this.STORAGES_KEY.THEME,
      encrypted
    );
  }

  getTheme(): 'dark' | 'light' | null {

    const encrypted = localStorage.getItem(
      this.STORAGES_KEY.THEME
    );

    if (!encrypted) {
      return null;
    }

    return decryptItem<'dark' | 'light'>(encrypted);
  }

  removeTheme(): void {
    
    localStorage.removeItem(
      this.STORAGES_KEY.THEME
    );
  }

  clearAll(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeTheme();
  }
}
