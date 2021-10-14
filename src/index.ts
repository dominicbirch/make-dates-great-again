export type MonthNames = [string, string, string, string, string, string, string, string, string, string, string, string];
export type DayNames = [string, string, string, string, string, string, string];

declare global {
    interface DateConstructor {
        /**Returns a new date representing the start of the current day. */
        today(): Date;
        /**Returns a value indicating whether the specified year is a leap year. */
        isLeapYear(year: number): boolean;
        /**Returns the number of days in the specified month on the specified year.
         * @param year The full year in which to check.
         * @param month The zero-based month to be checked.
         */
        daysInMonth(year: number, month: number): 31 | 30 | 29 | 28;
        /**Returns the duration in whole days between the dates provided.
         * > NOTE: This is an exclusive measurement, 
         * 0 days for 2 dates on the same day and 1 day for consecutive days.
         * @param start The first boundary in the range.  This may be before or after the end date.
         * @param end The second boundary in the range.  This may be before or after the start date.
         */
        daysBetween(start: Date, end: Date): number;
    }

    interface Date {
        /**Returns a new `Date` which represents the same point in time as the source date. */
        clone(): Date;
        /**Returns a new `Date` which is the number of specified days after the source date.
         * @param days The number of days to add, this may be positive or negative.
         */
        addDays(days: number): Date;

        //TODO: implement these
        startOfMonth(): Date;
        startOfYear(): Date;
        addMonths(months: number): Date;
        addYears(years: number): Date;
        addHours(hours: number): Date;
        addMinutes(minutes: number): Date;
        addSeconds(seconds: number): Date;
        addMs(ms: number): Date;
        compare(other: Date): -1 | 0 | 1;
        isLeapYear(): boolean;
        daysInMonth(): 31 | 30 | 29 | 28;
        getAge(atDate?: Date): number;

        /**Returns a value indicating whether the source date is on the same day as `other`
         * @param other The date to compare against.
         */
        isOnSameDayAs(other: Date): boolean;
        /**Returns a new `Date` representing the first instant of the source date's day. */
        startOfDay(): Date;
        /**Returns a value indicating whether the source date represents the same point in time as `other`
         * @param other The date to compare against.
         */
        isEqualTo(other: Date): boolean;
        /**Returns a value indicating whether the date is after the date provided 
         * @param other The date to compare against.
        */
        isAfter(other: Date): boolean;
        /**Returns a value indicating whether the date is before the date provided 
         * @param other The date to compare against.
        */
        isBefore(other: Date): boolean;
        /**Returns a value indicating whether the date is between the dates provided, inclusively.
         * @param start The first inclusive boundary, this may be the upper or lower boundary.
         * @param end The second inclusive boundary, this may be the upper or lower boundary.
         */
        isBetween(start: Date, end: Date): boolean;
        /**Returns the source date formatted to string using the specified pattern.
         * 
         * Optionally, localized day and month names can be provided.
         * @param pattern The format pattern to be applied.
         * @param dayNames The full names for each day of the week, as indexed by the return value of `getDay`.
         * @param monthNames The full names for each month of the year, as indexed by the return value of `getMonth`.
         * @param am The label to be given to AM designator formatted output.
         * @param pm The label to be given to PM designator formatted output.
         */
        format(pattern: string, dayNames?: DayNames, monthNames?: MonthNames, am?: string, pm?: string): string;
    }
}


