import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import {
  applyTheme, 
  chargeThemePreferences, 
  switchActualTheme 
} from '../../../utils/TrocarTema';
import { formatarNomeUsuario } from '../../../utils/FormatarNome';
import { interval, Subscription } from 'rxjs';
import { UserServiceService } from '../../../services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { AuthService } from '../../../services/auth/auth.service';
import { TokenRenewalService } from '../../../services/auth/token-renewal.service';
import { UsuarioLogadoStorageService } from '../../../services/usuario-logado-storage.service';

@Component({
  selector: 'app-cadastrar-usuario-form',
  templateUrl: './cadastrar-usuario-form.component.html',
  styleUrls: ['./cadastrar-usuario-form.component.scss']
})
export class CadastrarUsuarioFormComponent implements OnInit, OnDestroy {

  actualTheme = 'light';
  themeIcon = '';
  public showPassword: boolean = false;
  public showEyeIcon: boolean = false;
  remaninigTimeToken = "Tempo Restante Sessão";
  nomeUsuarioLogado: string = '';

  _remainingTimeToken: string = '00:00';
  private remainingSeconds: number = 0;
  private timerSubscription?: Subscription;

  private subscription: Subscription = new Subscription();

  formCadastrarUsuarios = new FormGroup({
    id: new FormControl(0),
    nome: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private toastr: ToastrService,
    private userService: UserServiceService,
    private authService: AuthService,
    private tokenRenawalService: TokenRenewalService,
    private usuarioLogadoStorage: UsuarioLogadoStorageService,
  ) {}
  
  ngOnInit(): void {
    this.actualTheme = chargeThemePreferences();
    this.themeIcon = applyTheme(this.actualTheme);
    this.initializerTimerSession();
    this.getUsuarioLogado();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.tokenRenawalService.stopTokenRenewal();
  }

  validarCamposFormulario(): boolean {
    const nome = this.formCadastrarUsuarios.get('nome');
    const email = this.formCadastrarUsuarios.get('email');
    const senha = this.formCadastrarUsuarios.get(
      'senha'
    );
    return (
      !!nome?.valid &&
      !!email?.valid &&
      !!senha?.valid
    );
  }

  postCadastrarUsuario() {
    if (this.formCadastrarUsuarios.valid) {
      
      const formValues = this.formCadastrarUsuarios.value;

      const usuarioDTO: Usuario = {
        idUsuario: 0,
        nome: formValues.nome || '',
        email: formValues.email || '',
        senha: formValues.senha || ''
      };

      this.appComponent.loadingSpinner = true;

      this.userService.postUsuarios(usuarioDTO).subscribe({
        next: (res) => {
          this.appComponent.loadingSpinner = false;
          this.toastr.success('Usuário cadastrado com sucesso!');

          setTimeout(() => {
            this.voltar();
          }, 2000);
        },
        error: (e) => {
          this.appComponent.loadingSpinner = false;
          this.toastr.error("Erro ao adicionar usuário!");
          console.error(e);
        }
      })

    } else {
      this.toastr.warning("Por favor, preencha todos os campos obrigatórios corretamente.");
    }
  }

  voltar() {
    this.router.navigate(['/usuarios']);
  }

  toggleTheme(): void {
    this.actualTheme = switchActualTheme(this.actualTheme);
    this.themeIcon = applyTheme(this.actualTheme, this.toastr, true);
  }

  mostrarSenha() {
    this.showPassword = !this.showPassword;
    this.showEyeIcon = !this.showEyeIcon;
  }

  // Funções RefreshToken
  initializerTimerSession() {
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
        this.initializerTimerSession();
        this.appComponent.loadingSpinner = false;
      },
      error: (err) => {
        this.toastr.error("Não foi possível renovar a sessão. Faça login novamente!");
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
