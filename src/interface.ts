import { ReactNode } from 'react';

type TagType = 'primary' | 'success' | 'error' | 'warning';
export type TagInfo = [number, TagType];
export type ExtraInfo = StringNode | TagInfo;

export interface Day {
  date: Date; // 日期对应的 Date 对象
  type?: string; // 日期类型，可选值为selected、start、middle、end、disabled
  topInfo?: ExtraInfo; // 上方的提示信息
  text?: string | number; // 中间显示的文字
  bottomInfo?: ExtraInfo; //下方的提示信息
  className?: string; //额外类名
  today?: string; // 是否是今天
  otherMonthDayClassName?: string;
}

export type StringNode = string | ReactNode;
export type ControlNode<T = boolean> = T | ReactNode;

export interface ControlPanelConfig {
  left?: ControlNode;
  onLeftClick?: () => void;
  today?: ControlNode;
  onTodayClick?: () => void;
  right?: ControlNode;
  onRightClick?: () => void;
  fold?: ControlNode;
  onFoldClick?: () => void;
  date?: (date: Date) => ControlNode<string>; // 日期显示，常用于格式化，默认显示月份 2021年05月
  onDateClick?: (date: Date, fullYears: Date[], fullYearsPanel: ReactNode) => void; // 日期点击事件，
}

// 控制面板，默认，true
// true: ControlPanelConfig, 注意：date 字段为：format(defaultDate, 'YYYY-MM')
// false: 不显示
// ControlPanelConfig: 定制显示，会和 true 对应的配置合并
type ControlPanel = boolean | ControlPanelConfig;

type SelectType = 'single' | 'multiple' | 'range'; // 选择: 单个日期 | 多个日期 | 日期区间
type PanelType = 'week' | 'month'; // 周、月
type HeaderWeeks = [
  StringNode,
  StringNode,
  StringNode,
  StringNode,
  StringNode,
  StringNode,
  StringNode
];

export interface CalendarProps {
  lang?: 'en' | 'zh'; // 语言，主要针对头部 周
  lunar?: boolean; // 是否展示农历，默认：false, （暂不支持）
  headerWeeks?: HeaderWeeks; // 默认根据 lang 选择，也可自定义
  formatter?: (date: Day) => Day; // 日期格式化函数

  rowHeight?: number | string; // 日期行高

  title?: string; // 日历标题
  header?: ReactNode; // 头部区域 (完全自定义)
  // |       日期看板组件 (title)         |
  // | 2021年05月   ←  о  →   ↓          |
  // |                                  |
  controlPanel?: ControlPanel; // 日期 左 今 右 折
  controlPanelPosition?: 'left' | 'right';

  type?: PanelType; // 面板展示类型: 周、月
  gestureFold?: boolean; // 是否开启手势切换面板类型（即折叠日历 周 <-> 月） 默认,true 开启后，忽略 ControlPanelConfig.fold 参数
  onFold?: () => void; // 响应面板折叠，对应的是 类型切换

  onSlidingAroundStart?: () => void; // 响应左右滑动开始
  onSlidingAroundEnd?: () => void; // 响应左右滑动结束

  defaultDate?: Date | Date[]; // 默认选中的日期, 默认 今天
  selectType?: SelectType; // 日期选择类型
  minSelectableDate?: Date | null; // 可选择的最小日期，默认：null 不限制
  maxSelectableDate?: Date | null; // 可选择的最大日期，默认：null 不限制
  onSelect?: (date: Date | Date[]) => void; // 响应日期选择
}

// 需要暴露的方法
// reset: 将选中的日期重置到指定日期，未传参时会重置到 defaultDate
// reset: (date) => setCurrentDate(date)
