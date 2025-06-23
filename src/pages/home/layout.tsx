/**
 * @file 后台/首页布局
 */
import { For, JSX, createSignal } from "solid-js";
import { Users, Home, Bike, BicepsFlexed, User, Star, Boxes, Calendar } from "lucide-solid";

import { $time } from "@/store";
import { pages } from "@/store/views";
import { ViewComponent, ViewComponentProps } from "@/store/types";
import { PageKeys } from "@/store/routes";
import { useViewModel } from "@/hooks";
import { Show } from "@/packages/ui/show";
import { KeepAliveRouteView, Popover } from "@/components/ui";

import { base, Handler } from "@/domains/base";
import { ClockModel } from "@/biz/clock/clock";
import { ClockEditorView } from "@/components/clock-editor";
import { ClockEditorModel } from "@/biz/clock/editor";
import { CalendarModel } from "@/domains/ui/calendar";
import { PopoverCore } from "@/domains/ui";
import { IconButton } from "@/components/icon-btn/icon-btn";

function HomeLayoutViewModel(props: ViewComponentProps) {
  const request = {};
  const methods = {
    refresh() {
      bus.emit(Events.StateChange, { ..._state });
    },
  };
  const ui = {
    $clock: ClockEditorModel({ $clock: $time }),
    $popover_calendar: new PopoverCore({}),
    $calendar: CalendarModel({
      today: $time.$dayjs.toDate(),
    }),
  };

  const _menus: { text: string; badge?: boolean; url?: PageKeys; onClick?: () => void }[] = [
    {
      text: "首页",
      url: "root.home_layout.index",
    },
    {
      text: "format",
      url: "root.home_layout.format",
    },
    {
      text: "startOf",
      url: "root.home_layout.start_of",
    },
    {
      text: "endOf",
      url: "root.home_layout.end_of",
    },
    {
      text: "add",
      url: "root.home_layout.add",
    },
    {
      text: "subtract",
      url: "root.home_layout.subtract",
    },
    {
      text: "set",
      url: "root.home_layout.set",
    },
    {
      text: "isBefore",
      url: "root.home_layout.is_before",
    },
  ];

  let _route_name: PageKeys = "root.home_layout.index";
  let _state = {
    get views() {
      return props.view.subViews;
    },
    get menus() {
      return _menus.map((v) => {
        return {
          ...v,
          selected: v.url === _route_name,
        };
      });
    },
    get cur_route_name() {
      return _route_name;
    },
    get calendar() {
      return ui.$calendar.state;
    },
  };
  enum Events {
    StateChange,
  }
  type TheTypesOfEvents = {
    [Events.StateChange]: typeof _state;
  };
  const bus = base<TheTypesOfEvents>();

  props.view.onSubViewsChange((v) => {
    methods.refresh();
  });
  props.view.onCurViewChange((nextCurView) => {
    methods.refresh();
  });
  props.history.onRouteChange(({ name }) => {
    _route_name = name as PageKeys;
    methods.refresh();
  });
  ui.$clock.onStateChange(() => {
    ui.$calendar.setToday(ui.$clock.ui.$clock.$dayjs.toDate());
  });

  return {
    ui,
    methods,
    state: _state,
    ready() {
      bus.emit(Events.StateChange, { ..._state });
    },
    destroy() {
      bus.destroy();
    },
    onStateChange(handler: Handler<TheTypesOfEvents[Events.StateChange]>) {
      return bus.on(Events.StateChange, handler);
    },
  };
}

