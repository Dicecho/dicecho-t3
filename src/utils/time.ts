import dayjs from 'dayjs';
import { formatDistanceToNow } from "date-fns";
import { getDateFnsLocale } from "@/lib/i18n/date-fns-locale";

type formatConfig = {
  unit?: 'second' | 'millisecond';
  format?: string;
  simple?: boolean;
};

export const formatDateWithDistanceToNow = (timestamp: number | Date | string, lng: string) => {
  const date = new Date(timestamp);
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: getDateFnsLocale(lng),
  });
};

export const formatDate = (timestamp: number, config?: formatConfig) => {
  let _timestamp = timestamp;
  const _config: formatConfig = {
    unit: 'millisecond',
    format: 'YYYY-MM-DD HH:mm',
    ...config,
  };
  if (_config.unit === 'second') {
    _timestamp *= 1000;
  }

  const localTime = dayjs(_timestamp);
  if (localTime.isAfter(dayjs().subtract(1, 'm'))) {
    // 时间小于一分钟内
    return '刚刚';
  }
  if (localTime.isAfter(dayjs().subtract(1, 'day'))) {
    // 时间在24h内
    const date = dayjs().diff(localTime) / 1000;
    if (Math.floor(date / 3600) === 0) {
      return `${Math.floor(date / 60)} 分钟前`;
    }

    return `${Math.floor(date / 3600)} 小时前`;
  }

  if (config?.simple) {
    const date = dayjs().diff(localTime) / 1000;
    if (localTime.isAfter(dayjs().subtract(1, 'month'))) {
      // 时间在1个月内
      return `${Math.floor(date / 3600 / 24)} 天前`;
    }

    if (localTime.isAfter(dayjs().subtract(1, 'year'))) {
      // 时间在1年内
      return `${Math.floor(date / 3600 / 24 / 30)} 月前`;
    }

    return `${Math.floor(date / 3600 / 24 / 365)} 年前`;
  }

  return localTime.format(_config.format);
};
