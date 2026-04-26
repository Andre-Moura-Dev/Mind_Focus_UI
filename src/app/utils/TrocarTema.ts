import { ToastrService } from "ngx-toastr";

export function chargeThemePreferences(): string {
    return localStorage.getItem('tema') || 'light';
}

export function switchActualTheme(theme: string): string {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    localStorage.setItem('tema', newTheme);
    return newTheme;
}

export function applyTheme(theme: string, toastr?: ToastrService, showToastr: boolean = false): string {

    if (theme === 'light') {
        document.body.classList.remove('dark-mode');

        if (showToastr && toastr) {
            toastr.info("Tema Claro Escolhido ☀️");
        }

        return 'pi pi-sun';
    } else {
        document.body.classList.add('dark-mode');

        if (showToastr && toastr) {
            toastr.info("Tema Escuro Escolhido 🌙");
        }

        return 'pi pi-moon';
    }
}