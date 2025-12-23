
// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

// הגדרות האפליקציה - שנה כאן את הכותרת שמופיעה בראש הדף
export const APP_CONFIG = {
  NAME: "אלפון מכינת בית אל", // הכותרת הראשית
  SUBTITLE: "ספר תלמידים דיגיטלי" // (אופציונלי לשימוש עתידי)
};

// Google Sheet CSV Export URL
export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1wQY8SQy55j-JIQeLs_hFtRc2689L-sSYNBWI3Yngvls/export?format=csv"; 

export const SHEET_HEADERS = {
  FULL_NAME: 'full_name',
  PHONE: 'phone_number',
  IMAGE: 'image_url',
  CLASS: 'class',
  NOTES: 'notes',
  BIRTHDAY: 'יום הולדת', // הכותרת ב-Google Sheet כפי שביקשת
};

// Default placeholder image if none provided
export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random&color=fff&name=";
