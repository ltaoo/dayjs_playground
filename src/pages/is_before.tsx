/**
 * @file isBefore 函数
 */
import { For, Show } from "solid-js";
import { BicepsFlexed, Check, Coffee, X } from "lucide-solid";
import dayjs from "dayjs";

import { ViewComponentProps } from "@/store/types";
import { useViewModel } from "@/hooks";
import { PageView } from "@/components/page-view";

import { base, Handler } from "@/domains/base";
import { ButtonCore, DialogCore, ScrollViewCore } from "@/domains/ui";
import { CalendarModel } from "@/domains/ui/calendar";
import { ListCore } from "@/domains/list";
import { TabHeaderCore } from "@/domains/ui/tab-header";
import { Result } from "@/domains/result";
import { ClockModel } from "@/biz/clock/clock";
import { ClockEditorSmallView } from "@/components/clock-editor-small";
import { ClockEditorModel } from "@/biz/clock/editor";
import { $time } from "@/store";

function isBeforeFunctionModel(props: ViewComponentProps) {
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
    $input_time: ClockEditorModel({
      $clock: ClockModel({
        time: new Date().valueOf(),
      }),
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
      desc: "用于获取指定时间当年的第一天",
      functions: ["y", "year", "years"],
    },
    {
      title: "",
      desc: "",
      functions: ["M", "month", "months"],
    },
    {
      title: "",
      desc: "",
      functions: ["D", "date", "dates"],
    },
    {
      title: "",
      desc: "",
      functions: ["d", "day", "days"],
    },
    {
      title: "",
      desc: "",
      functions: ["w", "week", "weeks"],
    },
    {
      title: "",
      desc: "",
      functions: ["h", "hour", "hours"],
    },
    {
      title: "",
      desc: "",
      functions: ["m", "minute", "minutes"],
    },
    {
      title: "",
      desc: "",
      functions: ["s", "second", "seconds"],
    },
    {
      title: "",
      desc: "",
      functions: ["ms", "millisecond", "milliseconds"],
    },
  ];

  const _state = {
    get content() {
      return _content.map((arg) => {
        return {
          title: arg.title,
          desc: arg.desc,
          functions: arg.functions.map((v) => {
            const t = ui.$input_time.state.value.format("YYYY-MM-DD HH:mm:ss");
            return {
              text: `isBefore("${t}", "${v}")`,
              v: ui.$clock.methods.isBefore(ui.$input_time.state.value, v),
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

  ui.$input_time.onStateChange(() => methods.refresh());

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

export const isBeforeFunctionView = (props: ViewComponentProps) => {
  const [state, vm] = useViewModel(isBeforeFunctionModel, [props]);

  return (
    <>
      <PageView store={vm}>
        <div class="text-3xl text-w-fg-0">isBefore</div>
        <div class="mt-8">
          <ClockEditorSmallView store={vm.ui.$input_time}></ClockEditorSmallView>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-4">
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
                            <Show when={vv.v} fallback={<X class="w-4 h-4 text-red-500"></X>}>
                              <Check class="w-4 h-4 text-green-500"></Check>
                            </Show>
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
