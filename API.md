# Calendar API

```jsx
import React from "react";
import Calendar from "calendar";

// 需要暴露的方法
// 将选中的日期重置到指定日期，未传参时会重置到 defaultDate
// reset: (date) => setCurrentDate(date)

interface Day {
  date: Date; // 日期对应的 Date 对象 Date
  type: string; // 日期类型，可选值为selected、start、middle、end、disabled
  topInfo: string; // 上方的提示信息
  text: string; // 中间显示的文字
  bottomInfo: string; // 下方的提示信息
  className: string; //额外类名
}

interface IProps {
  /*** HEADER AREA ***/
  title: string; // 日历标题
  header: React.Element; // 头部区域 (完全自定义)
  // |            日期看板组件            |
  // | 2021年05月12日  <  今  >    ----- |
  // |                                  |
  // 左右今天控制面板
  controlPanel: boolean | null |
                {
                  right: boolean | React.Element,
                  left: boolean | React.Element,
                  today: boolean | React.Element,
                  toggle: boolean | React.Element,
                };
  // 控制面板位置，默认 left
  controlPanelPosition: 'left' | 'right';
  // 响应面板展示类型切换
  onTypeToggle: () => void;
  // 是否开启手势切换面板类型, 默认: true 对应 controlPanel.toggle === false
  gestureTypeToggle: boolean;

  /*** BODY AREA ***/
  lunar: boolean; // 是否展示农历，默认：false, （暂不支持）
  // 面板展示类型：周、月
  type: 'week' | 'month';
  // 日期行高
  rowHeight: number | string;
  // 日期格式化函数
  formatter: (date: Day) => Day;
  // 响应左右滑动开始
  onSlidingAroundStart: () => void;
  // 响应左右滑动结束
  onSlidingAroundEnd: () => void;

  /*** SELECT AREA ***/
  // 选择类型
  // single 表示选择单个日期，multiple表示选择多个日期，range表示选择日期区间
  selectType: 'single' | 'multiple' | 'range';
  // 默认选中的日期
  // type 为 multiple 或 range 时为数组，传入 null 表示默认不选择
  // type 为 single，默认选择今天
  defaultDate: Date | Date[] | null;
  // 可选择的最小日期
  minSelectableDate: Date | null;
  // 可选择的最大日期
  maxSelectableDate: Date | null;
  // 响应日期选择
  onSelect: date: Date | Date[] => void;
}

function Example(props: IProps) {
  return <Calendar onSelect={date => date}/>;
}

export default Example;
```
