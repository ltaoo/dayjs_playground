import { Check } from "lucide-solid";
import { JSX } from "solid-js/jsx-runtime";

import * as CheckboxPrimitive from "@/packages/ui/checkbox";

import { CheckboxCore } from "@/domains/ui/checkbox";

export function Checkbox(props: { store: CheckboxCore } & JSX.HTMLAttributes<HTMLDivElement>) {
  const { id, store } = props;
  return (
    <CheckboxPrimitive.Root
      id={id}
      class="peer h-4 w-4 shrink-0 rounded-sm border border-black ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
      store={store}
    >
      <CheckboxPrimitive.Indicator store={store} class="flex items-center justify-center text-current">
        <Check class="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
