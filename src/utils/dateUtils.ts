import { startOfDay, endOfDay, isSameDay } from "date-fns";

export const isSameDayUTC = (date1: Date, date2: Date) => {
  return isSameDay(
    new Date(date1.toISOString()),
    new Date(date2.toISOString())
  );
};

export const getStartOfDay = (date: Date) => {
  return startOfDay(new Date(date.toISOString()));
};

export const getEndOfDay = (date: Date) => {
  return endOfDay(new Date(date.toISOString()));
};