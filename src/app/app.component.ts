import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TokenRenewalService } from './services/auth/token-renewal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mind-focus-ui';

  public loadingSpinner: boolean = false;
  codUsuarioLogado: any;

  constructor(
    private authService: AuthService,
    private tokenRenewalService: TokenRenewalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Se o usuário já está autenticado, renova o token imediatamente ao carregar a página
    if (this.authService.checarAutenticacao()) {
      this.authService.refreshToken().subscribe({
        next: () => {
          this.toastr.success('Sessão renovada com sucesso!', 'Sucesso');
          this.tokenRenewalService.startTokenRenewal();
        },
        error: (err) => {
          this.toastr.error('Erro ao renovar sessão!', 'Erro');
          this.tokenRenewalService.stopTokenRenewal();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.tokenRenewalService.stopTokenRenewal();
  }
}
