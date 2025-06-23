/**
 * @file set 函数
 */
import { For, Show } from "solid-js";
import { BicepsFlexed, Check, Coffee } from "lucide-solid";
import dayjs from "dayjs";

import { $time } from "@/store";
import { ViewComponentProps } from "@/store/types";
import { useViewModel } from "@/hooks";
import { PageView } from "@/components/page-view";

import { base, Handler } from "@/domains/base";
import { ButtonCore, DialogCore, InputCore, ScrollViewCore } from "@/domains/ui";
import { CalendarModel } from "@/domains/ui/calendar";
import { ListCore } from "@/domains/list";
import { TabHeaderCore } from "@/domains/ui/tab-header";
import { Result } from "@/domains/result";
import { ClockModel } from "@/biz/clock/clock";
import { Button, Input } from "@/components/ui";

function SetFunctionModel(props: ViewComponentProps) {
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
    $input_value: new InputCore({ defaultValue: 1, type: "number" }),
    $btn_value_apply: new ButtonCore({
      onClick() {
        const vv = ui.$input_value.value;
        if (vv === undefined) {
          return;
        }
        _value = vv;
        methods.refresh();
      },
    }),
  };

  let _value = 1;
  const content: {
    title: string;
    desc: string;
    functions: dayjs.UnitType[];
  }[] = [
    {
      title: "",
      desc: `将年设置为%v`,
      functions: ["y", "year", "years"],
    },
    {
      title: "",
      desc: `将月设置为%v`,
      functions: ["M", "month", "months"],
    },
    {
      title: "",
      desc: `将日期设置为%v`,
      functions: ["D", "date", "dates"],
    },
    {
      title: "",
      desc: `将day设置为%v`,
      functions: ["d", "day", "days"],
    },
    // {
    //   title: "",
    //   desc: "增加一周时间",
    //   functions: ["w", "week", "weeks"],
    // },
    {
      title: "",
      desc: `将小时设置为%v`,
      functions: ["h", "hour", "hours"],
    },
    {
      title: "",
      desc: `将分钟设置为%v`,
      functions: ["m", "minute", "minutes"],
    },
    {
      title: "",
      desc: `将秒设置为%v`,
      functions: ["s", "second", "seconds"],
    },
    // {
    //   title: "",
    //   desc: "",
    //   functions: ["ms", "millisecond", "milliseconds"],
    // },
  ];

  const _state = {
    get startOfFunctions() {
      return content.map((arg) => {
        return {
          title: arg.title,
          desc: arg.desc.replace(/%v/, String(_value)),
          functions: arg.functions.map((v) => {
            return {
              text: `set(${_value}, "${v}")`,
              v: ui.$clock.methods.set(v, _value).format("YYYY-MM-DD HH:mm:ss"),
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

export const SetFunctionView = (props: ViewComponentProps) => {
  const [state, vm] = useViewModel(SetFunctionModel, [props]);

  return (
    <>
      <PageView store={vm}>
        <div class="text-3xl text-w-fg-0">set</div>
        <div class="flex items-center gap-2 mt-8">
          <div class="w-[120px]">
            <Input store={vm.ui.$input_value}></Input>
          </div>
          <Button store={vm.ui.$btn_value_apply}>设置</Button>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4">
          <For each={state().startOfFunctions}>
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
