import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { 
  applyTheme, 
  chargeThemePreferences, 
  switchActualTheme 
} from '../../utils/TrocarTema';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  taskModules = "Módulo Tarefas";
  routineAdjustments = "Ajustes de Rotina";
  routineProfile = "Ajustes do Sistema";
  mindFocusDashboard = "Dashboard Mind Focus";

  actualTheme = 'light';
  themeIcon = '';

  constructor (
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.actualTheme = chargeThemePreferences();
    this.themeIcon = applyTheme(this.actualTheme);
  }

  toggleTheme(): void {
    this.actualTheme = switchActualTheme(this.actualTheme);
    this.themeIcon = applyTheme(this.actualTheme, this.toastr, true);
  }
}
