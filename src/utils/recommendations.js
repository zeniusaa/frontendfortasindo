/**
 * Utility untuk menghasilkan rekomendasi tindakan perbaikan berdasarkan
 * isu teknis, skor kesehatan, dan zona BEP yang terdeteksi.
 */
export function getRecommendedActions(issues = [], bepZone = '', healthScore = 100) {
  const recommendations = [];

  const issuesStr = issues.join(' ').toLowerCase();

  // 1. Kavitasi / NPSH Deficit
  if (issuesStr.includes('kavitasi') || issuesStr.includes('npsh')) {
    recommendations.push({
      category: 'Kavitasi & Hidrolika Suction',
      action: 'Bersihkan strainer/saringan suction, buka valve suction penuh, kurangi suhu fluida, atau naikkan level permukaan air di tangki suction untuk meningkatkan NPSHa.',
      priority: 'Tinggi',
    });
  }

  // 2. Vibrasi Tinggi
  if (issuesStr.includes('vibrasi') || issuesStr.includes('getaran')) {
    recommendations.push({
      category: 'Mekanikal & Alignment',
      action: 'Lakukan laser shaft alignment antara motor & pompa, kencangkan baut fondasi, dan periksa keausan bearing atau ketidakseimbangan impeler (unbalance).',
      priority: 'Tinggi',
    });
  }

  // 3. Suhu Tinggi / Overheating
  if (issuesStr.includes('suhu') || issuesStr.includes('overheating')) {
    recommendations.push({
      category: 'Pelumasan & Pendinginan',
      action: 'Periksa level dan kualitas pelumas bearing (ganti jika terkontaminasi), serta pastikan aliran sirip/jaket pendingin motor tidak tersumbat.',
      priority: 'Tinggi',
    });
  }

  // 4. Efisiensi Turun
  if (issuesStr.includes('efisiensi')) {
    recommendations.push({
      category: 'Keausan Internal',
      action: 'Inspeksi celah keausan impeler (wear ring clearance), bersihkan bagian dalam casing dari kerak/sedimen, dan ganti komponen mekanis yang aus.',
      priority: 'Sedang',
    });
  }

  // 5. Zona BEP Danger / Far Off-Design
  if (bepZone === 'danger' || issuesStr.includes('bep')) {
    recommendations.push({
      category: 'Optimasi Titik Operasi (BEP)',
      action: 'Sesuaikan bukaan throttling valve discharge atau atur kecepatan VFD motor agar titik operasi pompa kembali ke rentang optimal 70%–120% BEP.',
      priority: 'Sedang',
    });
  }

  // Fallback jika tidak ada isu spesifik tetapi skor < 80
  if (recommendations.length === 0 && healthScore < 80) {
    recommendations.push({
      category: 'Inspeksi Rutin',
      action: 'Jadwalkan pemeriksaan fisik berkala, pengecekan kebocoran mechanical seal, dan pemantauan tren parameter harian.',
      priority: 'Rendah',
    });
  }

  return recommendations;
}
