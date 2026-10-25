import Papa from 'papaparse';
import { Student } from '../types';
import { GOOGLE_SHEET_CSV_URL, SHEET_HEADERS } from '../constants';

const CACHE_STORAGE_KEY = 'cached_students_data_v2';

const generateId = (phone: string, index: number): string => {
  return phone ? phone.replace(/\D/g, '') : `student-${index}`;
};

const getValue = (row: any, key: string, fallbackKey?: string): string => {
  if (row[key]) return String(row[key]).trim();
  const lowerKey = key.toLowerCase();
  const foundKey = Object.keys(row).find(k => k.toLowerCase().trim() === lowerKey);
  if (foundKey && row[foundKey]) return String(row[foundKey]).trim();
  if (fallbackKey) {
    const foundFallback = Object.keys(row).find(k => k.trim() === fallbackKey);
    if (foundFallback && row[foundFallback]) return String(row[foundFallback]).trim();
  }
  return '';
};

// טעינה מיידית מהמטמון המקומי ב-0 שניות
export const getCachedStudents = (): Student[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read from local cache:", e);
  }
  return null;
};

// שמירת נתונים במטמון
const saveStudentsToCache = (students: Student[]) => {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.warn("Could not save to local cache:", e);
  }
};

/**
 * משיכת תלמידים מה-Google Sheets CSV
 * תומך ב-Stale-While-Revalidate: סנכרון שקט ברקע
 */
export const fetchStudents = async (
  onBackgroundUpdate?: (freshStudents: Student[]) => void
): Promise<Student[]> => {
  try {
    if (!GOOGLE_SHEET_CSV_URL) {
      return getMockData();
    }

    const urlWithCacheBuster = `${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`;
    const response = await fetch(urlWithCacheBuster);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<any>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedStudents: Student[] = results.data.map((row, index) => {
            const fullName = getValue(row, SHEET_HEADERS.FULL_NAME, 'שם מלא') || 'תלמיד ללא שם';
            const phoneNumber = getValue(row, SHEET_HEADERS.PHONE, 'טלפון');
            const rawImage = getValue(row, SHEET_HEADERS.IMAGE, 'תמונה');
            const className = getValue(row, SHEET_HEADERS.CLASS, 'כיתה') || 'כללי';
            const notes = getValue(row, SHEET_HEADERS.NOTES, 'הערות');
            const birthday = getValue(row, SHEET_HEADERS.BIRTHDAY, 'יום הולדת');
            const hiddenRaw = getValue(row, SHEET_HEADERS.HIDDEN, 'מוסתר');

            const isHidden = ['true', 'כן', 'v', '1', 'yes', 'y'].includes(hiddenRaw.toLowerCase());

            // לא משתמשים עוד ב-ui-avatars חיצוני! נשמור ריק אם אין תמונה אמיתית
            const imageUrl = rawImage && !rawImage.includes('ui-avatars.com') ? rawImage : '';

            return {
              id: generateId(phoneNumber, index),
              full_name: fullName,
              phone_number: phoneNumber,
              image_url: imageUrl,
              class: className,
              notes: notes,
              birthday_hebrew: birthday,
              is_hidden: isHidden
            };
          });

          const validStudents = parsedStudents
            .filter(s => s.full_name !== 'תלמיד ללא שם' && s.full_name.trim() !== '' && !s.is_hidden)
            .sort((a, b) => a.full_name.localeCompare(b.full_name, 'he'));
          
          // שמירה במטמון המקומי
          saveStudentsToCache(validStudents);

          // אם הוגדר callback לעדכון שקט ברקע
          if (onBackgroundUpdate) {
            onBackgroundUpdate(validStudents);
          }

          resolve(validStudents);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });

  } catch (error) {
    console.error("Error loading students:", error);
    // אם הרשת נכשלה אך יש מטמון, נחזיר את המטמון
    const fallbackCache = getCachedStudents();
    if (fallbackCache && fallbackCache.length > 0) {
      return fallbackCache;
    }
    throw error;
  }
};

const getMockData = (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          full_name: 'דניאל כהן',
          phone_number: '050-1234567',
          image_url: '',
          class: 'מחזור א׳',
          notes: 'חובש פלוגתי, אחראי עמדת עזרה ראשונה',
          birthday_hebrew: 'ט״ו חשוון'
        },
        {
          id: '2',
          full_name: 'יוסף לוי',
          phone_number: '052-7654321',
          image_url: '',
          class: 'מחזור ב׳',
          notes: 'אחראי חדר אוכל',
          birthday_hebrew: 'כ״ג אדר ב'
        }
      ]);
    }, 400);
  });
};
