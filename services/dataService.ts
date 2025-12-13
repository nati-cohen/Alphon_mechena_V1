import Papa from 'papaparse';
import { Student, GoogleSheetRow } from '../types';
import { GOOGLE_SHEET_CSV_URL, SHEET_HEADERS, DEFAULT_AVATAR } from '../constants';

const generateId = (phone: string, index: number): string => {
  return phone ? phone.replace(/\D/g, '') : `student-${index}`;
};

const getValue = (row: any, key: string, fallbackKey?: string): string => {
  if (row[key]) return row[key].trim();
  const lowerKey = key.toLowerCase();
  const foundKey = Object.keys(row).find(k => k.toLowerCase().trim() === lowerKey);
  if (foundKey && row[foundKey]) return row[foundKey].trim();
  if (fallbackKey) {
     const foundFallback = Object.keys(row).find(k => k.trim() === fallbackKey);
     if (foundFallback && row[foundFallback]) return row[foundFallback].trim();
  }
  return '';
};

export const fetchStudents = async (): Promise<Student[]> => {
  try {
    if (!GOOGLE_SHEET_CSV_URL) {
      console.warn("No Google Sheet URL provided. Using mock data.");
      return getMockData();
    }
    const urlWithCacheBuster = `${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`;
    const response = await fetch(urlWithCacheBuster);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      throw new Error("התקבל דף התחברות במקום נתונים. נא לוודא שהקובץ מוגדר כ-Public או Anyone with the link.");
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<any>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Raw CSV Data:", results.data);
          const parsedStudents: Student[] = results.data.map((row, index) => {
            const fullName = getValue(row, SHEET_HEADERS.FULL_NAME, 'שם מלא') || 'תלמיד ללא שם';
            const phoneNumber = getValue(row, SHEET_HEADERS.PHONE, 'טלפון');
            const rawImage = getValue(row, SHEET_HEADERS.IMAGE, 'תמונה');
            const className = getValue(row, SHEET_HEADERS.CLASS, 'כיתה') || 'כללי';
            const notes = getValue(row, SHEET_HEADERS.NOTES, 'הערות');

            let imageUrl = rawImage;
            if (!imageUrl) {
              imageUrl = `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
            }

            return {
              id: generateId(phoneNumber, index),
              full_name: fullName,
              phone_number: phoneNumber,
              image_url: imageUrl,
              class: className,
              notes: notes,
            };
          });

          const validStudents = parsedStudents.filter(s => 
            s.full_name !== 'תלמיד ללא שם' && s.full_name.trim() !== ''
          );
          
          if (validStudents.length === 0 && results.data.length > 0) {
              console.warn("CSV loaded but no valid students found. Check column headers.");
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
    throw error;
  }
};

const getMockData = (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          full_name: 'דוגמה - דניאל כהן',
          phone_number: '050-1234567',
          image_url: 'https://ui-avatars.com/api/?name=Daniel+Cohen',
          class: 'י״ב 1',
          notes: 'זוהי דוגמה כי לא הצלחנו לטעון את הקובץ'
        }
      ]);
    }, 800);
  });
};