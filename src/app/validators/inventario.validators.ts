/**
 * Práctica: Sistema de Gestión de Inventario Móvil (WMS)
 * Módulo: Desarrollo de Interfaces - 2º DAM
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Custom Validators para el formulario reactivo de inventario:
 * 1. skuAlphanumericValidator: Exactamente 12 caracteres alfanuméricos (/^[a-zA-Z0-9]{12}$/)
 * 2. greaterThanZeroValidator: Valor numérico estrictamente mayor que 0
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para código SKU:
 * Evalúa mediante expresión regular que la cadena contenga exactamente 12 caracteres alfanuméricos
 * (letras mayúsculas/minúsculas y dígitos del 0 al 9, sin espacios ni caracteres especiales).
 *
 * @returns ValidationErrors con `{ invalidSku: true }` si no cumple la regla, o `null` si es válido.
 */
export const skuAlphanumericValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  // Si no hay valor o está vacío, dejamos que Validators.required maneje la obligatoriedad
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const strValue = String(value).trim();
  const skuRegex = /^[a-zA-Z0-9]{12}$/;

  return skuRegex.test(strValue) ? null : { invalidSku: true };
};

/**
 * Validador personalizado para Stock Mínimo:
 * Garantiza que el valor introducido sea estrictamente un número mayor que 0 (> 0).
 * Rechaza el valor cero (0), números negativos, NaN o valores no numéricos.
 *
 * @returns ValidationErrors con `{ greaterThanZero: true }` si el valor es <= 0 o inválido, o `null`.
 */
export const greaterThanZeroValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  // Si está vacío, Validators.required gestiona el error
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numValue = Number(value);

  if (isNaN(numValue) || numValue <= 0) {
    return { greaterThanZero: true };
  }

  return null;
};
