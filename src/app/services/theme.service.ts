/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Servicio de control de tema (Modo Claro / Modo Oscuro) con persistencia en localStorage
 * y reactividad mediante Angular Signals.
 */

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme_preference';

  /** Signal que indica si el modo oscuro está activo */
  public isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  /**
   * Inicializa el tema leyendo la preferencia persistida o la del sistema operativo.
   */
  private initTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.setTheme(saved === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark);
    }
  }

  /**
   * Alterna entre modo claro y modo oscuro.
   */
  public toggleTheme(): void {
    this.setTheme(!this.isDarkMode());
  }

  /**
   * Aplica las clases CSS globales en el DOM y persiste la selección.
   */
  public setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');

    if (isDark) {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme', 'ion-palette-dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme', 'ion-palette-dark');
    }
  }
}
