'use client';

import { useState } from 'react';
import { Button } from '@migracionplus/ui';
import { Check, Download, Share2 } from 'lucide-react';
import { createTextPdfBlob } from '@/lib/pdf';
import {
  downloadBlob,
  createCsvBlob,
  slugifyFileName,
} from '@/lib/browser-download';

const BRAND = 'Migración Plus';
const DISCLAIMER = 'Contenido educativo, no asesoria legal.';

/** Library: download a (placeholder) PDF copy of a purchased book. */
export function BookDownloadButton({
  title,
  author,
  label,
}: {
  title: string;
  author?: string;
  label: string;
}) {
  const onClick = () => {
    const blob = createTextPdfBlob([
      { text: BRAND, size: 14 },
      { text: title, size: 24, gap: 20 },
      ...(author ? [{ text: author, size: 13, gap: 6 }] : []),
      { text: DISCLAIMER, size: 11, gap: 40 },
      { text: 'Copia de demostracion.', size: 11, gap: 8 },
    ]);
    downloadBlob(blob, `${slugifyFileName(title)}.pdf`);
  };
  return (
    <Button size="sm" onClick={onClick}>
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}

/** Certificates: download a PDF certificate + share the credential. */
export function CertificateActions({
  studentName,
  courseTitle,
  credentialId,
  issuedDate,
  certTitle,
  downloadLabel,
  shareLabel,
  copiedLabel,
}: {
  studentName: string;
  courseTitle: string;
  credentialId: string;
  issuedDate: string;
  certTitle: string;
  downloadLabel: string;
  shareLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const downloadPdf = () => {
    const blob = createTextPdfBlob([
      { text: BRAND, size: 14 },
      { text: certTitle, size: 26, gap: 26 },
      { text: studentName, size: 20, gap: 34 },
      { text: courseTitle, size: 16, gap: 16 },
      { text: issuedDate, size: 12, gap: 18 },
      { text: `ID: ${credentialId}`, size: 11, gap: 10 },
      { text: DISCLAIMER, size: 10, gap: 34 },
    ]);
    downloadBlob(blob, `certificado-${slugifyFileName(credentialId)}.pdf`);
  };

  const share = async () => {
    const text = `${certTitle} — ${courseTitle} (${credentialId})`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: certTitle, text });
        return;
      }
    } catch {
      /* user cancelled — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <>
      <Button size="sm" onClick={downloadPdf}>
        <Download className="h-4 w-4" />
        {downloadLabel}
      </Button>
      <Button variant="outline" size="sm" onClick={share}>
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {copied ? copiedLabel : shareLabel}
      </Button>
    </>
  );
}

/** Reports: export the (mock) metrics table as a CSV file. */
export function ExportCsvButton({
  rows,
  fileName,
  label,
}: {
  rows: (string | number)[][];
  fileName: string;
  label: string;
}) {
  const onClick = () => downloadBlob(createCsvBlob(rows), fileName);
  return (
    <Button variant="outline" onClick={onClick}>
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
