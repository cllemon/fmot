export const PREFIX_CLS = 'calendar';

export const DEFAULT_CONTROL_PANEL_CONFIG = {
  left: true,
  onLeftClick: () => console.log('left click'),
  today: true,
  onTodayClick: () => console.log('today click'),
  right: true,
  onRightClick: () => console.log('right click'),
  fold: true,
  onFoldClick: () => console.log('fold click'),
  date: (date: Date) => date, // 日期显示，常用于格式化，默认显示月份 2021年05月
  onDateClick: () => console.log('date click'), // 日期点击事件，
};

export const HEADER_WEEKS = {
  zh: ['日', '一', '二', '三', '四', '五', '六'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat'],
};

export const CALENDAR_ROW_SIZE = 7;
export const CALENDAR_PAGE_SIZE = 3;
