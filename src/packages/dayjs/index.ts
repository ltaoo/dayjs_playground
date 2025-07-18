// @ts-nocheck

import * as C from "./constant";
import en from "./locale/en";
import U from "./utils";

export interface FormatObject {
  locale?: string;
  format?: string;
  utc?: boolean;
}
export type OptionType = FormatObject | string | string[];

let L = "en"; // global locale
const Ls = {}; // global loaded locale
Ls[L] = en;

const IS_DAYJS = "$isDayjsObject";

// eslint-disable-next-line no-use-before-define
const isDayjs = (d) => d instanceof Dayjs || !!(d && d[IS_DAYJS]);

const parseLocale = (preset, object, isLocal) => {
  let l;
  if (!preset) return L;
  if (typeof preset === "string") {
    const presetLower = preset.toLowerCase();
    if (Ls[presetLower]) {
      l = presetLower;
    }
    if (object) {
      Ls[presetLower] = object;
      l = presetLower;
    }
    const presetSplit = preset.split("-");
    if (!l && presetSplit.length > 1) {
      return parseLocale(presetSplit[0]);
    }
  } else {
    const { name } = preset;
    Ls[name] = preset;
    l = name;
  }
  if (!isLocal && l) L = l;
  return l || (!isLocal && L);
};

const dayjs = function (date, c?: unknown) {
  if (isDayjs(date)) {
    return date.clone();
  }
  // eslint-disable-next-line no-nested-ternary
  const cfg = typeof c === "object" ? c : {};
  cfg.date = date;
  cfg.args = arguments; // eslint-disable-line prefer-rest-params
  return new Dayjs(cfg); // eslint-disable-line no-use-before-define
};

const wrapper = (date, instance) =>
  dayjs(date, {
    locale: instance.$L,
    utc: instance.$u,
    x: instance.$x,
    $offset: instance.$offset, // todo: refactor; do not use this.$offset in you code
  });

const Utils = U; // for plugin use
Utils.l = parseLocale;
Utils.i = isDayjs;
Utils.w = wrapper;

