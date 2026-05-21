import { Injectable, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { UsuarioLogadoStorageService } from '../usuario-logado-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenRenewalService implements OnDestroy {
  private renewalSubscription?: Subscription;
  private readonly RENEWAL_TIME_BEFORE_EXPIRY = 5 * 60; 
  private readonly CHECK_INTERVAL = 60 * 1000;

  constructor(
    private authService: AuthService,
    private usuarioLogadoStorage: UsuarioLogadoStorageService
  ) {}

  
  public startTokenRenewal(): void {
    this.stopTokenRenewal();

    this.renewalSubscription = interval(this.CHECK_INTERVAL).subscribe(() => {
      this.checkAndRenewToken();
    });

    this.checkAndRenewToken();
  }

  public stopTokenRenewal(): void {
    if (this.renewalSubscription) {
      this.renewalSubscription.unsubscribe();
    }
  }

  private checkAndRenewToken(): void {
    const tempoRestante = this.usuarioLogadoStorage.getTempoRestanteTokenEmSegundos();

    if (tempoRestante > 0 && tempoRestante <= this.RENEWAL_TIME_BEFORE_EXPIRY) {
      console.log(`Token expira em ${tempoRestante}s. Renovando...`);
      this.renewToken();
    }
  }

  private renewToken(): void {
    this.authService.refreshToken().subscribe({
      next: () => {
        console.log('Token renovado com sucesso');
      },
      error: (err) => {
        console.error('Erro ao renovar token automaticamente:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTokenRenewal();
  }
}
