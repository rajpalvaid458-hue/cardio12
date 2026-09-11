import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WorkoutPlan } from '../types';

export interface PdfExportOptions {
  athleteName?: string;
  includeWarmUp?: boolean;
  includeRecovery?: boolean;
  includeCoachingTips?: boolean;
  notes?: string;
}

/**
 * Generates and downloads a clean, formatted, printable PDF summary of a workout plan.
 */
export const exportWorkoutPlanToPdf = (
  plan: WorkoutPlan,
  options: PdfExportOptions = {}
): jsPDF => {
  const {
    athleteName = 'PulseFit Athlete',
    includeWarmUp = true,
    includeRecovery = true,
    includeCoachingTips = true,
    notes = '',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = margin;

  // --- BRAND HEADER BAR ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 26, 3, 3, 'F');

  // Emerald Top Accent line
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(margin, currentY, pageWidth - margin * 2, 2.5, 'F');

  // Header Title & Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PULSEFIT ATHLETE PROTOCOL', margin + 6, currentY + 11);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 243, 208); // emerald-200
  doc.text('OFFICIAL WORKOUT ROUTINE & TRAINING SPECIFICATION', margin + 6, currentY + 17);

  // Right side date & athlete badge
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240); // slate-200
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.text(`DATE: ${dateStr.toUpperCase()}`, pageWidth - margin - 6, currentY + 11, { align: 'right' });
  doc.text(`ATHLETE: ${athleteName.toUpperCase()}`, pageWidth - margin - 6, currentY + 17, { align: 'right' });

  currentY += 31;

  // --- PLAN TITLE & META BLOCK ---
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(plan.title || 'Custom Workout Plan', margin, currentY);
  currentY += 5.5;

  // Tags & Specs row
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105); // slate-600

  const splitText = plan.splitType || 'Full Body';
  const durationText = `${plan.durationMinutes || 45} Minutes`;
  const levelText = plan.level ? plan.level.toUpperCase() : 'ALL LEVELS';
  const genderText = plan.targetGender ? `${plan.targetGender.toUpperCase()} FOCUS` : 'UNISEX';
  const exercisesCount = `${plan.exercises.length} EXERCISES`;

  doc.text(
    `${splitText.toUpperCase()}  •  ${durationText}  •  ${levelText}  •  ${genderText}  •  ${exercisesCount}`,
    margin,
    currentY
  );
  currentY += 4.5;

  // Description
  if (plan.description) {
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // slate-500
    const splitDesc = doc.splitTextToSize(plan.description, pageWidth - margin * 2);
    doc.text(splitDesc, margin, currentY);
    currentY += splitDesc.length * 4 + 2;
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // --- EXERCISES TABLE ---
  const tableData = plan.exercises.map((ex, index) => {
    const setsCount = ex.sets?.length || ex.defaultSets || 3;
    const repsTarget = ex.sets?.[0]?.reps ? `${ex.sets[0].reps} reps` : ex.defaultReps || '10-12 reps';
    const setsReps = `${setsCount} sets × ${repsTarget}`;
    const restTime = `${ex.restSec || 60}s`;
    const formTip = includeCoachingTips
      ? ex.formTip || ex.formTips?.[0] || 'Maintain strict form and controlled tempo.'
      : 'Standard execution';

    return [
      (index + 1).toString(),
      ex.name,
      ex.targetMuscle || 'General',
      ex.equipment || 'Standard',
      setsReps,
      restTime,
      formTip,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Exercise Name', 'Target Muscle', 'Equipment', 'Target Sets × Reps', 'Rest', 'Coaching Form Tip']],
    body: tableData,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2.5,
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 7.5,
      cellPadding: 2.5,
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { cellWidth: 7, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 38, fontStyle: 'bold' },
      2: { cellWidth: 26 },
      3: { cellWidth: 22 },
      4: { cellWidth: 26, fontStyle: 'bold' },
      5: { cellWidth: 14, halign: 'center' },
      6: { cellWidth: 'auto' },
    },
    didDrawPage: () => {
      // Draw standard page footer
      drawFooter(doc, pageWidth, pageHeight, margin);
    },
  });

  // Get final Y from autoTable
  const finalTableY = (doc as any).lastAutoTable?.finalY || currentY + 50;
  currentY = finalTableY + 6;

  // Check if we need a new page for supplementary blocks
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = margin + 4;
  }

  // --- WEEKLY SCHEDULE SUMMARY (IF PRESENT) ---
  if (plan.weeklySchedule && plan.weeklySchedule.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('7-DAY PROGRAM PROGRESSION SCHEDULE', margin, currentY);
    currentY += 4;

    const scheduleData = plan.weeklySchedule.map((day) => [
      `Day ${day.dayNumber} (${day.dayName})`,
      day.focus,
      day.restDay ? 'Rest / Active Recovery' : `${day.exerciseCount || 4} Exercises`,
      day.tips || 'Optimal recovery & hydration',
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Day', 'Focus', 'Workout Type', 'Daily Progression Tip']],
      body: scheduleData,
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: {
        fillColor: [51, 65, 85], // slate-700
        textColor: [255, 255, 255],
        fontSize: 7.5,
        cellPadding: 2,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      didDrawPage: () => {
        drawFooter(doc, pageWidth, pageHeight, margin);
      },
    });

    currentY = ((doc as any).lastAutoTable?.finalY || currentY + 30) + 6;
  }

  // Check page height again
  if (currentY > pageHeight - 48) {
    doc.addPage();
    currentY = margin + 4;
  }

  // --- WARM-UP & RECOVERY SECTION ---
  if (includeWarmUp || includeRecovery) {
    const boxWidth = (pageWidth - margin * 2 - 4) / 2;
    const boxHeight = 28;

    if (includeWarmUp) {
      // Warm-up Box
      doc.setFillColor(240, 253, 244); // emerald-50
      doc.setDrawColor(167, 243, 208); // emerald-200
      doc.roundedRect(margin, currentY, boxWidth, boxHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.text('5-MIN DYNAMIC WARM-UP PROTOCOL', margin + 4, currentY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(4, 120, 87);
      const warmUpLines = [
        '• 60s Light arm circles & shoulder dislocates',
        '• 60s Bodyweight deep squats & hip openers',
        '• 60s Torso rotations & cat-cow flow',
        '• 1-2 Ramp-up warmup sets at 40-50% weight',
      ];
      warmUpLines.forEach((line, i) => {
        doc.text(line, margin + 4, currentY + 11 + i * 4);
      });
    }

    if (includeRecovery) {
      // Recovery Box
      const recX = margin + boxWidth + 4;
      doc.setFillColor(239, 246, 255); // blue-50
      doc.setDrawColor(191, 219, 254); // blue-200
      doc.roundedRect(recX, currentY, boxWidth, boxHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 64, 175); // blue-800
      doc.text('POST-WORKOUT RECOVERY PROTOCOL', recX + 4, currentY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(29, 78, 216);
      const recoveryLines = [
        '• 5-min Static stretching of worked muscle groups',
        '• 500-750ml water + pinch of electrolytes',
        '• 25-35g high-quality protein within 90 minutes',
        '• Minimum 7-8 hours restorative sleep',
      ];
      recoveryLines.forEach((line, i) => {
        doc.text(line, recX + 4, currentY + 11 + i * 4);
      });
    }

    currentY += boxHeight + 4;
  }

  // --- OPTIONAL ATHLETE NOTES ---
  if (notes.trim()) {
    if (currentY > pageHeight - 25) {
      doc.addPage();
      currentY = margin + 4;
    }

    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(252, 211, 77); // amber-300
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('COACH / ATHLETE CUSTOM NOTES:', margin + 4, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(notes.trim(), margin + 4, currentY + 9);
    currentY += 16;
  }

  // Save the PDF directly
  const sanitizedTitle = (plan.title || 'Workout_Plan')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 40);
  const fileName = `${sanitizedTitle}_PulseFit_Routine.pdf`;
  doc.save(fileName);

  return doc;
};

/**
 * Helper to draw footer on every page
 */
const drawFooter = (doc: jsPDF, pageWidth: number, pageHeight: number, margin: number) => {
  const pageNum = doc.getNumberOfPages();
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'normal');

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 8, pageWidth - margin, pageHeight - 8);

  doc.text(
    'PulseFit Athlete Protocols  •  Engineered for Hypertrophy, Strength & Longevity  •  pulsefit.app',
    margin,
    pageHeight - 4.5
  );

  doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 4.5, { align: 'right' });
};

