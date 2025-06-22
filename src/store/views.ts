import { JSXElement } from "solid-js";

import { PageKeys } from "./routes";

import { ViewComponent } from "@/store/types";
import { NotFoundPage } from "@/pages/notfound";
import { HomeLayout } from "@/pages/home/layout";
import { HomeIndexPage } from "@/pages/home";

export const pages: Omit<Record<PageKeys, ViewComponent>, "root"> = {
  "root.notfound": NotFoundPage,
  "root.home_layout": HomeLayout,
  "root.home_layout.index": HomeIndexPage,
};
