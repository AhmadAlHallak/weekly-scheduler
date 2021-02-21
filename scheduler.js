
// Tries to register a section in a given schedule
const registerInSchedule = (section, schedule, registeredSections) => {
  let schedule2;
  const copyRegisteredSections = [...registeredSections];
  // In case the schedule was empty then define it and add the section to it
  if (schedule.length === 0) {
    schedule2 = {
      U: [],
      M: [],
      T: [],
      W: [],
      R: [],
      F: [],
      S: [],
    };
    Object.keys(section.sectionSlots).forEach((day) => {
      schedule2[day].push(section.sectionSlots[day]);
    });

    // Otherwise loop over the days to see if registering it is possible.
  } else {
    // Copying the original schedule so as not to change it in case the registration failed
    schedule2 = JSON.parse(JSON.stringify(schedule));
    // eslint-disable-next-line no-restricted-syntax
    for (const day of Object.keys(section.sectionSlots)) {
      const len = schedule2[day].length;
      const secStart = section.sectionSlots[day][0];
      const secEnd = section.sectionSlots[day][1];
      let i = 0;
      // Check that the schedule for the day is not empty
      if (len !== 0) {
        // Check if the section we want to add is before any other registered section on that day
        if (secEnd < schedule2[day][i][0]) {
          schedule2[day].splice(i, 0, section.sectionSlots[day]);
        } else if (secStart > schedule2[day][len - 1][1]) {
          // If not the check to if the section is after any other registered section on that day
          schedule2[day].push(section.sectionSlots[day]);
        } else {
          // Otherwise check the timeslot of the section for each occupied timeslot on that day
          for (; i < len; i += 1) {
            const schSlotStart = schedule2[day][i][0];
            const schSlotEnd = schedule2[day][i][1];
            if (secStart < schSlotStart) {
              if (secEnd < schSlotStart) {
                // If the timeslot starts and ends before the examined timeslot, submit it.
                schedule2[day].splice(i, 0, section.sectionSlots[day]);
                break;
              } else {
                // If it starts before the examined timeslot and ends after it, an overlap occurs.
                return [false];
              }
            } else if (secStart <= schSlotEnd) {
              // If it starts during the period of the examined timeslot, an overlap occurs.
              return [false];
            }
          }
        }
      } else {
        // If there was no timeslots scheduled for the day examined then just add the timeslots
        schedule2[day].push(section.sectionSlots[day]);
      }
    }
  }

  copyRegisteredSections.push(section);
  return [schedule2, copyRegisteredSections];
};

// Recursively finds possible schedules for the given courses.
const registrar = (courses) => {
// Drastically improve the performance of the function by minimizing the number of starting branches
courses.sort((a, b) => a.sections.length - b.sections.length);
  const schedules = [];
  const sectionsList = [];
  // Define a recursive function to handle the branching of the possible schedules
  function recurReg(schedule, registeredSections, depth) {
    if (depth === courses.length) {
      // The function finished the current branch of the recursive tree successfully.
      schedules.push(schedule);
      sectionsList.push(registeredSections);
      // Go back one level in the tree so that other possible schedules are found
      depth -= 1;
      return;
    }
    // 'Branch out' for each section in the current level (course)
    for (let i = 0; i < courses[depth].sections.length; i += 1) {
      // Try to register the section in the current schedule
      const section = courses[depth].sections[i];
      // eslint-disable-next-line max-len
      const [schedule2, registeredSections2] = registerInSchedule(section, schedule, registeredSections);
      // If the section was registered successfully then go to the next level on this branch
      // (call recurReg on the following course)
      if (schedule2) {
        recurReg(schedule2, registeredSections2, depth + 1);
      }
      // If the above condition fails or the previous branches are finished processing
      // then go to the next branch (the next section in this course)
    }
    // When the loop finishes then all of the branches on this node were processed.
    // So go back to previous level (course)
    depth -= 1;
  }
  // Call recurReg with empty values to recursively find possible schedules
  recurReg([], [], 0);
  return {sectionsList, schedules}; 
};
