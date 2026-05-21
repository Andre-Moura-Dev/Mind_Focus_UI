import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../services/auth/auth.service';
import { TokenRenewalService } from '../../services/auth/token-renewal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public showPassword: boolean = false;
  public showEyeIcon: boolean = false;

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private tokenRenewalService: TokenRenewalService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    if (this.authService.checarAutenticacao()) {
      this.router.navigate(['/home']);
    }
  }

  fazerLogin() {
    if (this.formLogin.valid) {
      const { email, senha } = this.formLogin.value;

      if (email && senha) {
        this.appComponent.loadingSpinner = true;

        this.authService.login({ email, senha }).subscribe({
          next: (res) => {
            this.appComponent.loadingSpinner = false;
            this.tokenRenewalService.startTokenRenewal();
            this.toastr.success("Login realizado com sucesso!");
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.appComponent.loadingSpinner = false;

            if (err.status === 401 || err.status === 403) {
              this.toastr.error("E-mail ou senha incorretos!");
            } else if (err.status === 0) {
              this.toastr.error("Não foi possível conectar ao servidor.");
            } else {
              this.toastr.error("Ocorreu um erro inesperado ao realizar o login.");
            }
          }
        });
      } else {
        this.toastr.error("Credenciais Inválidas!");
      }

    } else {
      this.toastr.warning("Por favor, Preencha todos os campos corretamente!");
    }
  }

  mostrarSenha() {
    this.showPassword = !this.showPassword;
    this.showEyeIcon = !this.showEyeIcon;
  }
}