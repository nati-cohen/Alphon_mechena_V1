// ניהול ערכת נושא (בהיר / כהה) וסנכרון מלא עם צבעי המערכת של המכשיר (Status Bar & Navigation Bar)

export const THEME_COLORS = {
  light: '#FAF8F5',
  dark: '#0c0a09', // stone-950
} as const;

/**
 * החלת ערכת הנושא על כל שכבות המערכת:
 * 1. מחלקת dark ב-html (Tailwind)
 * 2. מאפיין color-scheme ב-CSS (משפיע על סרגלי המערכת באנדרואיד וב-iOS)
 * 3. תגית meta name="theme-color" (צבע סרגל הסטטוס העליון והניווט התחתון)
 * 4. תגית meta name="apple-mobile-web-app-status-bar-style" (עבור מכשירי אפל)
 */
export const applyTheme = (isDark: boolean, savePreference = true) => {
  try {
    const root = document.documentElement;
    const targetColor = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    // 1. מחלקת dark
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // 2. עדכון כל תגיות theme-color הקיימות בדף
    const themeColorMetas = document.querySelectorAll('meta[name="theme-color"]');
    if (themeColorMetas.length > 0) {
      themeColorMetas.forEach(meta => {
        meta.setAttribute('content', targetColor);
      });
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = targetColor;
      document.head.appendChild(meta);
    }

    // 3. עדכון סרגל סטטוס למכשירי אפל
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleStatusBar) {
      appleStatusBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
    }

    // 4. שמירה בהעדפות המשתמש
    if (savePreference) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  } catch (e) {
    console.warn('Error applying theme:', e);
  }
};

/**
 * בדיקת מצב כהה ראשוני והחלתו מיידית
 */
export const initTheme = (): boolean => {
  try {
    const saved = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved === 'dark' || (!saved && systemPrefersDark);
    applyTheme(isDark, false);
    return isDark;
  } catch (e) {
    applyTheme(false, false);
    return false;
  }
};
