<div align="center">

<img src="https://i.postimg.cc/6QtbGKVS/lwgw-mkynh.jpg" alt="לוגו מכינת בית אל" width="110" style="border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 12px;" />

# 📖 אלפון מכינת בית אל
### ספר תלמידים דיגיטלי, קהילתי ומותאם שטח

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Offline First](https://img.shields.io/badge/Offline-First-green?style=for-the-badge&logo=safari&logoColor=white)](#-חוויית-שימוש-וביצועים-ux--performance)

<p align="center">
  אפליקציית Web & PWA מתקדמת וייעודית לתלמידי, בוגרי וצוות <b>מכינת בית אל</b>.<br>
  האפליקציה מתממשקת בזמן אמת עם גיליון Google Sheets ומעניקה חוויית נייטיב חלקה, מהירה, אלגנטית ומותאמת שטח.
</p>

---

</div>

## ✨ תכונות עיקריות

### ⚡ חוויית שימוש וביצועים (UX & Performance)
* **טעינה מיידית ב-0 שניות (Stale-While-Revalidate):** המערכת נטענת ישירות מהמטמון המקומי (`localStorage`), ומבצעת במקביל סנכרון שקט מול גיליון ה-Google Sheets ברקע.
* **משיכה לרענון (Pull to Refresh):** תמיכה במשיכת המסך מלמעלה כלפי מטה לעדכון נתונים ידני מהיר, כולל אנימציית סיבוב חלקה ומשוב רטט הפטי (`Haptic Feedback`).
* **חיפוש גמיש וסובלני (Smart Hebrew Search):** מנוע חיפוש פנימי חכם המאפשר איתור תלמידים לפי שם, מחזור או מספר טלפון – עם סובלנות לכתיב מלא/חסר, נירמול אותיות סופיות, ניקוי מקפים ותווים מיוחדים.
* **התאמה אישית של גודל תצוגה (Scale Slider):** אפשרות לקביעת גודל כרטיסי התלמידים (1–5) באמצעות סליידר ייעודי שנשמר אוטומטית במכשיר, עם תאימות מושלמת למצב בהיר וכהה.
* **תמיכה מלאה ב-PWA ואופליין:** התקנה ישירה בלחיצה למסך הבית (iOS / Android), הפעלה עצמאית ללא תלות בדפדפן וזמינות מלאה גם ללא קליטה סלולרית בשטח.

### 👥 כרטיס תלמיד ופעולות מהירות
* **פעולות מהירות ישירות מהרשימה:** חיוג ישיר ושליחת הודעת WhatsApp בלחיצה בודדת מבלי להיכנס לפרופיל.
* **תצוגת תמונה מוגדלת (Lightbox):** לחיצה על תמונת הפרופיל פותחת את התמונה המלאה במסך מוגדל כולל כפתור סגירה נקי.
* **אווטאר עברי מקומי:** לתלמידים ללא תמונה מיוצר אווטאר נקי ומעוצב עם ראשי התיבות של שמם בעברית (ללא תלות בשירותים חיצוניים).
* **שיתוף טבעי (Native Web Share API):** כפתור שיתוף המפעיל את מגירת השיתוף של הטלפון להעברת שם התלמיד ומספר הטלפון, עם מעבר חלופי אוטומטי (Fallback) להעתקה ללוח.
* **שמירה לטלפון (vCard):** ייצוא כרטיס איש קשר מלא (`.vcf`) התומך בקידוד עברית נקי (`UTF-8 BOM` ו-`CHARSET=UTF-8`) למניעת ג'יבריש במכשירי iOS ו-Android.

### 🎂 לוח עברי ומערך ימי הולדת
* **תאריך עברי חי:** המרה וחישוב אוטומטי של התאריך העברי הנוכחי (כולל גימטריה מלאה של ימים וחודשים).
* **חוגגים החודש:** עמוד ייעודי המרכז את בעלי יום ההולדת בחודש העברי הנוכחי, עם מיון כרונולוגי לפי ימי החודש ואפשרות סינון לפי מחזור.
* **תמיכה בשנה מעוברת:** זיהוי מובנה ומדויק לחודשי **אדר, אדר א׳ ואדר ב׳**.
* **פופ-אפ יום הולדת יומי:** הודעה חגיגית קופצת (עבור חוגג יחיד או תצוגה קבוצתית) עם כפתור לברכה מהירה בוואטסאפ.

### 🤝 תרומות ושותפות
* **עמוד תרומות ייעודי:** תמיכה בתרומות בכרטיס אשראי מאובטח, ביט (Bit), פיבוקס (PayBox) והעברה בנקאית ישירה עם אפשרות העתקת פרטי החשבון בלחיצה.

---

## 🎨 שפה עיצובית (Design System)

האפליקציה מעוצבת בפלטת צבעים שורשית, אלגנטית וחמה המשדרת אופי מכינאי אותנטי:
* **רקע ראשי בהיר:** גוון אבן חם ומעודן (`#FAF8F5` / `stone-50`).
* **מצב לילה (Dark Mode):** גווני גרפיט וסלע עמוקים (`stone-950` / `stone-900`) עם מרווחים נקיים והפרדה ברורה.
* **צבעי הדגשה (Accent):** ענבר וזהב מדברי (`amber-600` / `amber-500`) לימי הולדת ולתאריך העברי.
* **כפתורי פעולה:** אבן כהה לחיוג (`stone-900`), ירוק מודגש לוואטסאפ (`emerald-600`).
* **טיפוגרפיה:** שילוב הרמוני של **Rubik** (משקלים 500, 700, 800) לכותרות בעלות נוכחות ו-**Heebo** לטקסט רץ וקריאות מקסימלית במובייל.

---

## 📂 מבנה התיקיות בפרויקט

```text
├── index.html                  # קובץ ה-HTML הראשי (פונטים, מטא, תצורת Tailwind וסליידר)
├── package.json                # תלויות וסקריפטים של הפרויקט
├── vite.config.ts              # הגדרות Vite ותוסף VitePWA (מניפסט ו-Service Worker)
├── constants.ts                # כתובת גיליון ה-Google Sheets והגדרות מערכת (כותרות, ערוצי תרומה)
├── types.ts                    # ממשקי TypeScript (Student, GoogleSheetRow ועוד)
├── App.tsx                     # ניתוב ראשי (HashRouter) וניהול מעטפת האפליקציה
├── services/
│   └── dataService.ts          # משיכת נתונים (PapaParse), Stale-While-Revalidate ומטמון מקומי
├── utils/
│   └── hebrewDate.ts           # חישוב תאריכים עבריים, גימטריה, ראשי תיבות ושנה מעוברת
└── components/
    ├── Avatar.tsx              # רכיב תמונת פרופיל / אווטאר ראשי תיבות עברי
    ├── BirthdayPage.tsx        # עמוד חוגגי יום הולדת החודש וסינון לפי מחזור
    ├── BirthdayPopup.tsx       # מודאל חגיגי לחוגגים ביום הנוכחי
    ├── DonationPage.tsx        # עמוד תרומות ושותפות (אשראי, ביט, פיבוקס, העברה)
    ├── Icons.tsx               # מערך אייקונים וקטוריים מינימליסטיים (SVG)
    ├── ImageLightbox.tsx       # מודאל הגדלת תמונת פרופיל
    ├── InstallPwa.tsx          # באנר עדין להתקנת האפליקציה על מסך הבית
    ├── Sidebar.tsx             # תפריט צד (ניווט, לו"ז, מצב לילה, סליידר סקייל)
    ├── StudentDetail.tsx       # עמוד פרטי תלמיד (כרטיס מידע, שיחה, וואטסאפ, שיתוף, vCard)
    └── StudentList.tsx         # רשימת התלמידים הראשית, חיפוש חכם, סינונים ומשיכה לרענון
```

---

## 📊 מבנה גיליון ה-Google Sheets

האפליקציה מושכת את הנתונים ישירות מגיליון Google Sheets ציבורי המיוצא כקובץ CSV.

שורת הכותרות (Header) בגיליון תומכת בשמות עמודות בעברית או באנגלית:

| שם עמודה (אנגלית) | שם עמודה (עברית) | חובה? | תיאור | דוגמה |
| :--- | :--- | :---: | :--- | :--- |
| `full_name` | **שם מלא** | ✔️ | שם התלמיד (פרטי + משפחה) | יונתן כהן |
| `phone_number` | **טלפון** | ✔️ | מספר נייד לחיוג ולוואטסאפ | 052-1234567 |
| `class` | **כיתה / מחזור** | ✔️ | מחזור המכינה לצורכי סינון | מחזור כ״ד |
| `image_url` | **תמונה** | ✖️ | קישור ישיר לתמונת פרופיל (URL) | `https://.../photo.jpg` |
| `birthday_hebrew` | **יום הולדת** | ✖️ | תאריך עברי (יום + חודש) | ט״ו אב |
| `notes` | **הערות** | ✖️ | תפקיד, חדר, או הערה מיוחדת | צוות פיקוד / חדר 4 |
| `מוסתר` | **מוסתר** | ✖️ | סימון להסתרת התלמיד מהרשימה | `כן` / `true` |

> 💡 **כיצד להחליף את כתובת הגיליון?**  
> פתחו את הקובץ `constants.ts` ועדכנו את המשתנה `GOOGLE_SHEET_CSV_URL` בקישור ה-CSV החדש (קובץ > שיתוף > פרסום באינטרנט > CSV).

---

## 📱 התקנה כאפליקציה (PWA)

האפליקציה נבנתה כ-Progressive Web App מלאה הניתנת להתקנה על כל מכשיר:

### 🤖 מכשירי Android (Chrome)
1. פתחו את הקישור בדפדפן Chrome.
2. לחצו על באנר ההתקנה שמופיע בתחתית המסך, או על תפריט שלוש הנקודות (⋮) ובחרו **"התקנת אפליקציה"** / **"הוספה למסך הבית"**.

### 🍏 מכשירי iPhone / iPad (Safari)
1. פתחו את הקישור בדפדפן Safari.
2. לחצו על כפתור השיתוף בתחתית המסך (ריבוע עם חץ למעלה).
3. גללו מטה ובחרו באפשרות **"הוסף למסך הבית"** (Add to Home Screen).

---

## 🚀 התקנה והרצה מקומית

```bash
# 1. שכפול המאגר
git clone https://github.com/your-username/student-directory.git
cd student-directory

# 2. התקנת חבילות ותלויות
npm install

# 3. הרצת שרת פיתוח מקומי
npm run dev

# 4. בנייה גרסת פרודקשן (Production Build)
npm run build
```

---

## 🛠️ טכנולוגיות מרכזיות

* **Frontend:** [React 18](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite 5](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **PWA Engine:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
* **CSV Parsing:** [PapaParse](https://www.papaparse.com/)
* **Routing:** [React Router DOM v6](https://reactrouter.com/) (HashRouter לתמיכה מושלמת ב-PWA)

---

<div align="center">

נוצר באהבה עבור **מכינת בית אל** 🇮🇱

</div>