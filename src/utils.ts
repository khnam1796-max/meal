/**
 * Date and timezone utility functions in Korea Standard Time (Asia/Seoul)
 */

/**
 * Returns a Date object adjusted to Korea Standard Time (Asia/Seoul).
 * This ensures correct calculations regardless of the localized client host system clock timezone.
 */
export function getTodayKST(): Date {
  const now = new Date();
  
  // Create formatter targeting Asia/Seoul
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
  
  const parts = formatter.formatToParts(now);
  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  
  parts.forEach(part => {
    if (part.type === 'year') year = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10) - 1;
    if (part.type === 'day') day = parseInt(part.value, 10);
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
    if (part.type === 'second') second = parseInt(part.value, 10);
  });
  
  return new Date(year, month, day, hour, minute, second);
}

/**
 * Returns Day of week in Korean (e.g. "월요일", "화요일")
 */
export function getKoreanDayOfWeek(date: Date): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return days[date.getDay()];
}

/**
 * Returns short Day of week in Korean (e.g., "월", "화", "수")
 */
export function getKoreanDayOfWeekShort(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

/**
 * Formats a Date into a Korean readable string: "5월 15일 금요일"
 */
export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const dayText = date.getDate();
  const dow = getKoreanDayOfWeek(date);
  return `${month}월 ${dayText}일 ${dow}`;
}

/**
 * Formats a Date to "YYYYMMDD" format for NEIS API compliance and data key references.
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/**
 * Given a date, returns an array of Dates for Monday through Friday of that week.
 */
export function getWeekDates(date: Date): Date[] {
  const currentDay = date.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  // Distance to Monday: if Sunday (-6), otherwise (1 - currentDay)
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d);
  }
  return weekDates;
}

/**
 * Returns the week of month in Korean format (e.g. "5월 3주차")
 */
export function getWeekOfMonth(date: Date): string {
  const month = date.getMonth() + 1;
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  
  const dateNum = date.getDate();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Days before the first Monday of the month
  const weekNum = Math.ceil((dateNum + offset) / 7);
  
  return `${month}월 ${weekNum}주차`;
}

/**
 * Default selected date logic:
 * - If today is a weekday (Mon-Fri), return today.
 * - If today is weekend (Sat-Sun), return next Monday.
 */
export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getDay();
  const res = new Date(today);
  if (day === 0) { // Sunday
    res.setDate(today.getDate() + 1);
  } else if (day === 6) { // Saturday
    res.setDate(today.getDate() + 2);
  }
  return res;
}