/**
 * Generates formatted text/markdown routine representation for quick sharing via WhatsApp, SMS, or Social Media.
 */
export const generateWorkoutPlanShareText = (plan: WorkoutPlan, athleteName?: string): string => {
  const athlete = athleteName ? ` for ${athleteName}` : '';
  const lines: string[] = [
    `🏋️ *${plan.title}*${athlete}`,
    `⏱️ Duration: ${plan.durationMinutes || 45} mins | Split: ${plan.splitType || 'Full Body'}`,
    `🎯 Level: ${plan.level || 'All'} | Target: ${plan.exercises.length} Exercises`,
    '',
    `📋 *Exercise List:*`,
  ];

  plan.exercises.forEach((ex, idx) => {
    const sets = ex.sets?.length || ex.defaultSets || 3;
    const reps = ex.sets?.[0]?.reps ? `${ex.sets[0].reps} reps` : ex.defaultReps || '10-12';
    lines.push(`${idx + 1}. *${ex.name}* — ${sets} sets × ${reps} (${ex.restSec || 60}s rest)`);
    if (ex.formTip) {
      lines.push(`   💡 Tip: ${ex.formTip}`);
    }
  });

  lines.push('');
  lines.push(`⚡ Generated with PulseFit Elite Workout & Fitness Tracker`);
  lines.push(`👉 https://pulsefit.app`);

  return lines.join('\n');
};
