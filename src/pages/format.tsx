/**
 * @file format 函数
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

function FormatFunctionModel(props: ViewComponentProps) {
  const request = {};
  const methods = {
    refresh() {
      bus.emit(Events.StateChange, { ..._state });
    },
    back() {
      props.history.back();
    },
  };
  const _$now = new Date();
  const _$dayjs = dayjs(_$now);
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
    functions: string[];
  }[] = [
    {
      title: "",
      desc: "",
      functions: ["YYYY-MM-DD HH:mm:ss"],
    },
    {
      title: "",
      desc: "",
      functions: ["YY", "YYYY"],
    },
    {
      title: "",
      desc: "",
      functions: ["M", "MM", "MMM", "MMMM"],
    },
    {
      title: "",
      desc: "",
      functions: ["D", "DD"],
    },
    {
      title: "",
      desc: "",
      functions: ["H", "HH", "h", "hh"],
    },
    {
      title: "",
      desc: "",
      functions: ["m", "mm"],
    },
    {
      title: "",
      desc: "",
      functions: ["s", "ss", "S", "SS", "SSS"],
    },
    {
      title: "",
      desc: "",
      functions: ["Z", "ZZ"],
    },
    {
      title: "",
      desc: "",
      functions: ["A", "a"],
    },
    {
      title: "",
      desc: "",
      functions: ["Do"],
    },
    {
      title: "",
      desc: "",
      functions: ["X", "x"],
    },
  ];

  const _state = {
    get content() {
      return _content.map((arg) => {
        return {
          title: arg.title,
          desc: arg.desc,
          functions: arg.functions.map((v) => {
            return {
              text: `format("${v}")`,
              v: ui.$clock.methods.format(v),
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

export const FormatFunctionView = (props: ViewComponentProps) => {
  const [state, vm] = useViewModel(FormatFunctionModel, [props]);

  return (
    <>
      <PageView store={vm}>
        <div class="text-3xl text-w-fg-0">format</div>
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
