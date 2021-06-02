import React, { TouchEvent, FC, useState, useEffect, useRef } from 'react';
import { CalendarProps, ControlPanelConfig, ControlNode, Day, ExtraInfo } from './interface';
import { PREFIX_CLS, DEFAULT_CONTROL_PANEL_CONFIG, HEADER_WEEKS } from './common/constant';
import { isFunction, isPureObject, isBoolean, isTrue, isFalse, isArray } from './common/type';
import { LANG, SELECT_TYPE, PANEL_TYPE, DATE_UNIT } from './common/enum';
import { constructMonthPanelDateData, constructWeekPanelDateData, throttle } from './common/utils';
import { isSame, subtract, add } from './common/date';
import './style.less';

const NOW = new Date();

const Calendar: FC<CalendarProps> = ({
  title,
  controlPanel,
  controlPanelPosition = 'left',
  lang = LANG.ZH,
  headerWeeks,
  type = PANEL_TYPE.MONTH,
  selectType = SELECT_TYPE.SINGLE,
  defaultDate = NOW,
  rowHeight = 50,
  lunar = false,
  formatter = (day: Day) => day,
}: CalendarProps) => {
  const [panelType, setPanelType] = useState(type);
  // 控制面板
  const ControlPanel = () => {
    if (isFalse(controlPanel)) return;
    let options: ControlPanelConfig = DEFAULT_CONTROL_PANEL_CONFIG;
    if (isPureObject(controlPanel)) {
      options = Object.assign({}, options, controlPanel);
    }

    const ControlNode = (control: ControlNode, node: string) => {
      if (isBoolean(control)) return <span className="icon">{node}</span>;
      return control;
    };

    const onControlLeft = (cb: any) => cb && cb();

    return (
      <section
        className={`${PREFIX_CLS}__header--operate`}
        style={{ flexDirection: controlPanelPosition === 'left' ? 'row' : 'row-reverse' }}
      >
        <div className="date" onClick={() => onControlLeft(options.onDateClick)}>
          2012年05月
        </div>
        <div className="control">
          {isTrue(options.left) && (
            <button className="left" onClick={() => onControlLeft(options.onLeftClick)}>
              {ControlNode(options.left, '←')}
            </button>
          )}
          {isTrue(options.today) && (
            <button className="today" onClick={() => onControlLeft(options.onTodayClick)}>
              {ControlNode(options.left, 'о')}
            </button>
          )}
          {isTrue(options.right) && (
            <button className="right" onClick={() => onControlLeft(options.onRightClick)}>
              {ControlNode(options.left, '→')}
            </button>
          )}
          {isTrue(options.fold) && (
            <button
              className="fold"
              onClick={() => {
                if (panelType === PANEL_TYPE.WEEK) {
                  setPanelType(PANEL_TYPE.MONTH);
                } else {
                  setPanelType(PANEL_TYPE.WEEK);
                }
              }}
            >
              {ControlNode(options.left, '↓')}
            </button>
          )}
        </div>
      </section>
    );
  };

  // 日历 周 面板
  const HeaderWeeks = () => {
    let weeks = HEADER_WEEKS[lang] || HEADER_WEEKS[LANG.ZH];
    if (headerWeeks && isArray(headerWeeks)) weeks = headerWeeks as string[];
    return weeks.map(week => (
      <li className="week" key={week}>
        {week}
      </li>
    ));
  };

  // 日历 天 面板
  useEffect(() => {
    const date = selectType === SELECT_TYPE.SINGLE ? (defaultDate as Date) : NOW;
    initPanelDays(date, date);
  }, []);

  function initPanelDays(mDate: Date, wDate: Date) {
    const monthPanelDateData = constructMonthPanelDateData(mDate);
    const weekPanelDateData = constructWeekPanelDateData(wDate);
    setMonthPanelDays(monthPanelDateData.days);
    setWeekPanelDays(weekPanelDateData.days);
    calendarRef.current.monthPanelDateData = monthPanelDateData;
    calendarRef.current.weekPanelDateData = weekPanelDateData;
  }
  const calendarRef = useRef<any>({});
  const [currentSelectDate, setCurrentSelectDate] = useState<Day>({ date: defaultDate as Date });

  const [screenIndex, setScreenIndex] = useState(0);
  const [weekPanelDays, setWeekPanelDays] = useState<Day[][]>(); // 月日历天数：前月 当月 下月
  const [monthPanelDays, setMonthPanelDays] = useState<Day[][]>(); // 周日历天数：前周 当周 下周
  const weekPanel = panelType === PANEL_TYPE.WEEK; // 月面板
  const days = weekPanel ? weekPanelDays : monthPanelDays; // 三屏日期数据

  const BodyDay = () => {
    const ExtraInfo = (info: ExtraInfo) => {
      if (Array.isArray(info)) {
        Array(info[0])
          .fill('.')
          .map((tag, idx) => {
            if (idx < 3) {
              return <span className={`${info[1]} tag`}>{tag}</span>;
            }
          });
      }
      return info;
    };

    return (
      <div className="container" style={{ transform: `translate3d(${-screenIndex * 100}%, 0, 0)` }}>
        {days?.map((_days, _daysIdx) => {
          const touchMovePositionX = touching ? touchPosition.x : 0;
          return (
            <div
              className="content"
              key={`${_daysIdx} Screen Data`}
              style={{
                transform: `translate3d(${
                  (_daysIdx - 1 + screenIndex + touchMovePositionX) * 100
                }%, 0, 0)`,
                transitionDuration: `${touching ? 0.3 : 0}s`,
              }}
            >
              {_days.map((day, dayIdx) => {
                day = isFunction(formatter) ? formatter(day) : day;
                const {
                  date,
                  text,
                  bottomInfo,
                  topInfo,
                  className,
                  type,
                  otherMonthDayClassName,
                  today,
                } = day;
                // 这个地方 根据 selectType 保留一个 select-list 池子
                const selected = isSame(date, currentSelectDate.date) ? 'selected' : '';
                return (
                  <div
                    className={`cell ${className || ''}`}
                    key={`cell-block-${dayIdx}`}
                    style={{ height: `${rowHeight}px` }}
                    onClick={() => {
                      setCurrentSelectDate(day);
                    }}
                  >
                    <div className="topInfo">{ExtraInfo(topInfo)}</div>
                    <div className={`text ${selected} ${otherMonthDayClassName} ${today}`}>
                      <span className="solar">{text || date.getDate()}</span>
                      {isTrue(lunar) && <span className="lunar">初四</span>}
                    </div>
                    <div className="bottomInfo">{ExtraInfo(bottomInfo)}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const calendarBodyRef = useRef<HTMLElement>(null);
  const positionRef = useRef({ startPosX: 0, startPosY: 0 });
  const [touching, setTouching] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const handleTouchStart = (e: any) => {
    e.stopPropagation();
    const { clientX, clientY } = e.touches[0];
    positionRef.current.startPosX = clientX;
    positionRef.current.startPosY = clientY;
    setTouching(true);
  };
  // { stopPropagation, touches }: TouchEvent<HTMLElement>
  const handleTouchMove = (e: any) => {
    e.stopPropagation();
    const { clientX, clientY } = e.touches[0];
    const movePosX = clientX - positionRef.current.startPosX;
    const movePosY = clientY - positionRef.current.startPosY;
    const calendarBodyWidth = calendarBodyRef.current?.offsetWidth;
    const calendarBodyHeight = calendarBodyRef.current?.offsetHeight;

    if (Math.abs(movePosX) > Math.abs(movePosY)) {
      setTouchPosition({ x: movePosX / (calendarBodyWidth as number), y: 0 });
      console.log('近似左右滑动');
    } else {
      console.log('近似上下滑动');
      setTouchPosition({ y: movePosY / (calendarBodyHeight as number), x: 0 });
    }
  };
  const handleTouchEnd = (e: any) => {
    e.stopPropagation();
    setTouching(false);
    const { x, y } = touchPosition; // 左： -  右： +
    const slidingStep = x > 0 ? -1 : 1; // 左右滑动步数

    const { dateMonthBegin } = calendarRef.current.monthPanelDateData;
    const { dateWeekBegin } = calendarRef.current.weekPanelDateData;
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 0.2) {
      setScreenIndex(screenIndex + slidingStep);

      if (panelType === PANEL_TYPE.MONTH) {
        const dateNextMonthBegin = add({
          unit: DATE_UNIT.MONTH,
          date: dateMonthBegin,
          num: slidingStep,
        }); // 依据当前日期的首日，加或减一个月

        const dateNextWeekBegin = add({
          date: dateWeekBegin,
          num: slidingStep,
        }); // 依据当前日期周的首日，加或减一周

        initPanelDays(dateNextMonthBegin, dateNextWeekBegin);
      } else {
      }
    }
    setTouchPosition({ x: 0, y: 0 });
  };

  return (
    <section className={PREFIX_CLS}>
      <header className={`${PREFIX_CLS}__header`}>
        {title && <section className={`${PREFIX_CLS}__header--title`}>{title}</section>}
        {ControlPanel()}
      </header>
      <main className={`${PREFIX_CLS}__main`}>
        <header className={`${PREFIX_CLS}__main--header`}>{HeaderWeeks()}</header>
        <section
          className={`${PREFIX_CLS}__main--body`}
          style={{ height: `${+rowHeight * (weekPanel ? 1 : 6)}px` }}
          ref={calendarBodyRef}
          onTouchStart={handleTouchStart}
          onTouchMove={throttle(handleTouchMove)}
          onTouchEnd={handleTouchEnd}
        >
          {BodyDay()}
        </section>
      </main>
    </section>
  );
};

export default Calendar;
