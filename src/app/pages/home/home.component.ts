import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { 
  applyTheme, 
  chargeThemePreferences, 
  switchActualTheme 
} from '../../utils/TrocarTema';
import { formatarNomeUsuario } from '../../utils/FormatarNome';
import { AppComponent } from '../../app.component';
import { Subscription, interval } from 'rxjs';
import { UsuarioLogadoStorageService } from '../../services/usuario-logado-storage.service';
import { AuthService } from '../../services/auth/auth.service';
import { TokenRenewalService } from '../../services/auth/token-renewal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  taskModules = "Módulo Tarefas";
  routineAdjustments = "Ajustes de Rotina";
  routineProfile = "Ajustes do Sistema";
  mindFocusDashboard = "Dashboard Mind Focus";
  remainingTimeToken = "Tempo Restante Sessão";
  nomeUsuarioLogado: string = '';

  // Propriedades contador token
  _remainingTimeToken: string = '00:00';
  private remainingSeconds: number = 0;
  private timerSubscription?: Subscription;

  private subscription: Subscription = new Subscription();

  actualTheme = 'light';
  themeIcon = '';

  constructor (
    private toastr: ToastrService,
    private usuarioLogadoStorage: UsuarioLogadoStorageService,
    private router: Router,
    private authService: AuthService,
    private tokenRenewalService: TokenRenewalService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.actualTheme = chargeThemePreferences();
    this.themeIcon = applyTheme(this.actualTheme);
    this.initializeTimerSession();
    this.getUsuarioLogado();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.tokenRenewalService.stopTokenRenewal();
  }

  toggleTheme(): void {
    this.actualTheme = switchActualTheme(this.actualTheme);
    this.themeIcon = applyTheme(this.actualTheme, this.toastr, true);
  }

  initializeTimerSession() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.remainingSeconds = this.usuarioLogadoStorage.getTempoRestanteTokenEmSegundos();
    this.updateFormaterTimer();

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateFormaterTimer();
      } else {
        this.expiredSession();
      }
    });
  }

  updateFormaterTimer() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    this._remainingTimeToken = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  refreshSession() {
    this.appComponent.loadingSpinner = true;

    this.authService.refreshToken().subscribe({
      next: (res) => {
        const currentUser = this.usuarioLogadoStorage.getUsuario();
        if (currentUser) {
          currentUser.token = res.accessToken ?? res.token;
          this.usuarioLogadoStorage.setUsuario(currentUser);
        }

        this.toastr.success("Sessão renovada com Sucesso!");
        this.initializeTimerSession();
        this.appComponent.loadingSpinner = false;
      },
      error: (err) => {
        this.toastr.error("Não foi possível renovar a sessão. Faça login novamente.");
        this.appComponent.loadingSpinner = false;
        this.expiredSession();
      }
    });
  }

  expiredSession() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (!this.usuarioLogadoStorage.getUsuario()) {
      return;
    }

    this.usuarioLogadoStorage.limparCache();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.toastr.warning("Sua sessão expirou por inatividade.", "Aviso");

    this.router.navigate(['/login']);

  }

  getUsuarioLogado(): void {
    const usuario = this.usuarioLogadoStorage.getUsuario();

    if (usuario) {
      const nome = usuario.nome || usuario.email?.split('@')[0] || '';
      this.nomeUsuarioLogado = formatarNomeUsuario(nome);
    }
  }
}
