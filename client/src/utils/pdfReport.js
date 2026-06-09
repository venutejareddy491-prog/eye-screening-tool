import { jsPDF } from 'jspdf';

export function downloadScreeningPDF(screening, userName = 'Patient') {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('Smart Dry Eye Screening Report', margin, y);
  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
  y += 8;
  doc.text(`Patient: ${userName}`, margin, y);
  y += 14;

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Risk Assessment', margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.text(`Assessment Result: ${screening.riskCategory}`, margin, y);
  y += 6;
  doc.text(`Risk Points: ${screening.riskScore} points`, margin, y);
  y += 14;

  doc.setFontSize(14);
  doc.text('Symptoms Summary', margin, y);
  y += 8;
  doc.setFontSize(10);
  const symptoms = screening.symptoms || screening.answers || {};
  Object.entries(symptoms).forEach(([k, v]) => {
    if (v && y < 270) {
      doc.text(`• ${k}: ${v}`, margin, y);
      y += 5;
    }
  });
  y += 8;

  doc.setFontSize(14);
  doc.text('Recommendations', margin, y);
  y += 8;
  doc.setFontSize(10);
  (screening.recommendations || []).forEach((rec) => {
    if (y > 265) {
      doc.addPage();
      y = margin;
    }
    doc.setFont(undefined, 'bold');
    doc.text(rec.title, margin, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    const lines = doc.splitTextToSize(rec.text, 170);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  });

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    'Disclaimer: This tool is for educational screening only. Consult an eye care professional for diagnosis.',
    margin,
    285
  );

  doc.save(`dry-eye-report-${Date.now()}.pdf`);
}
