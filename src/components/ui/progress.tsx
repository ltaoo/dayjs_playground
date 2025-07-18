/**
 * @file 进度条
 */
import { JSX, createSignal } from "solid-js";

import { ProgressCore } from "@/domains/ui/progress";

const Progress = (props: { store: ProgressCore } & JSX.HTMLAttributes<HTMLElement>) => {
  const { store } = props;

  const [state, setState] = createSignal(store.state);
  store.onStateChange((nextState) => {
    setState(nextState);
  });

  return (
    <div
      class={props.class}
      classList={{
        "relative h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800": true,
      }}
    >
      <div
        class="h-full w-full flex-1 bg-slate-900 transition-all dark:bg-slate-400"
        style={{ transform: `translateX(-${100 - (state().value || 0)}%)` }}
      />
    </div>
  );
};
// Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
