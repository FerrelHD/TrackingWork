export function calculateRemainingDays(deadlineStr: string): number {
  if (!deadlineStr) return 999;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = deadlineStr.split('-').map(Number);
  const deadline = new Date(year, month - 1, day);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatRemainingDays(remainingDays: number): {
  text: string;
  status: 'urgent' | 'warning' | 'normal' | 'expired';
} {
  if (remainingDays < 0) {
    return {
      text: `Lewat ${Math.abs(remainingDays)} hari`,
      status: 'expired',
    };
  }
  if (remainingDays === 0) {
    return {
      text: 'Hari ini!',
      status: 'urgent',
    };
  }
  if (remainingDays === 1) {
    return {
      text: 'Besok (1 hari lagi)',
      status: 'urgent',
    };
  }
  if (remainingDays <= 3) {
    return {
      text: `${remainingDays} hari lagi`,
      status: 'urgent',
    };
  }
  if (remainingDays <= 7) {
    return {
      text: `${remainingDays} hari lagi`,
      status: 'warning',
    };
  }
  return {
    text: `${remainingDays} hari lagi`,
    status: 'normal',
  };
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('-');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const mIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} ${months[mIndex] || month} ${year}`;
}

