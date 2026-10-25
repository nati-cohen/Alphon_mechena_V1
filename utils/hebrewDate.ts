/**
 * כלי עזר לתאריכים עבריים, גימטריה וחישוב ימי הולדת
 * כולל תמיכה מלאה בשנה מעוברת (אדר, אדר א', אדר ב')
 */

// כלי עזר לניקוי תווים מיוחדים וגרשיים לצורך השוואה אמינה
export const normalizeHebrew = (text: string = ''): string => {
  return text.replace(/['"״׳]/g, '').trim();
};

// הפקת ראשי תיבות בעברית עבור אווטאר פנימי (לדוגמה: "דניאל כהן" -> "דכ")
export const getHebrewInitials = (fullName: string = ''): string => {
  if (!fullName) return 'ת';
  const clean = fullName.trim().replace(/['"״׳]/g, '');
  const words = clean.split(/\s+/).filter(w => w.length > 0 && !['הרב', 'מר', 'ד"ר', 'דוקטור'].includes(w));
  
  if (words.length === 0) return 'ת';
  if (words.length === 1) {
    const single = words[0];
    return single.length >= 2 ? single.substring(0, 2) : single;
  }
  
  // אות ראשונה של שם פרטי + אות ראשונה של שם משפחה
  const firstLetter = words[0][0] || '';
  const lastLetter = words[words.length - 1][0] || '';
  return `${firstLetter}${lastLetter}`;
};

// המרת מספר לאותיות גימטריה עברית
export const getHebrewGematria = (num: number): string => {
  if (num <= 0) return "";
  const n = num > 5000 ? num - 5000 : num;
  const units = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש", "ת"];
  
  let result = "";
  let tempNum = n;
  while (tempNum >= 400) { 
    result += "ת"; 
    tempNum -= 400; 
  }
  if (tempNum >= 100) { 
    result += hundreds[Math.floor(tempNum / 100)]; 
    tempNum %= 100; 
  }
  if (tempNum === 15) { 
    result += "טו"; 
  } else if (tempNum === 16) { 
    result += "טז"; 
  } else {
    if (tempNum >= 10) { 
      result += tens[Math.floor(tempNum / 10)]; 
      tempNum %= 10; 
    }
    if (tempNum > 0) result += units[tempNum];
  }
  
  if (result.length > 1) return result.slice(0, -1) + '״' + result.slice(-1);
  return result + '׳';
};

// המרת יום עברי למספר לצורך מיון לפי ימי החודש
export const hebrewDayToNumber = (dayStr: string = ''): number => {
  const normalized = normalizeHebrew(dayStr);
  const gematriaMap: { [key: string]: number } = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
  };
  
  let sum = 0;
  for (const char of normalized) {
    if (gematriaMap[char]) {
      sum += gematriaMap[char];
    }
  }
  return sum;
};

// התאמת חודש יום הולדת תוך טיפול בשנה מעוברת
export const isBirthdayMonthMatch = (studentBirthday: string | undefined, currentMonth: string): boolean => {
  if (!studentBirthday || !currentMonth) return false;
  
  const bDay = normalizeHebrew(studentBirthday);
  const curr = normalizeHebrew(currentMonth);

  const isStudentAdarA = bDay.includes("אדר א");
  const isStudentAdarB = bDay.includes("אדר ב");
  const isStudentAdarPlain = bDay.includes("אדר") && !isStudentAdarA && !isStudentAdarB;

  if (curr === "אדר") {
    return isStudentAdarPlain || isStudentAdarA || isStudentAdarB;
  }
  if (curr === "אדר א") {
    return isStudentAdarA;
  }
  if (curr === "אדר ב") {
    return isStudentAdarB || isStudentAdarPlain;
  }

  return bDay.includes(curr);
};

// קבלת פרטי התאריך העברי הנוכחי
export const getCurrentHebrewDateInfo = () => {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('he-u-ca-hebrew', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).formatToParts(now);

    const dayVal = parseInt(parts.find(p => p.type === 'day')?.value || "0", 10);
    const rawMonth = parts.find(p => p.type === 'month')?.value || "";
    const yearVal = parseInt(parts.find(p => p.type === 'year')?.value || "0", 10);
    
    const cleanMonth = rawMonth.startsWith('ב') ? rawMonth.substring(1) : rawMonth;
    const dayGematria = getHebrewGematria(dayVal);
    const yearGematria = getHebrewGematria(yearVal);
    const fullFormatted = `${dayGematria} ${cleanMonth} ${yearGematria}`;

    return {
      dayNum: dayVal,
      dayGematria,
      monthName: cleanMonth,
      yearGematria,
      fullFormatted
    };
  } catch (error) {
    console.warn("Error getting Hebrew date:", error);
    return {
      dayNum: 1,
      dayGematria: '',
      monthName: '',
      yearGematria: '',
      fullFormatted: ''
    };
  }
};
