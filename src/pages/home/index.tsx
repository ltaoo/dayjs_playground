/**
 * @file 首页
 */
import { For, Show } from "solid-js";
import { BicepsFlexed, Check, Coffee } from "lucide-solid";
import dayjs from "dayjs";

import { PageKeys, ViewComponentProps } from "@/store/types";
import { useViewModel } from "@/hooks";
import { PageView } from "@/components/page-view";

import { base, Handler } from "@/domains/base";
import { ButtonCore, DialogCore, ScrollViewCore } from "@/domains/ui";
import { CalendarModel } from "@/domains/ui/calendar";
import { ListCore } from "@/domains/list";
import { TabHeaderCore } from "@/domains/ui/tab-header";
import { Result } from "@/domains/result";

function HomeIndexPageViewModel(props: ViewComponentProps) {
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
  };
  const _state = {
    get functions(): { text: string; url: PageKeys }[] {
      return [
        {
          text: "StartOf",
          url: "root.home_layout.start_of",
        },
      ];
    },
  };
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

  return (
    <>
      <PageView store={vm}>
        <div class="p-4">
          <div class="text-6xl text-w-fg-0">dayjs Playground</div>
        </div>
      </PageView>
    </>
  );
};
