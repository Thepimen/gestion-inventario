/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Modelos de datos para el Formulario de Registro (Reactive y Template-Driven).
 */

export interface RegistroFormModel {
  nombre: string;
  email: string;
  password: string;
  fechaNacimiento: string;
}

export interface RegistroPayload {
  nombre: string;
  email: string;
  passwordHash: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  tipoFormulario: 'Reactivo (Model-Driven)' | 'Template-Driven';
}
