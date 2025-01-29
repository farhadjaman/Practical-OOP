class DateTimeHelper {
  constructor(private readonly date: Date = new Date()) {}

  // Get underlying Date object
  get nativeDate(): Date {
    return new Date(this.date);
  }

  // Create from ISO string with validation
  static fromISOString(isoString: string): DateTimeHelper {
    // Validate ISO 8601 format
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
    if (!isoRegex.test(isoString)) {
      throw new Error(
        "Invalid ISO date string format. Expected: YYYY-MM-DDTHH:mm:ss.sssZ",
      );
    }

    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date value");
    }

    return new DateTimeHelper(date);
  }

  // Get start of day (00:00:00)
  startOfDay(): DateTimeHelper {
    const newDate = new Date(this.date);
    newDate.setHours(0, 0, 0, 0);
    return new DateTimeHelper(newDate);
  }

  // Get end of day (23:59:59.999)
  endOfDay(): DateTimeHelper {
    const newDate = new Date(this.date);
    newDate.setHours(23, 59, 59, 999);
    return new DateTimeHelper(newDate);
  }

  // Get start of week (Sunday 00:00:00)
  startOfWeek(): DateTimeHelper {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() - newDate.getDay());
    newDate.setHours(0, 0, 0, 0);
    return new DateTimeHelper(newDate);
  }

  // Add business days (skipping weekends)
  addBusinessDays(days: number): DateTimeHelper {
    let newDate = new Date(this.date);
    let addedDays = 0;
    while (addedDays < days) {
      newDate.setDate(newDate.getDate() + 1);
      if (newDate.getDay() !== 0 && newDate.getDay() !== 6) {
        addedDays++;
      }
    }
    return new DateTimeHelper(newDate);
  }

  // Check if date is a weekend
  isWeekend(): boolean {
    const day = this.date.getDay();
    return day === 0 || day === 6;
  }

  // Get quarter of the year (1-4)
  getQuarter(): number {
    return Math.floor(this.date.getMonth() / 3) + 1;
  }

  // Get week number of the year (1-52/53)
  getWeekNumber(): number {
    const firstDayOfYear = new Date(this.date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (this.date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // Format with custom options and timezone support
  format(formatString: string, timeZone: string = "UTC"): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(this.date);
    const mapped: { [key: string]: string } = {};
    parts.forEach((p) => (mapped[p.type] = p.value));

    return formatString
      .replace("YYYY", mapped.year)
      .replace("MM", mapped.month)
      .replace("DD", mapped.day)
      .replace("HH", mapped.hour)
      .replace("mm", mapped.minute)
      .replace("ss", mapped.second);
  }
}

// Example usage
const dateHelper = DateTimeHelper.fromISOString("2024-03-15T12:00:00Z");
const nativeDate = dateHelper.nativeDate; // Get native Date object
console.log(dateHelper.format("YYYY-MM-DD HH:mm:ss")); // "2024-03-15 12:00:00"
console.log(dateHelper.getQuarter()); // 1
console.log(dateHelper.isWeekend()); // false
console.log(dateHelper.addBusinessDays(5).format("YYYY-MM-DD HH:mm:ss")); // Adds 5 business days
