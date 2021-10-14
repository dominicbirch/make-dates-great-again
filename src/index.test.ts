beforeAll(() => import("./index"));

describe("today", function () {
    it("returns a date representing the start of the current day", () => {
        const result = Date.today(), now = new Date(Date.now());

        expect(result.getFullYear()).toBe(now.getFullYear());
        expect(result.getMonth()).toBe(now.getMonth());
        expect(result.getDate()).toBe(now.getDate());
        expect(result.toTimeString().split(/\s+/i)[0]).toEqual("00:00:00");
    });
});

describe("daysInMonth", function () {
    it("returns the correct number of days for months of a leap year", () => {
        let results = [];

        for (let i = 0; i <= 11; i++) {
            results.push(Date.daysInMonth(2020, i));
        }

        expect(results).toHaveLength(12);
        const thirty = [8, 3, 5, 10];
        results.forEach((days, i) =>
            expect(days).toEqual(thirty.some(x => x === i)
                ? 30
                : i === 1
                    ? 29
                    : 31)
        );
    });
    it("returns the correct number of days for months of a non-leap year", () => {
        let results = [];

        for (let i = 0; i <= 11; i++) {
            results.push(Date.daysInMonth(2021, i));
        }

        expect(results).toHaveLength(12);
        const thirty = [8, 3, 5, 10];
        results.forEach((days, i) =>
            expect(days).toEqual(thirty.some(x => x === i)
                ? 30
                : i === 1
                    ? 28
                    : 31)
        );
    });
    it("throws if month provided is less than 0", () =>
        expect(() => Date.daysInMonth(2000, -1)).toThrow(new Error("month is out of bounds")));
    it("throws if month provided is greater than 11", () =>
        expect(() => Date.daysInMonth(2000, 12)).toThrow(new Error("month is out of bounds")));
    it("defers to static implementation when called on an instance", () => {
        const spy = jest.spyOn(Date, "daysInMonth"), subject = new Date(Date.now());

        const result = subject.daysInMonth();

        expect(spy).toHaveBeenCalledWith(subject.getFullYear(), subject.getMonth());
        expect(result).toBeTruthy();
    });
});

describe("daysBetween", function () {
    it("returns 0 for the same day", () => {
        const day = new Date(Date.now());
        const result = Date.daysBetween(day, day);
        expect(result).toEqual(0);
    });
    it("returns 1 for consecutive days", () => {
        const result = Date.daysBetween(new Date(1960, 0, 1), new Date(1960, 0, 2));
        expect(result).toEqual(1);
    });
});

describe("clone", function () {
    it("returns a new date representing the same point in time", () => {
        const subject = new Date(Date.now());

        const result = subject.clone();

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toEqual(subject.getTime());
    });
});

describe("compare", function () {
    it("returns 0 when the dates are equal", () => {
        const subject = new Date(987654321), other = new Date(987654321);

        const result = subject.compare(other);

        expect(result).toStrictEqual(0);
    });
    it("returns 0 when the specified date is null", () => {
        const subject = new Date(123456), other = null as any;

        const result = subject.compare(other);

        expect(result).toStrictEqual(0);
    });
    it("returns 1 when the source date is after the specified date", () => {
        const subject = new Date(123456), other = new Date(0);

        const result = subject.compare(other);

        expect(result).toStrictEqual(1);
    });
    it("returns -1 when the source date is before the specified date", () => {
        const subject = new Date(0), other = new Date(12345);

        const result = subject.compare(other);

        expect(result).toStrictEqual(-1);
    });
});

