import { I18N } from 'astrowind:config';

// تابع تبدیل تاریخ میلادی به شمسی (بدون کتابخانهٔ اضافی)
function toJalali(date: Date): { year: number; month: number; day: number } {
  const d = new Date(date.getTime());
  d.setHours(12, 0, 0, 0); // جلوگیری از تغییر روز در مناطق زمانی
  const gy = d.getFullYear();
  const gm = d.getMonth() + 1;
  const gd = d.getDate();
  
  const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  
  const gy2 = gm > 2 ? gy + 1 : gy;
  const days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd;
  
  for (let i = 0; i < gm - 1; ++i) {
    days += gDaysInMonth[i];
  }
  
  if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0))) {
    days++;
  }
  
  days -= 492268; // فاصلهٔ روزشمار میلادی و شمسی
  
  let jy = 1;
  while (days >= (jy === 1 && 366 || 365)) {
    days -= (jy === 1 && 366 || 365);
    jy++;
  }
  
  let jm = 0;
  while (days >= jDaysInMonth[jm]) {
    days -= jDaysInMonth[jm];
    jm++;
  }
  
  return {
    year: jy,
    month: jm + 1,
    day: days + 1
  };
}

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const getFormattedDate = (date: Date): string => {
  if (!date) return '';
  const j = toJalali(date);
  return `${j.day} ${persianMonths[j.month - 1]} ${j.year}`;
};

export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

export const toUiAmount = (amount: number) => {
  if (!amount) return 0;

  let value: string;

  if (amount >= 1000000000) {
    const formattedNumber = (amount / 1000000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'B';
    } else {
      value = formattedNumber + 'B';
    }
  } else if (amount >= 1000000) {
    const formattedNumber = (amount / 1000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'M';
    } else {
      value = formattedNumber + 'M';
    }
  } else if (amount >= 1000) {
    const formattedNumber = (amount / 1000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'K';
    } else {
      value = formattedNumber + 'K';
    }
  } else {
    value = Number(amount).toFixed(0);
  }

  return value;
};
