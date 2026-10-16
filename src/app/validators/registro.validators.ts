/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Custom Validators para el formulario de registro:
 * - fechaNoFuturaValidator: Comprueba que la fecha de nacimiento no sea superior a hoy.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado que comprueba que la fecha seleccionada NO sea superior al día de hoy.
 * Se normaliza la fecha límite a las 23:59:59.999 del día actual para permitir seleccionar el día de hoy
 * sin problemas de zona horaria o segundos transcurridos.
 *
 * @returns `{ fechaFutura: true }` si la fecha es superior a hoy, o `null` si es válida.
 */
export const fechaNoFuturaValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null; // Validators.required gestiona el campo vacío
  }

  // Parsear la fecha del control
  const fechaSeleccionada = new Date(value);

  if (isNaN(fechaSeleccionada.getTime())) {
    return { fechaInvalida: true };
  }

  // Normalizar hoy a las 23:59:59.999
  const hoyFinDelDia = new Date();
  hoyFinDelDia.setHours(23, 59, 59, 999);

  if (fechaSeleccionada.getTime() > hoyFinDelDia.getTime()) {
    return { fechaFutura: true };
  }

  return null;
};

/**
 * Función utilitaria para obtener la fecha de hoy en formato YYYY-MM-DD
 * para vincular al atributo [max] del input HTML/ion-input.
 */
export function getTodayISODate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
