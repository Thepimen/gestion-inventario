/**
 * Práctica: Sistema de Gestión de Inventario Móvil (WMS)
 * Módulo: Desarrollo de Interfaces - 2º DAM
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Pruebas unitarias para el componente de inventario y sus validadores personalizados.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { InventarioFormComponent } from './inventario-form.component';
import {
  skuAlphanumericValidator,
  greaterThanZeroValidator,
} from '../../validators/inventario.validators';

describe('InventarioFormComponent y Validadores Personalizados', () => {
  let component: InventarioFormComponent;
  let fixture: ComponentFixture<InventarioFormComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [InventarioFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con estado INVÁLIDO al estar vacío', () => {
    expect(component.inventarioForm.valid).toBe(false);
  });

  describe('Validador skuAlphanumericValidator', () => {
    it('debe aceptar un SKU estrictamente alfanumérico de 12 caracteres', () => {
      const control = new FormControl('AB1234567890', skuAlphanumericValidator);
      expect(control.errors).toBeNull();
    });

    it('debe rechazar un SKU de menos de 12 caracteres con { invalidSku: true }', () => {
      const control = new FormControl('SKU123', skuAlphanumericValidator);
      expect(control.errors).toEqual({ invalidSku: true });
    });

    it('debe rechazar un SKU de más de 12 caracteres con { invalidSku: true }', () => {
      const control = new FormControl('SKU1234567890123', skuAlphanumericValidator);
      expect(control.errors).toEqual({ invalidSku: true });
    });

    it('debe rechazar un SKU con caracteres especiales con { invalidSku: true }', () => {
      const control = new FormControl('SKU-12345678', skuAlphanumericValidator);
      expect(control.errors).toEqual({ invalidSku: true });
    });
  });

  describe('Validador greaterThanZeroValidator', () => {
    it('debe aceptar números enteros estrictamente mayores que 0', () => {
      const control = new FormControl(10, greaterThanZeroValidator);
      expect(control.errors).toBeNull();
    });

    it('debe rechazar el valor 0 con { greaterThanZero: true }', () => {
      const control = new FormControl(0, greaterThanZeroValidator);
      expect(control.errors).toEqual({ greaterThanZero: true });
    });

    it('debe rechazar números negativos con { greaterThanZero: true }', () => {
      const control = new FormControl(-5, greaterThanZeroValidator);
      expect(control.errors).toEqual({ greaterThanZero: true });
    });
  });

  describe('Flujo de Envío onSubmit()', () => {
    it('no debe procesar el envío si el formulario es inválido', async () => {
      expect(component.inventarioForm.invalid).toBe(true);
      await component.onSubmit();
      expect(component.isSubmitting()).toBe(false);
      expect(component.itemsGuardados().length).toBe(0);
    });

    it('debe simular envío, persistir en localStorage y disparar Toast al ser válido', async () => {
      component.inventarioForm.setValue({
        sku: 'ABCD12345678',
        nombre: 'Caja de Tornillos M4',
        categoria: 'Consumibles',
        stockMinimo: 50,
      });

      expect(component.inventarioForm.valid).toBe(true);

      // Ejecutar onSubmit
      const submitPromise = component.onSubmit();
      expect(component.isSubmitting()).toBe(true);

      await submitPromise;

      expect(component.isSubmitting()).toBe(false);
      expect(component.isToastOpen()).toBe(true);

      // Verificar persistencia Offline-First en localStorage
      const stored = JSON.parse(localStorage.getItem('wms_inventario_items') || '[]');
      expect(stored.length).toBe(1);
      expect(stored[0].sku).toBe('ABCD12345678');
      expect(stored[0].nombre).toBe('Caja de Tornillos M4');
      expect(stored[0].categoria).toBe('Consumibles');
      expect(stored[0].stockMinimo).toBe(50);
    });
  });
});
