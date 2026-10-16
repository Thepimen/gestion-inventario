/**
 * Práctica: FormularioReactivo (Desarrollo de Interfaces - 2º DAM)
 * Instituto Nebrija de Formación Profesional
 * Autor: Luis Lázaro Pimentel
 *
 * Utilidad pura de generación de PDF (PDF-1.4 nativo).
 * Crea y descarga un documento binario PDF válido de forma 100% autónoma
 * sin dependencias externas, asegurando descarga inmediata sin bloqueos.
 */

import { RegistroPayload } from '../models/registro.model';

/**
 * Escapa caracteres especiales de cadenas de texto para literales de texto PDF.
 */
function escapePdfText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes diacríticas para compatibilidad ASCII estándar en PDF
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Genera un archivo PDF 1.4 válido con maquetación tipográfica institucional y lo descarga en el navegador.
 */
export function descargarComprobantePDF(datos: RegistroPayload): void {
  const nombre = escapePdfText(datos.nombre);
  const email = escapePdfText(datos.email);
  const fechaNac = escapePdfText(datos.fechaNacimiento);
  const fechaReg = escapePdfText(datos.fechaRegistro);
  const tipoForm = escapePdfText(datos.tipoFormulario);
  const hashCorto = escapePdfText(`${datos.passwordHash.substring(0, 36)}... [VERIFICADO SHA-256]`);

  // Construcción del flujo gráfico y tipográfico en PostScript/PDF syntax
  const streamContent = `
q
% Cabecera Institucional Terracota (#C2410C)
0.76 0.25 0.05 rg
0 720 612 72 re
f

% Título Cabecera
BT
/F1 16 Tf
1 1 1 rg
40 755 Td
(COMPROBANTE OFICIAL DE REGISTRO) Tj
ET

% Metadatos Institucionales
BT
/F1 9 Tf
0.95 0.95 0.95 rg
40 735 Td
(Modulo: Desarrollo de Interfaces - 2 DAM  |  Instituto Nebrija de Formacion Profesional) Tj
ET

% Autor y Paradigma
BT
/F1 10 Tf
0.2 0.2 0.2 rg
40 680 Td
(Autor / Desarrollador: Luis Lazaro Pimentel) Tj
0 -18 Td
(Paradigma Evaluado: ${tipoForm}) Tj
ET

% Marco de Contenedor de Datos
0.9 0.88 0.85 RG
1 w
35 440 542 210 re
S

% Fondo suave del contenedor
0.97 0.96 0.94 rg
36 441 540 208 re
f

% Título del Contenedor
BT
/F1 12 Tf
0.76 0.25 0.05 rg
55 625 Td
(DATOS VALIDADOS Y REGISTRADOS EN SESION) Tj
ET

% Lista de Campos
BT
/F1 10 Tf
0.1 0.1 0.1 rg
55 595 Td
(Nombre Completo:) Tj
0 -24 Td
(Correo Electronico:) Tj
0 -24 Td
(Fecha de Nacimiento:) Tj
0 -24 Td
(Fecha / Hora de Envio:) Tj
0 -24 Td
(Hash Contrasena [SHA-256]:) Tj
ET

BT
/F1 10 Tf
0.15 0.15 0.15 rg
200 595 Td
(${nombre}) Tj
0 -24 Td
(${email}) Tj
0 -24 Td
(${fechaNac}) Tj
0 -24 Td
(${fechaReg}) Tj
ET

% Hash Monospace
BT
/F2 8.5 Tf
0.76 0.25 0.05 rg
200 499 Td
(${hashCorto}) Tj
ET

% Nota de Seguridad
BT
/F1 8.5 Tf
0.45 0.45 0.45 rg
40 390 Td
(Aviso de Seguridad: La contrasena original nunca se almaceno ni se envio en texto plano.) Tj
0 -14 Td
(Se genero un hash criptografico irreversible SHA-256 conforme a buenas practicas OWASP.) Tj
0 -20 Td
(Documento generado automaticamente por FormularioReactivo - DAM2 Nebrija.) Tj
ET

Q
`.trim();

  const streamLength = streamContent.length;

  const pdfDocument = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj

2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj

3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /Contents 6 0 R
>>
endobj

4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj

5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Courier-Bold
>>
endobj

6 0 obj
<<
  /Length ${streamLength}
>>
stream
${streamContent}
endstream
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000346 00000 n 
0000000424 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
${510 + streamLength}
%%EOF`;

  // Descarga directa mediante Blob nativo en el navegador
  const blob = new Blob([pdfDocument], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprobante-registro-${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
