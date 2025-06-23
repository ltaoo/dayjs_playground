/**
 * @file endOf 函数
 */
import { For, Show } from "solid-js";
import { BicepsFlexed, Check, Coffee } from "lucide-solid";
import dayjs from "dayjs";

import { $time } from "@/store";
import { ViewComponentProps } from "@/store/types";
import { useViewModel } from "@/hooks";
import { PageView } from "@/components/page-view";
import { ClockView } from "@/components/clock";

import { base, Handler } from "@/domains/base";
import { ButtonCore, DialogCore, ScrollViewCore } from "@/domains/ui";
import { CalendarModel } from "@/domains/ui/calendar";
import { ListCore } from "@/domains/list";
import { TabHeaderCore } from "@/domains/ui/tab-header";
import { Result } from "@/domains/result";
import { ClockModel } from "@/biz/clock/clock";

function EndOfFunctionModel(props: ViewComponentProps) {
  const request = {};
  const methods = {
    refresh() {
      bus.emit(Events.StateChange, { ..._state });
    },
    back() {
      props.history.back();
    },
  };
  const ui = {
    $view: new ScrollViewCore({}),
    $history: props.history,
    $calendar: CalendarModel({
      today: new Date(),
    }),
    $clock: $time,
  };

  const _content: {
    title: string;
    desc: string;
    functions: dayjs.OpUnitType[];
  }[] = [
    {
      title: "",
      desc: "获取本年最后一天",
      functions: ["y", "year", "years"],
    },
    {
      title: "",
      desc: "获取本月最后一天",
      functions: ["M", "month", "months"],
    },
    {
      title: "",
      desc: "获取当天最晚时间",
      functions: ["D", "date", "dates"],
    },
    {
      title: "",
      desc: "获取当天最晚时间",
      functions: ["d", "day", "days"],
    },
    {
      title: "",
      desc: "获取本周最后一天",
      functions: ["w", "week", "weeks"],
    },
    {
      title: "",
      desc: "获取当前小时结束时间",
      functions: ["h", "hour", "hours"],
    },
    {
      title: "",
      desc: "获取当前分钟结束时间",
      functions: ["m", "minute", "minutes"],
    },
    {
      title: "",
      desc: "获取当前秒结束时间",
      functions: ["s", "second", "seconds"],
    },
    // {
    //   title: "",
    //   desc: "",
    //   functions: ["ms", "millisecond", "milliseconds"],
    // },
  ];

  const _state = {
    get content() {
      return _content.map((arg) => {
        return {
          title: arg.title,
          desc: arg.desc,
          functions: arg.functions.map((v) => {
            return {
              text: `endOf("${v}")`,
              v: ui.$clock.methods.endOf(v).format("YYYY-MM-DD HH:mm:ss"),
            };
          }),
        };
      });
    },
  };
  enum Events {
    StateChange,
  }
  type TheTypesOfEvents = {
    [Events.StateChange]: typeof _state;
  };
  const bus = base<TheTypesOfEvents>();

  ui.$clock.onStateChange(() => methods.refresh());

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

export const EndOfFunctionView = (props: ViewComponentProps) => {
  const [state, vm] = useViewModel(EndOfFunctionModel, [props]);

  return (
    <>
      <PageView store={vm}>
        <div class="text-3xl text-w-fg-0">endOf</div>
        <div class="grid grid-cols-4 gap-2 mt-8">
          <For each={state().content}>
            {(v) => {
              return (
                <div class="p-4 rounded-lg border-2 border-w-fg-3">
                  {/* <div class="w-[180px] text-xl text-w-fg-1">{v.title}</div> */}
                  <div class="text-xl text-w-fg-0">{v.desc}</div>
                  <div class="space-y-2 mt-4">
                    <For each={v.functions}>
                      {(vv) => {
                        return (
                          <div>
                            <div class="text-lg text-w-fg-0">{vv.text}</div>
                            <div class="text-w-fg-1">{vv.v}</div>
                          </div>
                        );
                      }}
                    </For>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </PageView>
    </>
  );
};
