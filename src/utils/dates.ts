import { startOfMonth, endOfMonth, differenceInMonths } from 'date-fns';

export const getCurrentMonthEnd = () => endOfMonth(new Date());

export const getDateRange = (dates: Date[]) => {
  const currentMonthEnd = getCurrentMonthEnd();
  
  const oldestDate = dates.length > 0
    ? startOfMonth(new Date(Math.min(...dates.map(d => d.getTime()))))
    : startOfMonth(new Date());

  return {
    start: oldestDate,
    end: currentMonthEnd,
    monthsDiff: differenceInMonths(currentMonthEnd, oldestDate) + 1
  };
};