Date.today = function () {
    const d = new Date(Date.now());
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
Date.isLeapYear = function (year: number) {
    return Math.trunc(year) % 4 === 0;
}
Date.daysInMonth = function (year, month) {
    if (month < 0 || month > 11) { throw new Error("month is out of bounds"); }

    return <31 | 30 | 29 | 28>[
        31,
        Date.isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ][month];
}
Date.daysBetween = function (start, end) {
    return Math.round(Math.abs((end.getTime() - start.getTime()) / 86400000));
}


Date.prototype.clone = function (this) {
    return new Date(this.getTime());
}

Date.prototype.addDays = function (this, days) {
    let result = new Date(this.getTime());
    result.setDate(this.getDate() + days);
    return result;
}

Date.prototype.addMonths = function (this, months) {
    let year = this.getFullYear() + Math.trunc(months / 12),
        month = this.getMonth() + (months % 12);

    if (month > 11) {
        ++year;
        month -= 11;
    } else if (month < 0) {
        --year;
        month += 11;
    }

    return new Date(year, month, Math.min(this.getDate(), Date.daysInMonth(year, month)));
}

Date.prototype.isOnSameDayAs = function (this, other) {
    return !!other && new Date(this.getFullYear(), this.getMonth(), this.getDate()).getTime() === new Date(other.getFullYear(), other.getMonth(), other.getDate()).getTime();
}

Date.prototype.startOfDay = function (this) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}

Date.prototype.isEqualTo = function (this, other) {
    return !!other && this.getTime() === other.getTime();
}

Date.prototype.isAfter = function (this, other) {
    return !!other && this.getTime() > other.getTime();
}

Date.prototype.isBefore = function (this, other) {
    return !!other && this.getTime() < other.getTime();
}

Date.prototype.isBetween = function (this, start, end) {
    if (start && end) {
        const thisTime = this.getTime(), startTime = start.getTime(), endTime = end.getTime();
        if ((thisTime >= startTime && thisTime <= endTime) || (thisTime >= endTime && thisTime <= startTime)) {
            return true;
        }
    }
    return false;
}

