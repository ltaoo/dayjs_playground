/**
 * @file 首页
 */
import { For, Show } from "solid-js";
import { BicepsFlexed, Check, Coffee } from "lucide-solid";
import dayjs from "dayjs";

import { ViewComponentProps } from "@/store/types";
import { useViewModel } from "@/hooks";

import { base, Handler } from "@/domains/base";
import { ButtonCore, DialogCore, ScrollViewCore } from "@/domains/ui";
import { CalendarCore } from "@/domains/ui/calendar";
import { ListCore } from "@/domains/list";
import { TabHeaderCore } from "@/domains/ui/tab-header";
import { Result } from "@/domains/result";
import { TheItemTypeFromListCore } from "@/domains/list/typing";

const WeekdayChineseTextArr = ["一", "二", "三", "四", "五", "六", "日"];

function HomeIndexPageViewModel(props: ViewComponentProps) {
  const request = {};
  const methods = {
    refresh() {
      bus.emit(Events.StateChange, { ..._state });
    },
  };
  const ui = {
    $view: new ScrollViewCore({}),
    $tab: new TabHeaderCore({
      options: [
        {
          id: 1,
          text: "推荐",
        },
        {
          id: 2,
          text: "HIIT",
        },
        {
          id: 3,
          text: "五分化",
        },
      ] as { id: number; text: string }[],
      // onMounted() {
      //   ui.$tab.selectById(1);
      // },
      onChange(value) {
        // props.history.push(value.id);
        methods.refresh();
      },
    }),
    $calendar: CalendarCore({
      today: new Date(),
    }),
  };

  const _state = {};
  enum Events {
    StateChange,
  }
  type TheTypesOfEvents = {
    [Events.StateChange]: typeof _state;
  };
  const bus = base<TheTypesOfEvents>();

  return {
    methods,
    ui,
    state: _state,
    async ready() {},
    destroy() {
      bus.destroy();
    },
    onStateChange(handler: Handler<TheTypesOfEvents[Events.StateChange]>) {
      return bus.on(Events.StateChange, handler);
    },
  };
}

export const HomeIndexPage = (props: ViewComponentProps) => {
  const [state, vm] = useViewModel(HomeIndexPageViewModel, [props]);

  return <></>;
};
