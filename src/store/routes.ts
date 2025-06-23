import { PageKeysType, build } from "@/domains/route_view/utils";

/**
 * @file 路由配置
 */
const configure = {
  root: {
    title: "ROOT",
    pathname: "/",
    options: {
      require: [],
    },
    children: {
      home_layout: {
        title: "首页布局",
        pathname: "/home",
        children: {
          index: {
            title: "首页",
            pathname: "/home/index",
            options: {
              require: [],
            },
          },
          start_of: {
            title: "startOf 函数",
            pathname: "/start_of",
            options: {
              require: [],
            },
          },
          end_of: {
            title: "endOf 函数",
            pathname: "/end_of",
            options: {
              require: [],
            },
          },
          format: {
            title: "format 函数",
            pathname: "/format",
            options: {
              require: [],
            },
          },
          add: {
            title: "add 函数",
            pathname: "/add",
            options: {
              require: [],
            },
          },
          subtract: {
            title: "subtract 函数",
            pathname: "/subtract",
            options: {
              require: [],
            },
          },
          set: {
            title: "set 函数",
            pathname: "/set",
            options: {
              require: [],
            },
          },
          is_before: {
            title: "isBefore 函数",
            pathname: "/is_before",
            options: {
              require: [],
            },
          },
        },
      },
      notfound: {
        title: "404",
        pathname: "/notfound",
      },
    },
  },
};
export type PageKeys = PageKeysType<typeof configure>;
const result = build<PageKeys>(configure);
export const routes = result.routes;
export const routesWithPathname = result.routesWithPathname;