export const HomeLayout: ViewComponent = (props) => {
  const [state, vm] = useViewModel(HomeLayoutViewModel, [props]);

  return (
    <>
      <div class="flex w-full h-full bg-w-bg-0">
        <div class="w-[248px] py-4 pl-2 pr-2 border-r border-w-bg-5">
          <div class="px-4">
            <ClockEditorView store={vm.ui.$clock}></ClockEditorView>
            <div class="flex items-center gap-2 py-4">
              <IconButton
                onClick={(event) => {
                  const { x, y } = event.currentTarget.getBoundingClientRect();
                  vm.ui.$popover_calendar.toggle({ x, y });
                }}
              >
                <Calendar class="w-6 h-6 text-w-fg-0" />
              </IconButton>
            </div>
          </div>
          <div class="flex flex-col justify-between mt-8">
            <div class="flex-1 space-y-1 w-full h-full overflow-y-auto rounded-xl self-start">
              <For each={state().menus}>
                {(menu) => {
                  const { text, url, badge, selected, onClick } = menu;
                  return (
                    <Menu
                      app={props.app}
                      history={props.history}
                      highlight={selected}
                      url={url}
                      badge={badge}
                      onClick={() => {
                        if (url) {
                          props.history.push(url);
                          return;
                        }
                        if (onClick) {
                          onClick();
                        }
                      }}
                    >
                      {text}
                    </Menu>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
        <div class="flex-1 flex flex-col relative">
          <div class="w-full h-full">
            <For each={state().views}>
              {(view, i) => {
                const routeName = view.name;
                const PageContent = pages[routeName as Exclude<PageKeys, "root">];
                return (
                  <KeepAliveRouteView
                    classList={{
                      "absolute inset-0": true,
                      "data-[state=open]:animate-in data-[state=open]:fade-in": true,
                      "data-[state=closed]:animate-out data-[state=closed]:fade-out": true,
                    }}
                    store={view}
                    app={props.app}
                    index={i()}
                  >
                    <PageContent
                      app={props.app}
                      client={props.client}
                      storage={props.storage}
                      pages={pages}
                      history={props.history}
                      view={view}
                    />
                  </KeepAliveRouteView>
                );
              }}
            </For>
          </div>
        </div>
      </div>
      <Popover store={vm.ui.$popover_calendar}>
        <div class="p-4">
          <div class="text-lg text-w-fg-0 text-center">{state().calendar.month.text}</div>
          <div class="grid grid-cols-7 gap-2 mt-4">
            <For each={["周一", "周二", "周三", "周四", "周五", "周六", "周日"]}>
              {(t) => {
                return <div class="text-center text-sm text-w-fg-1">{t}</div>;
              }}
            </For>
          </div>
          <For each={state().calendar.weeks}>
            {(week) => {
              return (
                <div class="grid grid-cols-7 gap-2">
                  <For each={week.dates}>
                    {(date) => {
                      return (
                        <div
                          classList={{
                            "relative p-2 rounded-md": true,
                            "opacity-40": date.is_next_month || date.is_prev_month,
                            "bg-w-bg-5": date.is_today,
                          }}
                        >
                          <div class="text-center text-sm text-w-fg-0">{date.text}</div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              );
            }}
          </For>
        </div>
      </Popover>
    </>
  );
};

function Menu(
  props: Pick<ViewComponentProps, "app" | "history"> & {
    highlight?: boolean;
    url?: PageKeys;
    badge?: boolean;
  } & JSX.HTMLAttributes<HTMLDivElement>
) {
  const inner = (
    <div
      classList={{
        "relative flex items-center px-4 py-2 space-x-2 rounded-lg opacity-80 cursor-pointer hover:bg-w-bg-5": true,
        "bg-w-bg-5": props.highlight,
      }}
      onClick={props.onClick}
    >
      {/* <div class="w-6 h-6">{props.icon}</div> */}
      <div class="flex-1 text-lg text-w-fg-0">
        <div class="relative inline-block">
          {props.children}
          <Show when={props.badge}>
            <div class="absolute right-[-8px] top-0 w-2 h-2 rounded-full bg-red-500" />
          </Show>
        </div>
      </div>
    </div>
  );
  return (
    <Show when={props.url} fallback={inner}>
      <div
        onClick={() => {
          if (!props.url) {
            return;
          }
          props.history.push(props.url);
          // props.app.showView(props.view);
        }}
      >
        {inner}
      </div>
    </Show>
  );
}
