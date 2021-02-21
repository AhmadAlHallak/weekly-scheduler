# weekly-scheduler
A small script for scheduling college courses. Can work for any recurring weekly tasks, where each task can have more than one "section" to achieve said task.
Takes an array of course (or task) objects and returns all possible schedules (in two forms, as a schedule, or as a list of "sections").

# Install

```
npm i AhmadAlHallak/weekly-scheduler
```

## Usage

```js
const scheduler = require('weekly-scheduler');

// Sample input
const courses = [
  {
    name: 'ME308',
    sections: [
    { sectionSlots: { T: [660, 710], U: [600, 710] }, secCourse: 'ME308' }
    ],
  },
  {
    name: 'ME201',
    sections: [
      { sectionSlots: { T: [840, 950], U: [900, 950] }, secCourse: 'ME201' },
      { sectionSlots: { M: [600, 710], T: [780, 830] }, secCourse: 'ME201' },
    ],
  },
];
console.log(JSON.stringify(scheduler(courses).sectionsList, null, 2));
```
Sample output =>
```js
[
  [
    { sectionSlots: { T: [660, 710], U: [600, 710] }, secCourse: 'ME308' },
    { sectionSlots: { T: [840, 950], U: [900, 950] }, secCourse: 'ME201' },
  ],
  [
    { sectionSlots: { T: [660, 710], U: [600, 710] }, secCourse: 'ME308' },
    { sectionSlots: { M: [600, 710], T: [780, 830] }, secCourse: 'ME201' },
  ],
]
```
## API

### `scheduler(courses)`

Returns an object with the results in two forms, `sectionsList` which is an array of "sections" as in the example above, and `schedules` an array of schedules that contain only the times.

### `courses`

Type: `Array<object>`

Each  course (or task) object needs to have a sections property, which is an array of objects each of which needs to have a property named sectionSlots, which is an object with the times of the task stored in it in the form:
```js
sectionSlots: { T: [660, 710], U: [600, 710] }
```
Where T and U are shorthand for Tuesday and sUnday (U, M, T, W, R, F, S), and `[660, 710]` is the start and end of the timeslot for that day in minutes.
So for the example in the usage section, the `ME201` course/task has two possible "sections" (one and only one "section" should be scheduled for a task to be considered as fulfilled), one on tuesdays (from 11:00 am to 11:50 am) and on sundays (from 10:00 am to 11:50 am), and another on mondays and tuesdays.

## Note:
I made this script along with [ellucian-banner-sections-scraper](https://github.com/AhmadAlHallak/ellucian-banner-sections-scraper) to help me find schedules to register each new term in college. So both are best used in tandem.

I made this script a long time ago, so review the code properly before using.