describe("addDays", function () {
    it("correctly handles zero", () => {
        const subject = new Date(Date.now());

        const result = subject.addDays(0);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear());
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("correctly applies positive values", () => {
        const subject = new Date(2021, 0, 1);

        const result = subject.addDays(50);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(2021);
        expect(result.getMonth()).toEqual(1);
        expect(result.getDate()).toEqual(20);
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("correctly applies negative values", () => {
        const subject = new Date(2021, 0, 1);

        const result = subject.addDays(-50);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(2020);
        expect(result.getMonth()).toEqual(10);
        expect(result.getDate()).toEqual(12);
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
});

describe("addMonths", function () {
    it("correctly adds a positive value resulting in no change to the day or year", () => {
        const subject = new Date(1970, 0, 1);

        const result = subject.addMonths(3);

        expect(result.getMonth()).toBe(3);
        expect(result.getFullYear()).toBe(1970);
        expect(result.getDate()).toBe(1);
        expect(result).not.toBe(subject); // it should return a new instance
    });
    it("correctly adds a negative value resulting in no change to the day or year", () => {
        const subject = new Date(1983, 11, 25);

        const result = subject.addMonths(-6);

        expect(result.getMonth()).toBe(5);
        expect(result.getFullYear()).toBe(1983);
        expect(result.getDate()).toBe(25);
        expect(result).not.toBe(subject); // it should return a new instance
    });
    it("correctly handles a positive value of more than 12 months", () => {
        const subject = new Date(1983, 4, 28);

        const result = subject.addMonths(456);

        expect(result.getMonth()).toBe(4);
        expect(result.getDate()).toBe(28);
        expect(result.getFullYear()).toBe(2021);
        expect(result).not.toBe(subject); // it should return a new instance
    });
    it("correctly handles a negative value of more than 12 months", () => {
        const subject = new Date(2021, 9, 31);

        const result = subject.addMonths(-36);

        expect(result.getFullYear()).toBe(2018);
        expect(result.getMonth()).toBe(9);
        expect(result.getDate()).toBe(31);
        expect(result).not.toBe(subject); // it should return a new instance
    });
    it("correctly handles a positive add resulting in a date in the following year", () => {
        const subject = new Date(1991, 10, 25);

        const result = subject.addMonths(3);

        expect(result.getFullYear()).toBe(1992);
        expect(result.getMonth()).toBe(2);
        expect(result.getDate()).toBe(25);
        expect(result).not.toBe(subject); // it should return a new instance
    });
    it("correctly handles a negative add resulting in a date in the previous year", () => {
        const subject = new Date(2016, 1, 14);

        const result = subject.addMonths(-6);

        expect(result.getFullYear()).toBe(2015);
        expect(result.getMonth()).toBe(6);
        expect(result.getDate()).toBe(14);
        expect(result).not.toBe(subject); // it should return a new instance
    });
});

describe("addYears", function () {
    it("returns a clone when passed zero", () => {
        const subject = new Date(Date.now());

        const result = subject.addYears(0);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear());
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("correctly applies positive values", () => {
        const subject = new Date(Date.now());

        const result = subject.addYears(5);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear() + 5);
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("correctly applies negative values", () => {
        const subject = new Date(Date.now());

        const result = subject.addYears(-101);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear() - 101);
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("corrects 29th Feb on non-leap year to 28th Feb", () => {
        const subject = new Date(2000, 1, 29);

        const result = subject.addYears(1);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(2001);
        expect(result.getMonth()).toEqual(1);
        expect(result.getDate()).toEqual(28);
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
});

describe("addMs", function () {
    it("returns a clone when passed zero", () => {
        const subject = new Date(-21000);

        const result = subject.addMs(0);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear());
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("adds the correct number of milliseconds when passed a positive value", () => {
        const subject = new Date(0);

        const result = subject.addMs(1234567);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() + 1234567);
    });
    it("subtracts the correct number of milliseconds when passed a negative value", () => {
        const subject = new Date(0);

        const result = subject.addMs(-12345678);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() - 12345678);
    });
});

describe("addSeconds", function () {
    it("returns a clone when passed zero", () => {
        const subject = new Date(-21000);

        const result = subject.addSeconds(0);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear());
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("adds the correct number of seconds when passed a positive value", () => {
        const subject = new Date(0);

        const result = subject.addSeconds(60);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() + 60000);
    });
    it("subtracts the correct number of seconds when passed a negative value", () => {
        const subject = new Date(0);

        const result = subject.addSeconds(-180);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() - 180000);
    });
});

describe("addMinutes", function () {
    it("returns a clone when passed zero", () => {
        const subject = new Date(-21000);

        const result = subject.addMinutes(0);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear());
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("adds the correct number of minutes when passed a positive value", () => {
        const subject = new Date(0);

        const result = subject.addMinutes(10);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() + 600000);
    });
    it("subtracts the correct number of minutes when passed a negative value", () => {
        const subject = new Date(0);

        const result = subject.addMinutes(-100);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() - 6000000);
    });
});

describe("addHours", function () {
    it("returns a clone when passed zero", () => {
        const subject = new Date(-21000);

        const result = subject.addHours(0);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toEqual(subject.getFullYear());
        expect(result.getMonth()).toEqual(subject.getMonth());
        expect(result.getDate()).toEqual(subject.getDate());
        expect(result.getHours()).toEqual(subject.getHours());
        expect(result.getMinutes()).toEqual(subject.getMinutes());
        expect(result.getMilliseconds()).toEqual(subject.getMilliseconds());
    });
    it("adds the correct number of minutes when passed a positive value", () => {
        const subject = new Date(0);

        const result = subject.addHours(10);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() + 36000000);
    });
    it("subtracts the correct number of minutes when passed a negative value", () => {
        const subject = new Date(0);

        const result = subject.addHours(-2);

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getTime()).toStrictEqual(subject.getTime() - 7200000);
    });
});

describe("isLeapYear", function () {
    it("defers to static implementation when called on an instance", () => {
        const spy = jest.spyOn(Date, "isLeapYear"), subject = new Date(2020, 0, 1);

        const result = subject.isLeapYear();

        expect(spy).toHaveBeenCalledWith(2020);
        expect(result).toBe(true);
    });
    it("returns true if the year is divisible by 4", () => {
        const result = Date.isLeapYear(2000);

        expect(result).toBe(true);
    });
    it("returns false if the year is not divisible by 4", () => {
        const result = Date.isLeapYear(1337);

        expect(result).toBe(false);
    });
})

describe("isOnSameDayAs", function () {
    it("returns false when comparing to null or undefined", () => {
        const subject = new Date(Date.now());

        const nullResult = subject.isOnSameDayAs(null as any);
        const undefinedResult = subject.isOnSameDayAs(undefined as any);

        expect(nullResult).toBe(false);
        expect(undefinedResult).toBe(false);
    });
    it("returns true when comparing to a different time on the same day", () => {
        const subject = new Date(Date.now()), other = new Date(subject.getFullYear(), subject.getMonth(), subject.getDate());

        const result = subject.isOnSameDayAs(other);

        expect(result).toBe(true);
    });
});

describe("startOfDay", function () {
    it("returns a new date representing the first millisecond of the same day", () => {
        const subject = new Date(Date.now());

        const result = subject.startOfDay();

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toStrictEqual(subject.getFullYear());
        expect(result.getMonth()).toStrictEqual(subject.getMonth());
        expect(result.getDate()).toStrictEqual(subject.getDate());
        expect(result.getHours()).toStrictEqual(0);
        expect(result.getMinutes()).toStrictEqual(0);
        expect(result.getSeconds()).toStrictEqual(0);
        expect(result.getMilliseconds()).toStrictEqual(0);
    });
});

describe("startOfMonth", function () {
    it("returns a new date representing the first millisecond of the source date's month", () => {
        const subject = new Date(0);

        const result = subject.startOfMonth();

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toStrictEqual(subject.getFullYear());
        expect(result.getMonth()).toStrictEqual(subject.getMonth());
        expect(result.getDate()).toStrictEqual(1);
        expect(result.getHours()).toStrictEqual(0);
        expect(result.getMinutes()).toStrictEqual(0);
        expect(result.getSeconds()).toStrictEqual(0);
        expect(result.getMilliseconds()).toStrictEqual(0);
    });
});

describe("startOfYear", function () {
    it("returns a new date representing the first millisecond of the source date's year", () => {
        const subject = new Date(0);

        const result = subject.startOfYear();

        expect(result).not.toBe(subject); // it should return a new instance
        expect(result.getFullYear()).toStrictEqual(subject.getFullYear());
        expect(result.getMonth()).toStrictEqual(0);
        expect(result.getDate()).toStrictEqual(1);
        expect(result.getHours()).toStrictEqual(0);
        expect(result.getMinutes()).toStrictEqual(0);
        expect(result.getSeconds()).toStrictEqual(0);
        expect(result.getMilliseconds()).toStrictEqual(0);
    });
});

describe("isEqualTo", function () {
    it("returns false when comparing to null or undefined", () => {
        const subject = new Date(Date.now());

        const nullResult = subject.isEqualTo(null as any);
        const undefinedResult = subject.isEqualTo(undefined as any);

        expect(nullResult).toBe(false);
        expect(undefinedResult).toBe(false);
    });
    it("returns true when comparing to another instance representing the same point in time", () => {
        const subject = new Date(12345), other = new Date(12345);

        const result = subject.isEqualTo(other);

        expect(result).toBe(true);
    });
});

describe("isAfter", function () {
    it("returns false if the dates are equal", () => {
        const subject = new Date(12345), other = new Date(12345);

        const result = subject.isAfter(other);

        expect(result).toBe(false);
    });
    it("returns false if the other date represents a time before the source date", () => {
        const subject = new Date(12345), other = new Date(12346);

        const result = subject.isAfter(other);

        expect(result).toBe(false);
    });
    it("returns true if the other date represents a time after the source date", () => {
        const subject = new Date(12345), other = new Date(12344);

        const result = subject.isAfter(other);

        expect(result).toBe(true);
    });
});

describe("isBefore", function () {
    it("returns false if the dates are equal", () => {
        const subject = new Date(12345), other = new Date(12345);

        const result = subject.isBefore(other);

        expect(result).toBe(false);
    });
    it("returns false if the other date represents a time after the source date", () => {
        const subject = new Date(12345), other = new Date(12344);

        const result = subject.isBefore(other);

        expect(result).toBe(false);
    });
    it("returns true if the other date represents a time before the source date", () => {
        const subject = new Date(12345), other = new Date(12346);

        const result = subject.isBefore(other);

        expect(result).toBe(true);
    });
});

describe("isBetween", function () {
    it("returns false if start or end are null or undefined", () => {
        const subject = new Date();

        const startNullResult = subject.isBetween(null as any, new Date());
        const startUndefinedResult = subject.isBetween(undefined as any, new Date());
        const endNullResult = subject.isBetween(new Date(0), null as any);
        const endUndefinedResult = subject.isBetween(new Date(0), undefined as any);

        expect(startNullResult).toBe(false);
        expect(startUndefinedResult).toBe(false);
        expect(endNullResult).toBe(false);
        expect(endUndefinedResult).toBe(false);
    });
    it("returns false if the source date is outside of the specified range", () => {
        const subject = new Date(0), start = new Date(Date.now()), end = new Date(Date.now());

        const result = subject.isBetween(start, end);

        expect(result).toBe(false);
    });
    it("returns true if the source date is equal to the start date", () => {
        const subject = new Date(0), start = new Date(0), end = new Date(Date.now());

        const result = subject.isBetween(start, end);

        expect(result).toBe(true);
    });
    it("returns true if the source date is equal to the end date", () => {
        const subject = new Date(1234), start = new Date(0), end = new Date(1234);

        const result = subject.isBetween(start, end);

        expect(result).toBe(true);
    });
    it("returns true if the source date is inside of the specified range", () => {
        const subject = new Date(1234), start = new Date(0), end = new Date(123456);

        const result = subject.isBetween(start, end);

        expect(result).toBe(true);
    });
    it("returns true if the source date is inside of the specified range when end is before start", () => {
        const subject = new Date(1234), start = new Date(123456), end = new Date(0);

        const result = subject.isBetween(start, end);

        expect(result).toBe(true);
    });
});

describe("format", function () {
    it("produces an empty string when provided with a null pattern", () => {
        const subject = new Date(0);

        const result = subject.format(null as any);

        expect(result).toStrictEqual("");
    });
    it("correctly applies a full ISO format pattern", () => {
        const subject = new Date(1983, 4, 28, 16, 20, 4, 20);

        const result = subject.format("yyyy-MM-ddTHH:mm:ss.fff K");

        expect(result).toMatch(/^1983-05-28T16:20:04.020 /i);
    });
    it("replaces all instances of repeated tokens", () => {
        const subject = new Date(1983, 4, 28, 16, 20, 4, 200);

        const result = subject.format("yy yy y y M M M d d d hh hh h h H H m m s s fff fff ff ff f f FFF FFF FF FF F F");

        expect(result).toMatch(/[\d\s]/i)
    });
    it("applies custom month names when provided", () => {
        const subject = new Date(1983, 4, 28);

        const result = subject.format("MMMM MMM", undefined, [
            "Ianuarius",
            "Februarius",
            "Martius",
            "Aprilis",
            "Maius",
            "Junius",
            "Julius",
            "Augustus",
            "Septembris",
            "Octobris",
            "Novembris",
            "Decembris",
        ]);

        expect(result).toStrictEqual("Maius Mai");
    });
    it("applies custom day names when provided", () => {
        const subject = new Date(2021, 9, 14);

        const result = subject.format("dddd ddd", [
            "Linggó",
            "Lúnes",
            "Martés",
            "Miyérkoles",
            "Huwébes",
            "Biyérnes",
            "Sábado"
        ]);

        expect(result).toStrictEqual("Huwébes Huw");
    });
    it("applies custom AM indicator when provided", () => {
        const subject = new Date(2021, 9, 14);

        const result = subject.format("hhtt ht", undefined, undefined, "午前");

        expect(result).toStrictEqual("12午前 12午");
    });
    it("applies custom PM indicator when provided", () => {
        const subject = new Date(2021, 9, 14, 14);

        const result = subject.format("hhtt ht", undefined, undefined, undefined, "午後");

        expect(result).toStrictEqual("02午後 2午");
    });
    it("correctly formats positive timezone offsets", () => {
        const subject = new Date(Date.now());
        subject.getTimezoneOffset = jest.fn().mockReturnValue(180);

        const result = subject.format("K zzz zz z");

        expect(result).toStrictEqual("+03:00 +03:00 03 3");
    });
    it("correctly formats negative timezone offsets", () => {
        const subject = new Date(Date.now());
        subject.getTimezoneOffset = jest.fn().mockReturnValue(-90);

        const result = subject.format("K zzz zz z");

        expect(result).toStrictEqual("-01:30 -01:30 -01 -1");
    });
    it("correctly applies an extremely non-standard format", () => {
        const subject = new Date("1983-05-28T00:00:00.000Z");

        const result = subject.format("$dddd~[MMMM],d\n\t@hh/h|mm&s.FFF/FF/F\n»K/zz/z");

        expect(result).toStrictEqual("$Saturday~[May],28\n\t@01/1|00&0.//\n»-01:00/-01/-1");
    });
});

describe("getAge", function () {
    it("calculates correct age when birthday is today", () => {
        const
            today = Date.today(),
            subject = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

        const result = subject.getAge();

        expect(result).toStrictEqual(18);
    });
    it("calculates correct age when birthday was a previous day this month", () => {
        const
            today = Date.today(),
            subject = new Date(today.getFullYear() - 21, today.getMonth(), 1);

        const result = subject.getAge(new Date(today.getFullYear(), today.getMonth(), 28));

        expect(result).toStrictEqual(21);
    });
    it("calculates correct age when birthday was a previous month", () => {
        const
            today = Date.today(),
            subject = new Date(today.getFullYear() - 25, 0, 1);

        const result = subject.getAge(new Date(today.getFullYear(), 5, 1));

        expect(result).toStrictEqual(25);
    });
    it("calculates correct age when birthday has not passed this year", () => {
        const
            today = Date.today(),
            subject = new Date(today.getFullYear() - 2, 11, 31);

        const result = subject.getAge(new Date(today.getFullYear(), 1, 14));

        expect(result).toStrictEqual(1);
    });
    it("calculates correct age when birthday is later this month", () => {
        const
            today = Date.today(),
            subject = new Date(today.getFullYear() - 24, 4, 28);

        const result = subject.getAge(new Date(today.getFullYear(), 4, 14));

        expect(result).toStrictEqual(23);
    });
    it("calculates correct age when born yesterday (zero)", () => {
        const
            today = Date.today(),
            subject = new Date(today.getTime() - (3600000 * 24));

        const result = subject.getAge();

        expect(result).toStrictEqual(0);
    });
});