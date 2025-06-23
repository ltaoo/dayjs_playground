import { JSXElement } from "solid-js";

import { PageKeys } from "./routes";

import { ViewComponent } from "@/store/types";
import { NotFoundPage } from "@/pages/notfound";
import { HomeLayout } from "@/pages/home/layout";
import { HomeIndexPage } from "@/pages/home";
import { StartOfFunctionView } from "@/pages/start_of";
import { FormatFunctionView } from "@/pages/format";
import { EndOfFunctionView } from "@/pages/end_of";
import { AddFunctionView } from "@/pages/add";
import { SubtractFunctionView } from "@/pages/subtract";
import { SetFunctionView } from "@/pages/set";
import { isBeforeFunctionView } from "@/pages/is_before";

export const pages: Omit<Record<PageKeys, ViewComponent>, "root"> = {
  "root.notfound": NotFoundPage,
  "root.home_layout": HomeLayout,
  "root.home_layout.index": HomeIndexPage,
  "root.home_layout.start_of": StartOfFunctionView,
  "root.home_layout.end_of": EndOfFunctionView,
  "root.home_layout.format": FormatFunctionView,
  "root.home_layout.add": AddFunctionView,
  "root.home_layout.subtract": SubtractFunctionView,
  "root.home_layout.set": SetFunctionView,
  "root.home_layout.is_before": isBeforeFunctionView,
};