const parseDate = (cfg) => {
  const { date, utc } = cfg;
  if (date === null) return new Date(NaN); // null is invalid
  if (Utils.u(date)) return new Date(); // today
  if (date instanceof Date) return new Date(date);
  if (typeof date === "string" && !/Z$/i.test(date)) {
    const d = date.match(C.REGEX_PARSE);
    if (d) {
      const m = d[2] - 1 || 0;
      const ms = (d[7] || "0").substring(0, 3);
      if (utc) {
        return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
      }
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }

  return new Date(date); // everything else
};

class Dayjs {
  constructor(cfg) {
    this.$L = parseLocale(cfg.locale, null, true);
    this.parse(cfg); // for plugin
    this.$x = this.$x || cfg.x || {};
    this[IS_DAYJS] = true;
  }

  parse(cfg) {
    this.$d = parseDate(cfg);
    this.init();
  }

  init() {
    const { $d } = this;
    this.$y = $d.getFullYear();
    this.$M = $d.getMonth();
    this.$D = $d.getDate();
    this.$W = $d.getDay();
    this.$H = $d.getHours();
    this.$m = $d.getMinutes();
    this.$s = $d.getSeconds();
    this.$ms = $d.getMilliseconds();
  }

  // eslint-disable-next-line class-methods-use-this
  $utils() {
    return Utils;
  }

  isValid() {
    return !(this.$d.toString() === C.INVALID_DATE_STRING);
  }

  isSame(that, units) {
    const other = dayjs(that);
    return this.startOf(units) <= other && other <= this.endOf(units);
  }

  isAfter(that, units) {
    return dayjs(that) < this.startOf(units);
  }

  isBefore(that, units) {
    return this.endOf(units) < dayjs(that);
  }

  $g(input, get, set) {
    if (Utils.u(input)) return this[get];
    return this.set(set, input);
  }

  unix() {
    return Math.floor(this.valueOf() / 1000);
  }

  valueOf() {
    // timezone(hour) * 60 * 60 * 1000 => ms
    return this.$d.getTime();
  }

  startOf(units, startOf) {
    // startOf -> endOf
    const isStartOf = !Utils.u(startOf) ? startOf : true;
    const unit = Utils.p(units);
    const instanceFactory = (d, m) => {
      const ins = Utils.w(this.$u ? Date.UTC(this.$y, m, d) : new Date(this.$y, m, d), this);
      return isStartOf ? ins : ins.endOf(C.D);
    };
    const instanceFactorySet = (method, slice) => {
      const argumentStart = [0, 0, 0, 0];
      const argumentEnd = [23, 59, 59, 999];
      return Utils.w(
        this.toDate()[method].apply(
          // eslint-disable-line prefer-spread
          this.toDate("s"),
          (isStartOf ? argumentStart : argumentEnd).slice(slice)
        ),
        this
      );
    };
    const { $W, $M, $D } = this;
    const utcPad = `set${this.$u ? "UTC" : ""}`;
    switch (unit) {
      case C.Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      case C.M:
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
      case C.W: {
        const weekStart = this.$locale().weekStart || 0;
        const gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      }
      case C.D:
      case C.DATE:
        return instanceFactorySet(`${utcPad}Hours`, 0);
      case C.H:
        return instanceFactorySet(`${utcPad}Minutes`, 1);
      case C.MIN:
        return instanceFactorySet(`${utcPad}Seconds`, 2);
      case C.S:
        return instanceFactorySet(`${utcPad}Milliseconds`, 3);
      default:
        return this.clone();
    }
  }

  endOf(arg) {
    return this.startOf(arg, false);
  }

  $set(units, int) {
    // private set
    const unit = Utils.p(units);
    const utcPad = `set${this.$u ? "UTC" : ""}`;
    const name = {
      [C.D]: `${utcPad}Date`,
      [C.DATE]: `${utcPad}Date`,
      [C.M]: `${utcPad}Month`,
      [C.Y]: `${utcPad}FullYear`,
      [C.H]: `${utcPad}Hours`,
      [C.MIN]: `${utcPad}Minutes`,
      [C.S]: `${utcPad}Seconds`,
      [C.MS]: `${utcPad}Milliseconds`,
    }[unit];
    const arg = unit === C.D ? this.$D + (int - this.$W) : int;

    if (unit === C.M || unit === C.Y) {
      // clone is for badMutable plugin
      const date = this.clone().set(C.DATE, 1);
      date.$d[name](arg);
      date.init();
      this.$d = date.set(C.DATE, Math.min(this.$D, date.daysInMonth())).$d;
    } else if (name) this.$d[name](arg);

    this.init();
    return this;
  }

  set(string, int) {
    return this.clone().$set(string, int);
  }

  get(unit) {
    return this[Utils.p(unit)]();
  }

  add(number, units) {
    number = Number(number); // eslint-disable-line no-param-reassign
    const unit = Utils.p(units);
    const instanceFactorySet = (n) => {
      const d = dayjs(this);
      return Utils.w(d.date(d.date() + Math.round(n * number)), this);
    };
    if (unit === C.M) {
      return this.set(C.M, this.$M + number);
    }
    if (unit === C.Y) {
      return this.set(C.Y, this.$y + number);
    }
    if (unit === C.D) {
      return instanceFactorySet(1);
    }
    if (unit === C.W) {
      return instanceFactorySet(7);
    }
    const step =
      {
        [C.MIN]: C.MILLISECONDS_A_MINUTE,
        [C.H]: C.MILLISECONDS_A_HOUR,
        [C.S]: C.MILLISECONDS_A_SECOND,
      }[unit] || 1; // ms

    const nextTimeStamp = this.$d.getTime() + number * step;
    return Utils.w(nextTimeStamp, this);
  }

  subtract(number, string) {
    return this.add(number * -1, string);
  }

  format(formatStr) {
    const locale = this.$locale();

    if (!this.isValid()) return locale.invalidDate || C.INVALID_DATE_STRING;

    const str = formatStr || C.FORMAT_DEFAULT;
    const zoneStr = Utils.z(this);
    const { $H, $m, $M } = this;
    const { weekdays, months, meridiem } = locale;
    const getShort = (arr, index, full, length) =>
      (arr && (arr[index] || arr(this, str))) || full[index].slice(0, length);
    const get$H = (num) => Utils.s($H % 12 || 12, num, "0");

    const meridiemFunc =
      meridiem ||
      ((hour, minute, isLowercase) => {
        const m = hour < 12 ? "AM" : "PM";
        return isLowercase ? m.toLowerCase() : m;
      });

    const matches = (match) => {
      switch (match) {
        case "YY":
          return String(this.$y).slice(-2);
        case "YYYY":
          return Utils.s(this.$y, 4, "0");
        case "M":
          return $M + 1;
        case "MM":
          return Utils.s($M + 1, 2, "0");
        case "MMM":
          return getShort(locale.monthsShort, $M, months, 3);
        case "MMMM":
          return getShort(months, $M);
        case "D":
          return this.$D;
        case "DD":
          return Utils.s(this.$D, 2, "0");
        case "d":
          return String(this.$W);
        case "dd":
          return getShort(locale.weekdaysMin, this.$W, weekdays, 2);
        case "ddd":
          return getShort(locale.weekdaysShort, this.$W, weekdays, 3);
        case "dddd":
          return weekdays[this.$W];
        case "H":
          return String($H);
        case "HH":
          return Utils.s($H, 2, "0");
        case "h":
          return get$H(1);
        case "hh":
          return get$H(2);
        case "a":
          return meridiemFunc($H, $m, true);
        case "A":
          return meridiemFunc($H, $m, false);
        case "m":
          return String($m);
        case "mm":
          return Utils.s($m, 2, "0");
        case "s":
          return String(this.$s);
        case "ss":
          return Utils.s(this.$s, 2, "0");
        case "SSS":
          return Utils.s(this.$ms, 3, "0");
        case "Z":
          return zoneStr; // 'ZZ' logic below
        default:
          break;
      }
      return null;
    };

    return str.replace(C.REGEX_FORMAT, (match, $1) => $1 || matches(match) || zoneStr.replace(":", "")); // 'ZZ'
  }

  utcOffset() {
    // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
    // https://github.com/moment/moment/pull/1871
    return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
  }

  diff(input, units, float) {
    const unit = Utils.p(units);
    const that = dayjs(input);
    const zoneDelta = (that.utcOffset() - this.utcOffset()) * C.MILLISECONDS_A_MINUTE;
    const diff = this - that;
    const getMonth = () => Utils.m(this, that);

    let result;
    switch (unit) {
      case C.Y:
        result = getMonth() / 12;
        break;
      case C.M:
        result = getMonth();
        break;
      case C.Q:
        result = getMonth() / 3;
        break;
      case C.W:
        result = (diff - zoneDelta) / C.MILLISECONDS_A_WEEK;
        break;
      case C.D:
        result = (diff - zoneDelta) / C.MILLISECONDS_A_DAY;
        break;
      case C.H:
        result = diff / C.MILLISECONDS_A_HOUR;
        break;
      case C.MIN:
        result = diff / C.MILLISECONDS_A_MINUTE;
        break;
      case C.S:
        result = diff / C.MILLISECONDS_A_SECOND;
        break;
      default:
        result = diff; // milliseconds
        break;
    }

    return float ? result : Utils.a(result);
  }

  daysInMonth() {
    return this.endOf(C.M).$D;
  }

  $locale() {
    // get locale object
    return Ls[this.$L];
  }

  locale(preset, object) {
    if (!preset) return this.$L;
    const that = this.clone();
    const nextLocaleName = parseLocale(preset, object, true);
    if (nextLocaleName) that.$L = nextLocaleName;
    return that;
  }

  clone() {
    return Utils.w(this.$d, this);
  }

  toDate() {
    return new Date(this.valueOf());
  }

  toJSON() {
    return this.isValid() ? this.toISOString() : null;
  }

  toISOString() {
    // ie 8 return
    // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
    // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    return this.$d.toISOString();
  }

  toString() {
    return this.$d.toUTCString();
  }
}

const proto = Dayjs.prototype;
dayjs.prototype = proto;
[
  ["$ms", C.MS],
  ["$s", C.S],
  ["$m", C.MIN],
  ["$H", C.H],
  ["$W", C.D],
  ["$M", C.M],
  ["$y", C.Y],
  ["$D", C.DATE],
].forEach((g) => {
  proto[g[1]] = function (input) {
    return this.$g(input, g[0], g[1]);
  };
});

dayjs.extend = (plugin, option) => {
  if (!plugin.$i) {
    // install plugin only once
    plugin(option, Dayjs, dayjs);
    plugin.$i = true;
  }
  return dayjs;
};

dayjs.locale = parseLocale;

dayjs.isDayjs = isDayjs;

dayjs.unix = (timestamp) => dayjs(timestamp * 1e3);

dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};
export default dayjs;
