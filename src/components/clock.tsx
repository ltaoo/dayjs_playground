import { createSignal, Show } from "solid-js";

import { StopWatchViewModel } from "@/biz/stopwatch";
import { ClockModel } from "@/biz/clock/clock";

export function ClockView(props: { store: ClockModel }) {
  //   const [state, vm] = useViewModelStore(props.store);
  const [state, setState] = createSignal(props.store.state);
  //   const [running, setRunning] = createSignal(props.store.state.running);

  let $hours1: undefined | HTMLDivElement;
  let $hours2: undefined | HTMLDivElement;
  let $minutes1: undefined | HTMLDivElement;
  let $minutes2: undefined | HTMLDivElement;
  let $seconds1: undefined | HTMLDivElement;
  let $seconds2: undefined | HTMLDivElement;
  let $ms1: undefined | HTMLDivElement;
  let $ms2: undefined | HTMLDivElement;

  props.store.onStateChange((v) => {
    //     setState({
    //       running: v.running,
    //     });
    //     setRunning(v.running);
    if ($hours1) {
      $hours1.innerText = v.hours1;
    }
    if ($hours2) {
      $hours2.innerText = v.hours2;
    }
    if ($minutes1) {
      $minutes1.innerText = v.minutes1;
    }
    if ($minutes2) {
      $minutes2.innerText = v.minutes2;
    }
    if ($seconds1) {
      $seconds1.innerText = v.seconds1;
    }
    if ($seconds2) {
      $seconds2.innerText = v.seconds2;
    }
    if ($ms1) {
      $ms1.innerText = v.ms1;
    }
    if ($ms2) {
      $ms2.innerText = v.ms2;
    }
  });

  const num_width = 42;
  const char_width = 24;

  return (
    <div>
      <div
        classList={{
          "time-text flex items-center text-w-fg-0 transition-all duration-200": true,
          "text-7xl": true,
        }}
      >
        <div
          ref={$hours1}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().hours1}
        </div>
        <div
          ref={$hours2}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().hours2}
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
          ref={$minutes1}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().minutes1}
        </div>
        <div
          ref={$minutes2}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().minutes2}
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
          ref={$seconds1}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().seconds1}
        </div>
        <div
          ref={$seconds2}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().seconds2}
        </div>
        <div
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
          ref={$ms1}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().ms1}
        </div>
        <div
          ref={$ms2}
          classList={{
            "text-center": true,
          }}
          style={{
            width: `${num_width}px`,
          }}
        >
          {state().ms2}
        </div>
      </div>
    </div>
  );
}
