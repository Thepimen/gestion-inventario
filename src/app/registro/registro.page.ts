/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Componente Standalone: RegistroPage
 * Implementa el formulario reactivo de registro con tipado estricto,
 * validadores síncronos y personalizados (fechaNoFuturaValidator),
 * hashing criptográfico de contraseña SHA-256 y exportación en PDF.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '../shared/ionic.module';
import { ThemeService } from '../services/theme.service';
import { RegistroPayload } from '../models/registro.model';
import {
  fechaNoFuturaValidator,
  getTodayISODate,
} from '../validators/registro.validators';
import { hashPasswordSHA256 } from '../utils/crypto.util';
import { descargarComprobantePDF } from '../utils/pdf-generator.util';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class RegistroPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  /** Formulario reactivo de registro */
  public registroForm!: FormGroup;

  /** Signal para controlar el envío asíncrono y bloqueo de interfaz */
  public isSubmitting = signal<boolean>(false);

  /** Signal para controlar la visibilidad del Toast de éxito */
  public isToastOpen = signal<boolean>(false);

  /** Signal que almacena el último envío exitoso para visualización y descarga en PDF */
  public ultimoEnvio = signal<RegistroPayload | null>(null);

  /** Límite superior de fecha para el control HTML date (hoy) */
  public maxDateToday: string = getTodayISODate();

  ngOnInit(): void {
    this.initForm();
    this.recuperarUltimoEnvio();
  }

  /**
   * Inicializa el FormGroup con sus 4 controles y sus validaciones estrictas.
   */
  private initForm(): void {
    this.registroForm = this.fb.group({
      // 1. Nombre: Obligatorio, mínimo 3 caracteres
      nombre: ['', [Validators.required, Validators.minLength(3)]],

      // 2. Email: Obligatorio, formato de correo válido
      email: ['', [Validators.required, Validators.email]],

      // 3. Password: Mínimo 8 caracteres, al menos una letra y un número
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ],
      ],

      // 4. Fecha de Nacimiento: Obligatoria y custom validator fecha no futura
      fechaNacimiento: ['', [Validators.required, fechaNoFuturaValidator]],
    });
  }

  /**
   * Getter helper para acceso directo a los controles del formulario.
   */
  get f() {
    return this.registroForm.controls;
  }

  /**
   * Genera mensajes de error contextuales y precisos según el control evaluado.
   */
  public getErrorMessage(controlName: string): string {
    const control = this.registroForm.get(controlName);
    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      switch (controlName) {
        case 'nombre':
          return 'El nombre del usuario es obligatorio.';
        case 'email':
          return 'El correo electrónico es obligatorio.';
        case 'password':
          return 'La contraseña es obligatoria.';
        case 'fechaNacimiento':
          return 'La fecha de nacimiento es obligatoria.';
        default:
          return 'Este campo es obligatorio.';
      }
    }

    if (errors['minlength']) {
      const min = errors['minlength'].requiredLength;
      return `El nombre debe tener al menos ${min} caracteres.`;
    }

    if (errors['email']) {
      return 'Introduce un formato de correo electrónico válido (ej. usuario@dominio.com).';
    }

    if (errors['pattern'] && controlName === 'password') {
      return 'Debe tener mín. 8 caracteres, incluyendo al menos una letra y un número.';
    }

    if (errors['fechaFutura']) {
      return 'La fecha de nacimiento no puede ser superior a hoy.';
    }

    if (errors['fechaInvalida']) {
      return 'Introduce una fecha válida.';
    }

    return 'Valor introducido no válido.';
  }

  /**
   * Flujo de envío con cifrado criptográfico SHA-256 de contraseña en consola.
   */
  public async onSubmit(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.registroForm.disable();

    try {
      // Simular latencia de validación / procesamiento asíncrono
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const raw = this.registroForm.getRawValue();

      // Cifrado SHA-256 de contraseña antes de enviar a consola o memoria
      const hashedPassword = await hashPasswordSHA256(raw.password);

      const payload: RegistroPayload = {
        nombre: raw.nombre.trim(),
        email: raw.email.trim(),
        passwordHash: hashedPassword,
        fechaNacimiento: raw.fechaNacimiento,
        fechaRegistro: new Date().toLocaleString('es-ES', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }),
        tipoFormulario: 'Reactivo (Model-Driven)',
      };

      // NUNCA mostrar la contraseña en texto plano en console.log
      console.log('Payload enviado (Contraseña cifrada con SHA-256):', payload);

      // Persistir último envío
      localStorage.setItem('ultimo_registro_payload', JSON.stringify(payload));
      this.ultimoEnvio.set(payload);

      // Resetear formulario y habilitar
      this.registroForm.enable();
      this.registroForm.reset();
      this.isToastOpen.set(true);
    } catch (error) {
      console.error('Error durante el envío del formulario:', error);
      this.registroForm.enable();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Descarga el archivo PDF comprobante con los datos del último envío.
   */
  public descargarPDF(): void {
    const envio = this.ultimoEnvio();
    if (envio) {
      descargarComprobantePDF(envio);
    }
  }

  /**
   * Gestiona el cambio de segmento para navegación entre las 3 vistas.
   */
  public onSegmentChange(event: any): void {
    const target = event.detail.value;
    if (target) {
      this.router.navigateByUrl(`/${target}`);
    }
  }

  /**
   * Carga desde localStorage el último envío registrado previamente si existe.
   */
  private recuperarUltimoEnvio(): void {
    try {
      const data = localStorage.getItem('ultimo_registro_payload');
      if (data) {
        this.ultimoEnvio.set(JSON.parse(data));
      }
    } catch (e) {
      console.warn('No se pudo recuperar el último envío:', e);
    }
  }
}
