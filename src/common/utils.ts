import { DATE_UNIT, PANEL_TYPE } from './enum';
import { startOf, subtract, add, isSame } from './date';
import { CALENDAR_ROW_SIZE } from './constant';
import { Day } from '../interface';

function constructDay(options: Record<string, any>) {
  return function (date: Date): Day {
    const now = new Date();
    const today = isSame(date, now) ? 'today' : '';
    const otherMonthDayClassName =
      options.dataType === PANEL_TYPE.MONTH
        ? isSame(date, options.dateMonthBegin, DATE_UNIT.MONTH)
          ? ''
          : 'other-month-day'
        : '';
    return {
      type: '',
      date,
      text: date.getDate(),
      topInfo: '',
      bottomInfo: '',
      className: '',
      today,
      otherMonthDayClassName,
    };
  };
}

function generateDays(
  dates: (Date | string)[],
  callback: (date: Date) => Day,
  row: number = 1
): Day[][] {
  return dates.map(date => {
    return Array(CALENDAR_ROW_SIZE * row)
      .fill(new Date())
      .map((_, idx) => callback(add({ date, unit: DATE_UNIT.DAY, num: idx })));
  });
}

// 生成 week | month 的天数据
export function constructMonthPanelDateData(date: Date | string) {
  // 月数据
  const dateMonthBegin = startOf({ date, unit: DATE_UNIT.MONTH }); // 当月首
  const datePreMonthBegin = subtract({ date: dateMonthBegin, unit: DATE_UNIT.MONTH }); // 上月首
  const dateNextMonthBegin = add({ date: dateMonthBegin, unit: DATE_UNIT.MONTH }); // 下月首
  const weekBeginMonth = startOf({ date: dateMonthBegin, unit: DATE_UNIT.WEEK }); // 本月月首日期 第一列日期
  const weekBeginPreMonth = startOf({ date: datePreMonthBegin, unit: DATE_UNIT.WEEK }); // 上月月首日期 第一列日期
  const weekBeginNextMonth = startOf({ date: dateNextMonthBegin, unit: DATE_UNIT.WEEK }); // 下月月首日期 第一列日期
  const days = generateDays(
    [weekBeginPreMonth, weekBeginMonth, weekBeginNextMonth],
    constructDay({
      dataType: PANEL_TYPE.MONTH,
      defaultSelectDate: date,
      dateMonthBegin,
    }),
    6
  );

  return {
    dateMonthBegin,
    days,
  };
}

export function constructWeekPanelDateData(date: Date | string) {
  // 周数据
  const dateWeekBegin = startOf({ date, unit: DATE_UNIT.WEEK });
  const datePreWeekBegin = subtract({ date: dateWeekBegin });
  const dateNextWeekBegin = add({ date: dateWeekBegin });
  const days = generateDays(
    [datePreWeekBegin, dateWeekBegin, dateNextWeekBegin],
    constructDay({
      dataType: PANEL_TYPE.WEEK,
      defaultSelectDate: date,
    })
  );

  return {
    dateWeekBegin,
    days,
  };
}

// 节流
export function throttle(fn: Function, delay: number = 100) {
  let flag = true;
  return (...args: any) => {
    if (flag) {
      flag = false;
      fn(...args);
      setTimeout(() => {
        flag = true;
      }, delay);
    }
  };
}
