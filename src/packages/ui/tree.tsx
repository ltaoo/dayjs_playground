import { JSX } from "solid-js/jsx-runtime";

import { TreeCore } from "@/domains/ui/tree";
import { Show, createSignal } from "solid-js";
import { ArrowRight, ChevronRight } from "lucide-solid";

const Root = (props: { store: TreeCore } & JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <ul class={props.class} classList={{ ...props.classList, "ant-tree tree": true }}>
      {props.children}
    </ul>
  );
};
const Leaf = (props: { store: TreeCore } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const [dragOverCls, setDragOverCls] = createSignal("");

  //   let dragOverCls = "";
  //   if (this.disabled) {
  //     //   disabledCls = `${prefixCls}-treenode-disabled`;
  //   } else if (this.dragOver) {
  //     dragOverCls = "drag-over";
  //   } else if (this.dragOverGapTop) {
  //     dragOverCls = "drag-over-gap-top";
  //   } else if (this.dragOverGapBottom) {
  //     dragOverCls = "drag-over-gap-bottom";
  //   }

  return (
    <li classList={{ [dragOverCls()]: true }} class={props.class}>
      {props.children}
    </li>
  );
};

const Switcher = (props: { store: TreeCore } & JSX.HTMLAttributes<HTMLDivElement>) => {
  const { store } = props;
  return (
    <span
      class={props.class}
      classList={{
        "tree__switcher inline-flex items-center": true,
      }}
      onClick={() => {}}
    >
      {props.children}
    </span>
  );
};
const Handler = (props: { store: TreeCore } & JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <span
      class="ant-tree-node-content-wrapper ant-tree-node-content-wrapper-normal draggable"
      data-state="draggable"
      onDragStart={(event) => {
        // ...
      }}
      onDragEnter={(event) => {
        // ...
      }}
      onDragOver={(event) => {
        // ...
      }}
      onDragLeave={(event) => {
        // ...
      }}
      onDragEnd={(event) => {
        // ...
      }}
      onDrop={(event) => {
        // ...
      }}
    >
      {props.children}
    </span>
  );
};
const Content = (props: { store: TreeCore } & JSX.HTMLAttributes<HTMLElement>) => {
  return <span>{props.children}</span>;
};
const Arrow = (props: {} & JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Show when={true}>
      <ChevronRight class="w-6 h-6" />
    </Show>
  );
};

const Sub = (props: { store: TreeCore } & JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <ul class={props.class} classList={{ "tree__sub-tree": true }}>
      {props.children}
    </ul>
  );
};

export { Root, Leaf, Handler, Switcher, Content, Arrow, Sub };
