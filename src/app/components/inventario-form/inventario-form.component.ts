/**
 * Práctica: Sistema de Gestión de Inventario Móvil (WMS)
 * Módulo: Desarrollo de Interfaces - 2º DAM
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Componente Standalone: InventarioFormComponent
 * Gestiona el formulario reactivo de inserción de productos con validaciones síncronas
 * y personalizadas, control de estado reactivo mediante Signals y persistencia local Offline-First.
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
import { ThemeService } from '../../services/theme.service';
import { IonicModule } from '../../shared/ionic.module';
import { InventarioItem } from '../../models/inventario.model';
import {
  skuAlphanumericValidator,
  greaterThanZeroValidator,
} from '../../validators/inventario.validators';

@Component({
  selector: 'app-inventario-form',
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class InventarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  /** Formulario reactivo fuertemente tipado */
  public inventarioForm!: FormGroup;

  /** Signal para controlar el estado de envío asíncrono */
  public isSubmitting = signal<boolean>(false);

  /** Signal para controlar la visibilidad del <ion-toast> de confirmación */
  public isToastOpen = signal<boolean>(false);

  /** Signal reactivo para listar los productos persistidos localmente (Offline-First) */
  public itemsGuardados = signal<InventarioItem[]>([]);

  /** Clave de persistencia en almacenamiento local */
  private readonly STORAGE_KEY = 'wms_inventario_items';

  ngOnInit(): void {
    this.initForm();
    this.cargarItemsLocales();
  }

  /**
   * Inicializa el FormGroup reactivo con sus 4 controles y validadores requeridos.
   */
  private initForm(): void {
    this.inventarioForm = this.fb.group({
      // 1. SKU: Obligatorio y exactamente 12 caracteres alfanuméricos
      sku: ['', [Validators.required, skuAlphanumericValidator]],

      // 2. Nombre: Obligatorio y mínimo 3 caracteres
      nombre: ['', [Validators.required, Validators.minLength(3)]],

      // 3. Categoría: Obligatoria
      categoria: ['', [Validators.required]],

      // 4. Stock Mínimo: Obligatorio y estrictamente > 0
      stockMinimo: [
        null,
        [Validators.required, Validators.min(1), greaterThanZeroValidator],
      ],
    });
  }

  /**
   * Getter helper para acceder a los controles del formulario de forma tipada y concisa.
   */
  get f() {
    return this.inventarioForm.controls;
  }

  /**
   * Devuelve mensajes de error dinámicos y precisos según el estado activo de cada control.
   *
   * @param controlName Nombre del control en el formulario ('sku', 'nombre', 'categoria', 'stockMinimo')
   * @returns Mensaje descriptivo para el usuario o cadena vacía si es válido o no ha sido tocado.
   */
  public getErrorMessage(controlName: string): string {
    const control = this.inventarioForm.get(controlName);
    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      switch (controlName) {
        case 'sku':
          return 'El código de barras (SKU) es obligatorio.';
        case 'nombre':
          return 'El nombre del producto es obligatorio (mín. 3 caracteres).';
        case 'categoria':
          return 'Debes seleccionar una categoría de producto.';
        case 'stockMinimo':
          return 'Introduce un stock numérico válido mayor que 0.';
        default:
          return 'Este campo es obligatorio.';
      }
    }

    if (errors['invalidSku']) {
      return 'El SKU debe tener exactamente 12 caracteres alfanuméricos.';
    }

    if (errors['minlength']) {
      return 'El nombre del producto es obligatorio (mín. 3 caracteres).';
    }

    if (errors['min'] || errors['greaterThanZero']) {
      return 'Introduce un stock numérico válido mayor que 0.';
    }

    return 'Valor introducido no válido.';
  }

  /**
   * Flujo de envío del formulario reactivo con protección contra doble clic,
   * simulación asíncrona de 2000ms y persistencia local Offline-First.
   */
  public async onSubmit(): Promise<void> {
    // Si el formulario es inválido, marcamos todos los controles como tocados y abortamos
    if (this.inventarioForm.invalid) {
      this.inventarioForm.markAllAsTouched();
      return;
    }

    // 1. Activar estado de envío y deshabilitar formulario para evitar dobles envíos en almacén
    this.isSubmitting.set(true);
    this.inventarioForm.disable();

    try {
      // 2. Simular latencia de red / persistencia asíncrona de 2000ms
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const rawValue = this.inventarioForm.getRawValue();
      const nuevoProducto: InventarioItem = {
        sku: String(rawValue.sku).trim().toUpperCase(),
        nombre: String(rawValue.nombre).trim(),
        categoria: rawValue.categoria,
        stockMinimo: Number(rawValue.stockMinimo),
        fechaRegistro: new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };

      // Guardar en localStorage para arquitectura Offline-First
      const itemsActuales = [...this.itemsGuardados()];
      itemsActuales.unshift(nuevoProducto);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itemsActuales));
      this.itemsGuardados.set(itemsActuales);

      // 3. Reactivar formulario, resetear campos y mostrar notificación Toast
      this.inventarioForm.enable();
      this.inventarioForm.reset();
      this.isToastOpen.set(true);
    } catch (error) {
      console.error('Error durante la persistencia del inventario:', error);
      this.inventarioForm.enable();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Carga los productos previamente almacenados en localStorage al iniciar la aplicación.
   */
  public cargarItemsLocales(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.itemsGuardados.set(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error al recuperar inventario de localStorage:', error);
    }
  }

  /**
   * Limpia los productos guardados en localStorage (opcional para pruebas de operario).
   */
  public limpiarHistorial(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.itemsGuardados.set([]);
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
}
