import { createSignal, For, Show } from "solid-js";

import { useViewModelStore } from "@/hooks";
import { Button, Popover, ScrollView } from "@/components/ui";

import { ClockEditorModel } from "@/biz/clock/editor";

export function ClockEditorSmallView(props: { store: ClockEditorModel }) {
  const [state, vm] = useViewModelStore(props.store);

  const num_width = 12;
  const char_width = 8;

  return (
    <>
      <div class="">
        <div
          classList={{
            "flex items-center gap-2 text-w-fg-0": true,
            "text-xl": true,
          }}
        >
          <div
            class="flex items-center p-2 rounded-lg border-2 border-w-fg-3 cursor-pointer"
            onClick={(event) => {
              const { x, y } = event.currentTarget.getBoundingClientRect();
              vm.ui.$select_year.toggle({ x, y });
            }}
          >
            <div
              classList={{
                "text-center cursor-pointer": true,
              }}
              style={{
                width: `${num_width * 4}px`,
              }}
            >
              {state().year}
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${char_width}px`,
              }}
            >
              /
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${num_width * 2}px`,
              }}
            >
              {state().month_text}
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${char_width}px`,
              }}
            >
              /
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${num_width * 2}px`,
              }}
            >
              {state().date_text}
            </div>
          </div>
          <div class="flex items-center">
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${num_width * 2}px`,
              }}
            >
              {state().hour_text}
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${char_width}px`,
              }}
            >
              :
            </div>
            <div>
              <div
                classList={{
                  "text-center": true,
                }}
                style={{
                  width: `${num_width * 2}px`,
                }}
              >
                {state().minute_text}
              </div>
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${char_width}px`,
              }}
            >
              :
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${num_width * 2}px`,
              }}
            >
              {state().second_text}
            </div>
            {/* <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${char_width}px`,
              }}
            >
              .
            </div>
            <div
              classList={{
                "text-center": true,
              }}
              style={{
                width: `${num_width * 3}px`,
              }}
            >
              {state().ms}
            </div> */}
          </div>
        </div>
      </div>
      <Popover store={vm.ui.$select_year}>
        <div>
          <div class="flex h-[240px]">
            <div class="year w-[120px] h-full overflow-y-auto">
              <For each={state().options_year}>
                {(v) => {
                  return (
                    <div
                      classList={{
                        "p-2 cursor-pointer": true,
                        "bg-w-bg-5": v.selected,
                      }}
                      onClick={() => {
                        vm.methods.selectYear(v.value);
                      }}
                    >
                      {v.label}
                    </div>
                  );
                }}
              </For>
            </div>
            <div class="month w-[120px] h-full overflow-y-auto">
              <ScrollView store={vm.ui.$view_month}>
                <For each={state().options_month}>
                  {(v) => {
                    return (
                      <div
                        classList={{
                          "p-2 cursor-pointer": true,
                          "bg-w-bg-5": v.selected,
                        }}
                        onClick={() => {
                          vm.methods.selectMonth(v.value);
                        }}
                      >
                        {v.label}
                      </div>
                    );
                  }}
                </For>
              </ScrollView>
            </div>
            <div class="date w-[120px] h-full overflow-y-auto">
              <ScrollView store={vm.ui.$view_date}>
                <For each={state().options_date}>
                  {(v) => {
                    return (
                      <div
                        classList={{
                          "p-2 cursor-pointer": true,
                          "bg-w-bg-5": v.selected,
                        }}
                        onClick={() => {
                          vm.methods.selectDate(v.value);
                        }}
                      >
                        {v.label}
                      </div>
                    );
                  }}
                </For>
              </ScrollView>
            </div>
          </div>
          <div class="p-2 border-t-2 border-w-fg-3">
            <div class="flex gap-2">
              <Button store={vm.ui.$btn_confirm_year}>确定</Button>
              <Button store={vm.ui.$btn_set_today}>今天</Button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}