Date.prototype.format = function formatDate(this, pattern, dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], am = "AM", pm = "PM") {
    let result = pattern || "";
    if (result === "") { return result; }

    result = result
        .replace(/yyyy/g, "{0}")
        .replace(/yy/g, "{1}")
        .replace(/y/g, "{2}")

        .replace(/MMMM/g, "{3}")
        .replace(/MMM/g, "{4}")
        .replace(/MM/g, "{5}")
        .replace(/M/g, "{6}")

        .replace(/dddd/g, "{7}")
        .replace(/ddd/g, "{8}")
        .replace(/dd/g, "{9}")
        .replace(/d/g, "{10}")

        .replace(/hh/g, "{11}")
        .replace(/h/g, "{12}")
        .replace(/HH/g, "{13}")
        .replace(/H/g, "{14}")

        .replace(/mm/g, "{15}")
        .replace(/m/g, "{16}")

        .replace(/ss/g, "{17}")
        .replace(/s/g, "{18}")

        .replace(/fff/g, "{19}")
        .replace(/ff/g, "{20}")
        .replace(/f/g, "{21}")
        .replace(/FFF/g, "{22}")
        .replace(/FF/g, "{23}")
        .replace(/F/g, "{24}")

        .replace(/K|zzz/g, "{25}")
        .replace(/zz/g, "{26}")
        .replace(/z/g, "{27}")

        .replace(/tt/g, "{28}")
        .replace(/t/g, "{29}");


    if (result.indexOf("{0}") > -1) {
        result = result.replace(/\{0\}/g, this.getFullYear().toString());
    }
    if (result.indexOf("{1}") > -1) {
        result = result.replace(/\{1\}/g, this.getFullYear().toString().substr(2));
    }
    if (result.indexOf("{2}") > -1) {
        result = result.replace(/\{2\}/g, parseInt(this.getFullYear().toString().substr(2)).toString());
    }

    if (result.indexOf("{3}") > -1) {
        result = result.replace(/\{3\}/g, monthNames[this.getMonth()]);
    }
    if (result.indexOf("{4}") > -1) {
        result = result.replace(/\{4\}/g, monthNames[this.getMonth()].substr(0, 3));
    }
    if (result.indexOf("{5}") > -1) {
        result = result.replace(/\{5\}/g, (this.getMonth() + 1).toString().padStart(2, "0"));
    }
    if (result.indexOf("{6}") > -1) {
        result = result.replace(/\{6\}/g, (this.getMonth() + 1).toString());
    }

    if (result.indexOf("{7}") > -1) {
        result = result.replace(/\{7\}/g, dayNames[this.getDay()]);
    }
    if (result.indexOf("{8}") > -1) {
        result = result.replace(/\{8\}/g, dayNames[this.getDay()].substr(0, 3));
    }
    if (result.indexOf("{9}") > -1) {
        result = result.replace(/\{9\}/g, this.getDate().toString().padStart(2, "0"));
    }
    if (result.indexOf("{10}") > -1) {
        result = result.replace(/\{10\}/g, this.getDate().toString());
    }

    if (result.indexOf("{11}") > -1) {
        let h = this.getHours();
        result = result.replace(/\{11\}/g, (h > 12 ? h - 12 : h === 0 ? 12 : h).toString().padStart(2, "0"));
    }
    if (result.indexOf("{12}") > -1) {
        let h = this.getHours();
        result = result.replace(/\{12\}/g, (h > 12 ? h - 12 : h === 0 ? 12 : h).toString());
    }

    if (result.indexOf("{13}") > -1) {
        result = result.replace(/\{13\}/g, this.getHours().toString().padStart(2, "0"));
    }
    if (result.indexOf("{14}") > -1) {
        result = result.replace(/\{14\}/g, this.getHours().toString());
    }

    if (result.indexOf("{15}") > -1) {
        result = result.replace(/\{15\}/g, this.getMinutes().toString().padStart(2, "0"));
    }
    if (result.indexOf("{16}") > -1) {
        result = result.replace(/\{16\}/g, this.getMinutes().toString());
    }

    if (result.indexOf("{17}") > -1) {
        result = result.replace(/\{17\}/g, this.getSeconds().toString().padStart(2, "0"));
    }
    if (result.indexOf("{18}") > -1) {
        result = result.replace(/\{18\}/g, this.getSeconds().toString());
    }

    if (result.indexOf("{19}") > -1) {
        result = result.replace(/\{19\}/g, this.getMilliseconds().toString().padStart(3, "0"));
    }
    if (result.indexOf("{20}") > -1) {
        result = result.replace(/\{20\}/g, (this.getMilliseconds() / 10).toFixed(0).padStart(2, "0"));
    }
    if (result.indexOf("{21}") > -1) {
        result = result.replace(/\{21\}/g, (this.getMilliseconds() / 100).toFixed(0));
    }

    if (result.indexOf("{22}") > -1) {
        const f = this.getMilliseconds();
        result = result.replace(/\{22\}/g, !f ? "" : f.toString());
    }
    if (result.indexOf("{23}") > -1) {
        const f = (this.getMilliseconds() / 10).toFixed(0);
        result = result.replace(/\{23\}/g, f === "0" ? "" : f);
    }
    if (result.indexOf("{24}") > -1) {
        const f = (this.getMilliseconds() / 100).toFixed(0);
        result = result.replace(/\{24\}/g, f === "0" ? "" : f);
    }

    if (result.indexOf("{25}") > -1) {
        const o = this.getTimezoneOffset(), h = Math.abs((o / 60)).toFixed(0), m = Math.abs(o % 60);
        result = result.replace(/\{25\}/g, `${o > 0 ? "+" : "-"}${h.padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
    if (result.indexOf("{26}") > -1) {
        const h = this.getTimezoneOffset() / 60;
        result = result.replace(/\{26\}/g, h >= 0 ? h.toFixed(0).padStart(2, "0") : `-${Math.abs(h).toFixed(0).padStart(2, "0")}`)
    }
    if (result.indexOf("{27}") > -1) {
        const h = this.getTimezoneOffset() / 60;
        result = result.replace(/\{27\}/g, h >= 0 ? h.toFixed(0) : `-${Math.abs(h).toFixed(0)}`)
    }

    // applying tokens which support custom strings last, since we don't know what tokens might be in the custom strings

    if (result.indexOf("{28}") > -1) {
        result = result.replace(/\{28\}/g, this.getHours() > 11 ? pm : am);
    }
    if (result.indexOf("{29}") > -1) {
        result = result.replace(/\{29\}/g, this.getHours() > 11 ? pm[0] : am[0]);
    }

    return result;
}


// This is just to ensure we produce a valid module
export { };