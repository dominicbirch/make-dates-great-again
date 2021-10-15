# make-dates-great-again
The built-in javascript date is often counter-intuitive; this library attempts to alleviate this by globally extending the built-in type with some helper methods.

> Use with Caution~ 
> 
> Due to this library directly augmenting the built-in type, it's quite possible that it might collide/conflict with other functionality if another library operates on the same members, or if any of these are added to the built-in implementation in the future.

## Usage
Import the module to apply the global augmentations.
```typescript
import("make-dates-great-again");
```
Or
```javascript
require("make-dates-great-again");
```
Once imported all additional functions become available on the built-in `Date`:
```typescript
const date = new Date("2021-10-10T18:30:00.000Z")
    .addYears(1)
    .addMonths(1)
    .addDays(7)
    .startOfDay();

console.log(date.format("dd/MM/yyyy @hh:mm")) // -> "17/11/2022 12:00"
```

## Supported static
```typescript
today(): Date;
isLeapYear(year: number): boolean;
daysInMonth(year: number, month: number): 31 | 30 | 29 | 28;
daysBetween(start: Date, end: Date): number;
```

## Supported per-instance
```typescript
daysInMonth(): 31 | 30 | 29 | 28;
age(atDate?: Date): number;

isLeapYear(): boolean;
isOnSameDayAs(other: Date): boolean;
isEqualTo(other: Date): boolean;
isAfter(other: Date): boolean;
isBefore(other: Date): boolean;
isBetween(start: Date, end: Date): boolean;

clone(): Date;

addDays(days: number): Date;
addMonths(months: number): Date;
addYears(years: number): Date;
addMs(ms: number): Date;
addSeconds(seconds: number): Date;
addMinutes(minutes: number): Date;
addHours(hours: number): Date;

compare(other: Date): -1 | 0 | 1;

startOfDay(): Date;
startOfMonth(): Date;
startOfYear(): Date;

// Fixed length arrays can be provided in order to customize the language elements like day and month names in order to support a localized format.
format(pattern: string, dayNames?: DayNames, monthNames?: MonthNames, am?: string, pm?: string): string;
```