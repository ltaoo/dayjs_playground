import { base, BaseDomain, Handler } from "@/domains/base";

import { getMonthWeeks, getWeeksInMonth } from "./utils";
import dayjs from "dayjs";
import { padding_zero } from "@/utils";

type CalendarWeek = {
  id: number;
  dates: {
    id: number;
    text: string;
    yyyy: string;
    value: Date;
    time: number;
    is_prev_month: boolean;
    is_next_month: boolean;
    is_today: boolean;
  }[];
};
type CalendarCoreProps = {
  today: Date;
};

export function CalendarModel(props: CalendarCoreProps) {
  // const { today } = props;
  const methods = {
    refresh() {
      bus.emit(Events.StateChange, { ..._state });
    },
  };

  function buildMonthText(d: Date) {
    //     const year = d.getFullYear();
    const month = d.getMonth() + 1;
    return `${month}月`;
  }
  function refreshWeeksOfMonth(d: Date) {
    _weeks = [];
    const r = getMonthWeeks(d, {
      locale: {
        code: "",
      },
      weekStartsOn: 1,
    });
    for (let i = 0; i < r.length; i += 1) {
      const { dates } = r[i];
      let include_today = false;
      const week = {
        id: i,
        dates: dates.map((date, i) => {
          // console.log(date.getDate(), date.valueOf(), date.toLocaleString());
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          const is_today = date.valueOf() === d.valueOf();
          if (is_today) {
            include_today = true;
          }
          return {
            id: i,
            text: date.getDate().toString(),
            yyyy: (() => {
              const y = date.getFullYear();
              const m = padding_zero(date.getMonth() + 1);
              const d = padding_zero(date.getDate());
              return `${y}-${m}-${d}`;
            })(),
            is_prev_month: date.getMonth() < d.getMonth(),
            is_next_month: date.getMonth() > d.getMonth(),
            is_today,
            value: date,
            time: date.valueOf(),
          };
        }),
      };
      _weeks.push(week);
      if (include_today) {
        _weekdays = week.dates;
      }
    }
  }

  let _today = props.today;

  function refreshToday() {
    _today.setHours(0);
    _today.setMinutes(0);
    _today.setSeconds(0);
    _today.setMilliseconds(0);

    return {
      day: {
        text: _today.getDate().toString(),
        value: _today,
        time: _today.valueOf(),
      },
      month: {
        /** 12月 */
        text: buildMonthText(_today),
        value: _today,
        time: _today.valueOf(),
      },
      year: {
        // 2024
        text: _today.getFullYear(),
        value: _today,
        time: _today.valueOf(),
      },
      selected: {
        text: _today.toLocaleDateString() + _today.toLocaleTimeString(),
        value: _today,
        time: _today.valueOf(),
      },
    };
  }

  const { day, month, year, selected } = refreshToday();
  let _day = day;
  let _month = month;
  let _year = year;
  let _selectedDay = selected;
  let _weeks: CalendarWeek[] = [];
  let _weekdays: CalendarWeek["dates"] = [];
  refreshWeeksOfMonth(_today);

  let _state = {
    get day() {
      return _day;
    },
    get month() {
      return _month;
    },
    get year() {
      return _year;
    },
    get weekdays() {
      return _weekdays;
    },
    get weeks() {
      return _weeks;
    },
    get selectedDay() {
      return _selectedDay;
    },
  };

  enum Events {
    SelectDay,
    StateChange,
  }
  type TheTypesOfEvents = {
    [Events.SelectDay]: Date;
    [Events.StateChange]: typeof _state;
  };
  const bus = base<TheTypesOfEvents>();

  return {
    state: _state,
    get value() {
      return _selectedDay ? _selectedDay.value : null;
    },
    selectDay(day: Date) {
      //       console.log("[DOMAIN]ui/calendar - selectDay");
      if (_day.value === day) {
        return;
      }
      day.setHours(0);
      day.setMinutes(0);
      day.setSeconds(0);
      day.setMilliseconds(0);
      _day = {
        text: day.getDate().toString(),
        value: day,
        time: day.valueOf(),
      };
      bus.emit(Events.SelectDay, day);
      if (_selectedDay) {
        const prevYear = _selectedDay.value.getFullYear();
        const year = day.getFullYear();
        const prevMonth = _selectedDay.value.getMonth();
        const month = day.getMonth();
        // console.log("[BIZ]check need refresh", prevYear, prevMonth, year, month);
        if (prevYear !== year || prevMonth !== month) {
          _month = {
            text: buildMonthText(day),
            value: day,
            time: day.valueOf(),
          };
          _year = {
            text: day.getFullYear(),
            value: day,
            time: day.valueOf(),
          };
          refreshWeeksOfMonth(day);
        }
      }
      _selectedDay = {
        text: day.toLocaleDateString() + day.toLocaleTimeString(),
        value: day,
        time: day.valueOf(),
      };
      bus.emit(Events.StateChange, { ..._state });
    },
    nextMonth() {},
    prevMonth() {},
    setToday(v: Date) {
      _today = v;
      const { day, month, year, selected } = refreshToday();
      _day = day;
      _month = month;
      _year = year;
      _selectedDay = selected;
      refreshWeeksOfMonth(_today);
      methods.refresh();
    },
    buildMonthText,
    onSelectDay(handler: Handler<TheTypesOfEvents[Events.SelectDay]>) {
      return bus.on(Events.SelectDay, handler);
    },
    onStateChange(handler: Handler<TheTypesOfEvents[Events.StateChange]>) {
      return bus.on(Events.StateChange, handler);
    },
  };
}

export type CalendarModel = ReturnType<typeof CalendarModel>;
