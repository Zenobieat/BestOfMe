import { Task, RecurrenceRule } from "./types";
import {
  format,
  parseISO,
  getDay,
  differenceInDays,
  differenceInWeeks,
  getDate,
} from "date-fns";

export function isTaskActiveOnDate(task: Task, dateStr: string): boolean {
  const date = parseISO(dateStr);
  const start = parseISO(task.startDate);
  if (date < start) return false;
  if (task.endDate && date > parseISO(task.endDate)) return false;

  const rule = task.recurrence;
  if (rule.type === "none") {
    return format(start, "yyyy-MM-dd") === dateStr;
  }

  const dayOfWeek = getDay(date); // 0=Sun
  const daysSinceStart = differenceInDays(date, start);

  switch (rule.type) {
    case "daily":
      return true;
    case "weekdays":
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case "weekends":
      return dayOfWeek === 0 || dayOfWeek === 6;
    case "weekly": {
      const startDay = getDay(start);
      return dayOfWeek === startDay;
    }
    case "biweekly": {
      const startDay = getDay(start);
      const weeksDiff = differenceInWeeks(date, start);
      return dayOfWeek === startDay && weeksDiff % 2 === 0;
    }
    case "monthly": {
      return getDate(date) === getDate(start);
    }
    case "custom": {
      const days = rule.customDays ?? [];
      return days.includes(dayOfWeek);
    }
    default:
      return false;
  }
}

export function getTasksForDate(tasks: Task[], dateStr: string): Task[] {
  return tasks.filter((t) => isTaskActiveOnDate(t, dateStr));
}

export function getDayCompletionRate(
  tasks: Task[],
  completions: { taskId: string; date: string }[],
  dateStr: string
): number {
  const dayTasks = getTasksForDate(tasks, dateStr);
  if (dayTasks.length === 0) return 0;
  const done = dayTasks.filter((t) =>
    completions.some((c) => c.taskId === t.id && c.date === dateStr)
  ).length;
  return Math.round((done / dayTasks.length) * 100);
}
