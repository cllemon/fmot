import { LANG, DATE_UNIT } from './enum';
import { isPositive, isValidNumber } from './type';

interface DateOption {
  date?: Date | string;
  num?: number;
  unit?: DATE_UNIT;
  lang?: LANG;
}

// 年 | 月 | 日 比较同一天
export function isSame(
  date: Date | string,
  targetDate: Date | string,
  unit: 'year' | 'month' | 'day' = DATE_UNIT.DAY
) {
  date = new Date(date);
  targetDate = new Date(targetDate);
  const dateYear = date.getFullYear();
  const targetDateYear = targetDate.getFullYear();
  if (unit === DATE_UNIT.YEAR) return dateYear === targetDateYear;
  if (unit === DATE_UNIT.MONTH) {
    return `${dateYear}/${date.getMonth()}` === `${targetDateYear}/${targetDate.getMonth()}`;
  }
  if (unit === DATE_UNIT.DAY) return date.toLocaleDateString() === targetDate.toLocaleDateString();

  return false;
}

// 某月的总天数
export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

// 返回指定日期时间的开头时间，如月份的第一天，周的第一天
export function startOf({
  date = new Date(),
  unit = DATE_UNIT.WEEK,
  lang = LANG.EN,
}: {
  date?: Date | string;
  unit?: Omit<DATE_UNIT, 'day' | 'year'>;
  lang?: LANG;
} = {}) {
  date = new Date(date);

  const dayOfWeek = date.getDay(); // 一周的哪一天，0 表示星期天
  const dayOfMonth = date.getDate(); // 月中的哪一天（从1 -- 31）
  const monthOfYear = date.getMonth(); // 月份
  const dayOfYear = date.getFullYear(); // 年份

  // 中文日历：周一为第一列   周一 为 1
  // 英文日历：周日为第一列   周日 为 0
  if (unit === DATE_UNIT.WEEK) {
    if (lang === LANG.EN) return new Date(date.setDate(dayOfMonth - dayOfWeek));
    if (lang === LANG.ZH)
      return new Date(date.setDate(dayOfMonth - (dayOfWeek === 0 ? 7 : dayOfWeek) + 1));
  }
  if (unit === DATE_UNIT.MONTH) {
    return new Date(dayOfYear, monthOfYear, 1);
  }
  return date;
}

// 日期加法
export function add({
  date = new Date(),
  num = 1,
  unit = DATE_UNIT.WEEK,
}: Omit<DateOption, 'lang'> = {}) {
  if (!isValidNumber(num)) {
    console.warn(
      'Num is an invalid number, and you may get an unintended result. Num has been reset to the default value of 1 .'
    );
    num = 1;
  }
  date = new Date(date);

  if (unit === DATE_UNIT.DAY) return new Date(date.setDate(num + date.getDate()));
  if (unit === DATE_UNIT.WEEK) {
    return new Date(date.setDate(num * 7 + date.getDate()));
  }
  if (unit === DATE_UNIT.MONTH) return new Date(date.setMonth(num + date.getMonth()));
  if (unit === DATE_UNIT.YEAR) return new Date(date.setFullYear(num + date.getFullYear()));
  return date;
}

// 日期减法
export function subtract({
  date = new Date(),
  num = 1,
  unit = DATE_UNIT.WEEK,
}: Omit<DateOption, 'lang'> = {}) {
  if (!isPositive(num)) {
    console.warn(
      'Num is an invalid number or a negative number, and you may get an unintended result. Num has been reset to the default value of 1 .'
    );
    num = 1;
  } else {
    (num as number) *= -1;
  }
  return add({ num, date, unit });
}
