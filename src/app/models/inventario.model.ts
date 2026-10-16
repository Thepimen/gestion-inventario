/**
 * Práctica: Sistema de Gestión de Inventario Móvil (WMS)
 * Módulo: Desarrollo de Interfaces - 2º DAM
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Definiciones de tipos e interfaces para los items de inventario y estado del formulario.
 */

export type CategoriaProducto = 'Electrónica' | 'Herramientas' | 'Consumibles';

export interface InventarioItem {
  sku: string;
  nombre: string;
  categoria: CategoriaProducto | string;
  stockMinimo: number;
  fechaRegistro?: string;
}
