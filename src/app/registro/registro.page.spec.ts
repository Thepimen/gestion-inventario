/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Pruebas unitarias para RegistroPage, validador de fecha no futura y hashing SHA-256.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RegistroPage } from './registro.page';
import { fechaNoFuturaValidator } from '../validators/registro.validators';
import { hashPasswordSHA256 } from '../utils/crypto.util';

describe('RegistroPage y Validadores', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RegistroPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe instanciar el componente RegistroPage correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con el formulario reactivo en estado INVÁLIDO', () => {
    expect(component.registroForm.valid).toBe(false);
  });

  describe('Validador fechaNoFuturaValidator', () => {
    it('debe aceptar una fecha pasada o del día de hoy', () => {
      const controlPasado = new FormControl('2000-01-01', fechaNoFuturaValidator);
      expect(controlPasado.errors).toBeNull();

      const hoy = new Date().toISOString().split('T')[0];
      const controlHoy = new FormControl(hoy, fechaNoFuturaValidator);
      expect(controlHoy.errors).toBeNull();
    });

    it('debe rechazar una fecha del futuro con { fechaFutura: true }', () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 2);
      const fechaFuturaStr = manana.toISOString().split('T')[0];

      const controlFuturo = new FormControl(fechaFuturaStr, fechaNoFuturaValidator);
      expect(controlFuturo.errors).toEqual({ fechaFutura: true });
    });
  });

  describe('Cifrado Criptográfico SHA-256', () => {
    it('debe transformar la contraseña en un hash hexadecimal de 64 caracteres', async () => {
      const passwordPlana = 'Secret123';
      const hash = await hashPasswordSHA256(passwordPlana);

      expect(hash).toBeTruthy();
      expect(hash.length).toBe(64);
      expect(hash).not.toContain(passwordPlana);
    });
  });

  describe('Validación de Contraseña (regex min 8, letra y número)', () => {
    it('debe rechazar contraseñas de menos de 8 caracteres o solo letras', () => {
      const controlSoloLetras = component.registroForm.get('password');
      controlSoloLetras?.setValue('abcdefgh');
      expect(controlSoloLetras?.valid).toBe(false);

      controlSoloLetras?.setValue('abc12');
      expect(controlSoloLetras?.valid).toBe(false);

      controlSoloLetras?.setValue('Password123');
      expect(controlSoloLetras?.valid).toBe(true);
    });
  });
});
