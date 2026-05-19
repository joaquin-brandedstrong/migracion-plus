/**
 * Minimal, dependency-free PDF generator.
 *
 * Produces a single A4 page of text lines using the built-in Helvetica font
 * with WinAnsi encoding (covers Spanish accents). It is deliberately tiny —
 * enough for demo certificates and book-placeholder downloads while there is
 * no real file storage wired. Not a general-purpose PDF library.
 */

export interface PdfLine {
  text: string;
  /** Font size in pt (default 12). */
  size?: number;
  /** Extra vertical gap (pt) added before this line. */
  gap?: number;
}

function escapeText(s: string): string {
  let out = '';
  for (const ch of s) {
    const code = ch.codePointAt(0) ?? 63;
    // WinAnsi is single-byte; anything outside it becomes '?'.
    out += code > 0xff ? '?' : ch;
  }
  return out
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export function createTextPdfBlob(lines: PdfLine[]): Blob {
  const pageWidth = 595;
  const pageHeight = 842;
  const left = 64;
  let y = pageHeight - 90;

  let content = '';
  for (const ln of lines) {
    const size = ln.size ?? 12;
    y -= (ln.gap ?? 0) + size * 1.6;
    content += `BT /F1 ${size} Tf 1 0 0 1 ${left} ${y.toFixed(
      2,
    )} Tm (${escapeText(ln.text)}) Tj ET\n`;
  }

  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objects[3] =
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
    `/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`;
  objects[4] =
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[5] = `<< /Length ${content.length} >>\nstream\n${content}endstream`;

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let i = 1; i <= 5; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = pdf.length;
  pdf += 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  // Every char is <= 0xFF (escapeText guarantees it), so length == byte length
  // and a direct Latin-1 byte mapping is correct.
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: 'application/pdf' });
}
