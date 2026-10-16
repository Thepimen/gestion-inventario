/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Componente Standalone: DrivenPage
 * Implementa el formulario con paradigma Template-Driven Forms (FormsModule),
 * enlace bidireccional [(ngModel)], validaciones declarativas, hashing SHA-256,
 * descarga de comprobante en PDF y cuadro comparativo técnico en vivo.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '../shared/ionic.module';
import { ThemeService } from '../services/theme.service';
import { RegistroFormModel, RegistroPayload } from '../models/registro.model';
import { getTodayISODate } from '../validators/registro.validators';
import { hashPasswordSHA256 } from '../utils/crypto.util';
import { descargarComprobantePDF } from '../utils/pdf-generator.util';

@Component({
  selector: 'app-driven',
  templateUrl: './driven.page.html',
  styleUrls: ['./driven.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DrivenPage implements OnInit {
  private router = inject(Router);
  public themeService = inject(ThemeService);

  /** Modelo mutable de datos para two-way data binding [(ngModel)] */
  public formData: RegistroFormModel = {
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: '',
  };

  /** Signal para controlar el estado de envío asíncrono */
  public isSubmitting = signal<boolean>(false);

  /** Signal para controlar la visibilidad del Toast */
  public isToastOpen = signal<boolean>(false);

  /** Signal con los datos del último envío para comprobante y PDF */
  public ultimoEnvio = signal<RegistroPayload | null>(null);

  /** Signal para error de fecha futura detectada */
  public fechaFuturaError = signal<boolean>(false);

  /** Límite superior de fecha para el control HTML date (hoy) */
  public maxDateToday: string = getTodayISODate();

  ngOnInit(): void {
    this.recuperarUltimoEnvio();
  }

  /**
   * Comprueba en tiempo real si la fecha introducida es futura.
   */
  public onFechaInput(): void {
    if (!this.formData.fechaNacimiento) {
      this.fechaFuturaError.set(false);
      return;
    }

    const fechaSeleccionada = new Date(this.formData.fechaNacimiento);
    const hoyFinDelDia = new Date();
    hoyFinDelDia.setHours(23, 59, 59, 999);

    const esFutura = !isNaN(fechaSeleccionada.getTime()) && fechaSeleccionada.getTime() > hoyFinDelDia.getTime();
    this.fechaFuturaError.set(esFutura);
  }

  /**
   * Envío del formulario Template-Driven.
   */
  public async onSubmit(form: NgForm): Promise<void> {
    this.onFechaInput();

    if (form.invalid || this.fechaFuturaError()) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      // Simular latencia de red de 1000ms
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Cifrado criptográfico SHA-256 de contraseña antes de enviar a consola
      const hashedPassword = await hashPasswordSHA256(this.formData.password);

      const payload: RegistroPayload = {
        nombre: this.formData.nombre.trim(),
        email: this.formData.email.trim(),
        passwordHash: hashedPassword,
        fechaNacimiento: this.formData.fechaNacimiento,
        fechaRegistro: new Date().toLocaleString('es-ES', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }),
        tipoFormulario: 'Template-Driven',
      };

      // NUNCA mostrar contraseña en texto plano
      console.log('Payload enviado (Template-Driven - SHA-256):', payload);

      localStorage.setItem('ultimo_registro_driven', JSON.stringify(payload));
      this.ultimoEnvio.set(payload);

      // Resetear formulario manteniendo estado
      form.resetForm();
      this.formData = {
        nombre: '',
        email: '',
        password: '',
        fechaNacimiento: '',
      };
      this.fechaFuturaError.set(false);
      this.isToastOpen.set(true);
    } catch (error) {
      console.error('Error durante el envío Template-Driven:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Genera y descarga el archivo PDF del comprobante.
   */
  public descargarPDF(): void {
    const envio = this.ultimoEnvio();
    if (envio) {
      descargarComprobantePDF(envio);
    }
  }

  /**
   * Navegación por segmento entre vistas.
   */
  public onSegmentChange(event: any): void {
    const target = event.detail.value;
    if (target) {
      this.router.navigateByUrl(`/${target}`);
    }
  }

  /**
   * Carga persistida del último envío.
   */
  private recuperarUltimoEnvio(): void {
    try {
      const data = localStorage.getItem('ultimo_registro_driven');
      if (data) {
        this.ultimoEnvio.set(JSON.parse(data));
      }
    } catch (e) {
      console.warn('No se pudo recuperar el envío:', e);
    }
  }
}
