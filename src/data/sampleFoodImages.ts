/**
 * Curated sample food images for instant one-tap testing in environments
 * where a hardware camera is unavailable or in sandbox iframe previews.
 */

export interface SampleFoodImage {
  id: string;
  name: string;
  hindiName: string;
  cuisine: string;
  category: string;
  description: string;
  dataUrl: string;
}

// Generate realistic food image canvas data URLs so they are completely self-contained and fast
function createFoodCanvasDataUrl(dishType: 'thali' | 'chicken_rice' | 'oatmeal' | 'salad'): string {
  if (typeof document === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Dark rustic wood table background
    const bgGrad = ctx.createRadialGradient(200, 150, 50, 200, 150, 250);
    bgGrad.addColorStop(0, '#2d1f14');
    bgGrad.addColorStop(1, '#180e07');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 400, 300);

    // Plate shadow
    ctx.beginPath();
    ctx.ellipse(200, 155, 145, 115, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();

    // Ceramic Plate
    const plateGrad = ctx.createLinearGradient(80, 50, 320, 250);
    plateGrad.addColorStop(0, '#f8fafc');
    plateGrad.addColorStop(1, '#cbd5e1');
    ctx.beginPath();
    ctx.ellipse(200, 150, 140, 110, 0, 0, Math.PI * 2);
    ctx.fillStyle = plateGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Inner plate rim
    ctx.beginPath();
    ctx.ellipse(200, 150, 115, 88, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    if (dishType === 'thali') {
      // Indian Thali: Paneer, Dal, Roti, Rice, Salad
      // Roti 1
      ctx.beginPath();
      ctx.ellipse(150, 130, 45, 32, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      // Char marks on roti
      ctx.fillStyle = '#78350f';
      ctx.fillRect(140, 125, 15, 3);
      ctx.fillRect(160, 135, 10, 2);

      // Yellow Dal Katori
      ctx.beginPath();
      ctx.ellipse(235, 115, 32, 25, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Paneer Masala Gravy
      ctx.beginPath();
      ctx.ellipse(220, 170, 38, 28, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ea580c';
      ctx.fill();
      // White paneer cubes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(205, 160, 12, 10);
      ctx.fillRect(225, 165, 14, 11);
      ctx.fillRect(215, 175, 10, 9);

      // Green salad garnish
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(155, 185, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (dishType === 'chicken_rice') {
      // Grilled Chicken Breast & Brown Rice
      // Brown Rice bed
      ctx.beginPath();
      ctx.ellipse(170, 150, 65, 50, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#d4a373';
      ctx.fill();

      // Sliced grilled chicken breast
      ctx.fillStyle = '#fed7aa';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(220 + i * 8, 125 + i * 15, 30, 12, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(210 + i * 8, 123 + i * 15, 20, 2);
        ctx.fillStyle = '#fed7aa';
      }

      // Steamed Broccoli florets
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(150, 120, 18, 0, Math.PI * 2);
      ctx.arc(135, 140, 15, 0, Math.PI * 2);
      ctx.fill();
    } else if (dishType === 'oatmeal') {
      // Warm Oatmeal with Banana, Berries & Walnuts
      ctx.beginPath();
      ctx.ellipse(200, 150, 85, 65, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#e2d9cc';
      ctx.fill();

      // Sliced bananas
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(170, 135, 12, 0, Math.PI * 2);
      ctx.arc(195, 125, 12, 0, Math.PI * 2);
      ctx.arc(220, 130, 12, 0, Math.PI * 2);
      ctx.fill();

      // Blueberries & Strawberries
      ctx.fillStyle = '#4338ca';
      ctx.beginPath();
      ctx.arc(160, 160, 8, 0, Math.PI * 2);
      ctx.arc(178, 175, 7, 0, Math.PI * 2);
      ctx.arc(235, 155, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(205, 165, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Mediterranean Greek Salad with Feta & Olive Oil
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(200, 150, 90, 68, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cherry tomatoes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(170, 130, 14, 0, Math.PI * 2);
      ctx.arc(225, 140, 13, 0, Math.PI * 2);
      ctx.arc(195, 175, 12, 0, Math.PI * 2);
      ctx.fill();

      // Feta cheese cubes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(180, 140, 15, 15);
      ctx.fillRect(210, 160, 14, 14);
      ctx.fillRect(150, 160, 12, 12);

      // Black Olives
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(160, 145, 7, 0, Math.PI * 2);
      ctx.arc(230, 165, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas.toDataURL('image/jpeg', 0.85);
  } catch (e) {
    return '';
  }
}

export function getSampleFoodPresets(): SampleFoodImage[] {
  return [
    {
      id: 'thali',
      name: 'Paneer Butter Masala, Dal & 2 Rotis Thali',
      hindiName: 'पनीर मसाला, दाल और 2 रोटियां थाली',
      cuisine: 'Indian',
      category: 'Lunch / Dinner',
      description: 'Classic North Indian wholesome meal with balanced protein from paneer and dal.',
      dataUrl: createFoodCanvasDataUrl('thali'),
    },
    {
      id: 'chicken_rice',
      name: 'Grilled Chicken Breast, Brown Rice & Broccoli',
      hindiName: 'ग्रिल्ड चिकन, ब्राउन राइस और ब्रोकली',
      cuisine: 'International',
      category: 'High Protein Fuel',
      description: 'Lean bodybuilder staple packed with 42g lean protein and low saturated fats.',
      dataUrl: createFoodCanvasDataUrl('chicken_rice'),
    },
    {
      id: 'oatmeal',
      name: 'Rolled Oats Bowl with Banana, Berries & Seeds',
      hindiName: 'रोल्ड ओट्स, केला और बेरीज़ ब्रेकफ़ास्ट',
      cuisine: 'Universal',
      category: 'Breakfast Power Bowl',
      description: 'Slow-digesting complex carbs, dietary fiber and clean morning energy.',
      dataUrl: createFoodCanvasDataUrl('oatmeal'),
    },
    {
      id: 'salad',
      name: 'Greek Salad with Feta Cheese & Olive Oil',
      hindiName: 'ग्रीक सलाद फ़ेटा चीज़ और जैतून के तेल के साथ',
      cuisine: 'Universal',
      category: 'Clean Low Carb',
      description: 'Refreshing micronutrient-rich salad with heart-healthy monounsaturated fats.',
      dataUrl: createFoodCanvasDataUrl('salad'),
    },
  ];
}
