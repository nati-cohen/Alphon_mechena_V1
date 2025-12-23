
// ---------------------------------------------------------------------------
// הגדרות מערכת
// ---------------------------------------------------------------------------

// הגדרות האפליקציה - כאן מעדכנים את השמות המופיעים בממשק
export const APP_CONFIG = {
  NAME: "אלפון מכינת בית אל", // הכותרת הראשית
  SUBTITLE: "ספר תלמידים דיגיטלי" // כותרת משנית (לשימוש עתידי)
};

// כתובת לייצוא CSV מגיליון ה-Google Sheet
export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1wQY8SQy55j-JIQeLs_hFtRc2689L-sSYNBWI3Yngvls/export?format=csv"; 

// מיפוי כותרות העמודות בגיליון הנתונים
export const SHEET_HEADERS = {
  FULL_NAME: 'full_name',
  PHONE: 'phone_number',
  IMAGE: 'image_url',
  CLASS: 'class',
  NOTES: 'notes',
  BIRTHDAY: 'יום הולדת', // הכותרת בגיליון כפי שמוגדרת ב-Google Sheet
};

// תמונת ברירת מחדל במידה ולא הועלתה תמונה לתלמיד
export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random&color=fff&name=";
