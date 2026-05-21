import { Injectable } from '@angular/core';
import { 
  setEncryptedItem, 
  getDecryptedItem, 
  removeItem 
} from '../utils/crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLogadoStorageService {

  private readonly STORAGE_KEY = 'usuarioLogado';

  constructor() { }

  public setUsuario(usuario: any): void {
    if (usuario) {
      setEncryptedItem(this.STORAGE_KEY, usuario);
    }
  }

  public getUsuario(): any | null {
    return getDecryptedItem<any>(this.STORAGE_KEY);
  }

  public limparCache(): void {
    removeItem(this.STORAGE_KEY);
  }

  public getToken(): string | null {
    const usuario = this.getUsuario();
    return usuario ? usuario.token : null;
  }

  public getTempoRestanteTokenEmSegundos(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecodificado = JSON.parse(atob(payloadBase64));

      if (!payloadDecodificado.exp) {
        console.warn("Aviso: Campo 'exp' não encontrado no JWT.");
        return 900; 
      }

      const tempoExpiracaoSegundos = payloadDecodificado.exp;
      
      const tempoAtualSegundos = Math.floor(Date.now() / 1000);

      const segundosRestantes = tempoExpiracaoSegundos - tempoAtualSegundos;

      if (segundosRestantes > 0) {
        return segundosRestantes;
      }
      return 900;

    } catch (error) {
      console.error("Erro ao decodificar tempo do token JWT:", error);
      return 0;
    }
  }
}
