/**
 * Timetable Genetic Algorithm
 * Accepts params:
 *  - courses: array of { id, code, name, weeklyHours, assignedTeacherId }
 *  - teachers: array of teachers
 *  - rooms: array of rooms
 *  - days: array of day names
 *  - slotsPerDay: number
 *  - timeslots: array of time strings
 * If not provided, generator will use fallback mock data.
 */

const defaultDays = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const defaultTimes = ['08:30','09:30','10:30','11:30','12:30','13:30','14:30','15:30'];

function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}

function randomChoice(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function generateInitialPopulation(params, populationSize){
  const { courses, teachers, rooms, days, slotsPerDay, timeslots } = params;
  const pop = [];
  for(let p=0;p<populationSize;p++){
    const slots = [];
    // create map to track used slot counts per course
    const courseHoursLeft = {};
    courses.forEach(c=> courseHoursLeft[c.id] = c.weeklyHours || 3);

    // Simple greedy allocation: iterate through days and slots and assign random course with remaining hours
    for(let d=0; d<days.length; d++){
      for(let s=0; s<slotsPerDay; s++){
        // pick a random course that still needs hours
        const candidates = courses.filter(c=> courseHoursLeft[c.id] > 0);
        if(candidates.length===0){
          // leave empty
          continue;
        }
        const course = randomChoice(candidates);
        // choose teacher for course
        const teacher = teachers.find(t => String(t._id) === String(course.assignedTeacherId)) || randomChoice(teachers);
        const room = randomChoice(rooms.filter(r => r.type === 'Lecture' || !r.type) || rooms);
        const timestr = timeslots[s] || timeslots[0];
        slots.push({ day: days[d], slotIndex: s, time: timestr, course, teacher, room });
        courseHoursLeft[course.id] -= 1;
      }
    }
    pop.push({ slots });
  }
  return pop;
}

function fitnessFunction(individual, params){
  // Lower is better (conflict penalty)
  let penalty = 0;
  const { days, slotsPerDay } = params;

  // teacher collisions: teacher cannot be in two slots same day+slotIndex
  const teacherMap = {};
  const roomMap = {};

  individual.slots.forEach(slot => {
    const key = `${slot.day}-${slot.slotIndex}`;
    if(slot.teacher && slot.teacher._id){
      const tkey = `${slot.teacher._id}-${key}`;
      teacherMap[tkey] = (teacherMap[tkey] || 0) + 1;
    }
    if(slot.room && slot.room._id){
      const rkey = `${slot.room._id}-${key}`;
      roomMap[rkey] = (roomMap[rkey] || 0) + 1;
    }
    // room capacity not enforced to students here
  });

  Object.values(teacherMap).forEach(v => { if(v>1) penalty += (v-1)*10; });
  Object.values(roomMap).forEach(v => { if(v>1) penalty += (v-1)*10; });

  // teacher load heuristics: count total assigned slots for each teacher
  const teacherLoad = {};
  individual.slots.forEach(slot => {
    const id = slot.teacher && (slot.teacher._id || slot.teacher.id) ? (slot.teacher._id || slot.teacher.id) : null;
    if(id){ teacherLoad[id] = (teacherLoad[id]||0) + 1; }
  });
  const avg = Object.values(teacherLoad).length>0 ? (Object.values(teacherLoad).reduce((a,b)=>a+b,0)/Object.values(teacherLoad).length) : 0;
  // penalize big deviations
  Object.values(teacherLoad).forEach(load => {
    penalty += Math.abs(load - avg) * 0.2;
  });

  // encourage filling required weekly hours: penalize missing scheduled hours
  const courseCount = {};
  individual.slots.forEach(slot => { if(slot.course && slot.course.id) courseCount[slot.course.id] = (courseCount[slot.course.id]||0) + 1; });
  params.courses.forEach(c => {
    const scheduled = courseCount[c.id] || 0;
    const target = c.weeklyHours || 3;
    if(scheduled < target) penalty += (target - scheduled) * 5; // heavy penalty
    if(scheduled > target) penalty += (scheduled - target) * 1; // mild penalty
  });

  return penalty;
}

function selection(population, fitnesses){
  // tournament selection
  const selected = [];
  for(let i=0;i<population.length;i++){
    const a = Math.floor(Math.random()*population.length);
    const b = Math.floor(Math.random()*population.length);
    selected.push(fitnesses[a] < fitnesses[b] ? deepClone(population[a]) : deepClone(population[b]));
  }
  return selected;
}

function crossover(parentA, parentB){
  // single-point crossover on slots array
  const total = Math.min(parentA.slots.length, parentB.slots.length);
  if(total === 0) return deepClone(parentA);
  const cp = Math.floor(Math.random()*total);
  const child = { slots: [] };
  for(let i=0;i<total;i++){
    child.slots.push(i < cp ? deepClone(parentA.slots[i]) : deepClone(parentB.slots[i]));
  }
  return child;
}

function mutate(individual, params, mutationRate=0.05){
  const { courses, teachers, rooms, timeslots } = params;
  individual.slots.forEach(slot => {
    if(Math.random() < mutationRate){
      // randomly change course / teacher / room
      const course = randomChoice(courses);
      slot.course = deepClone(course);
      slot.teacher = deepClone(teachers.find(t => String(t._id) === String(course.assignedTeacherId)) || randomChoice(teachers));
      slot.room = deepClone(randomChoice(rooms));
      slot.time = timeslots && timeslots[slot.slotIndex] ? timeslots[slot.slotIndex] : slot.time;
    }
  });
}

function bestFrom(population, params){
  let best = null; let bestScore = Infinity;
  for(const ind of population){
    const s = fitnessFunction(ind, params);
    if(s < bestScore){ bestScore = s; best = ind; }
  }
  return { best, bestScore };
}

function normalizeSlots(slots, params){
  // ensure slotIndex and time are present
  const times = params.timeslots || defaultTimes;
  return slots.map(s=>({
    day: s.day,
    slotIndex: s.slotIndex,
    time: s.time || times[s.slotIndex] || times[0],
    course: s.course,
    teacher: s.teacher,
    room: s.room
  }));
}

module.exports.generate = function(params = {}){
  // Validate and set defaults
  const courses = params.courses || [];
  const teachers = params.teachers || [];
  const rooms = params.rooms || [];
  const days = params.days || defaultDays;
  const slotsPerDay = params.slotsPerDay || (params.timeslots ? params.timeslots.length : defaultTimes.length);
  const timeslots = params.timeslots || defaultTimes;

  // If no courses / teachers / rooms provided, create small mock sets to allow generation
  const mockId = (i)=>`m_${i}`;
  const realCourses = courses.length?courses:courses;
  if(realCourses.length === 0){
    for(let i=0;i<6;i++){
      realCourses.push({ id: mockId(i), code: `CSE${100+i}`, name: `Course ${i+1}`, weeklyHours: 3, assignedTeacherId: null });
    }
  }
  const realTeachers = teachers.length?teachers:[];
  if(realTeachers.length === 0){
    for(let i=0;i<4;i++) realTeachers.push({ _id: mockId('t'+i), name: `Teacher ${i+1}` });
  }
  const realRooms = rooms.length?rooms:[];
  if(realRooms.length === 0){
    for(let i=0;i<6;i++) realRooms.push({ _id: mockId('r'+i), name: `R${i+1}`, type: 'Lecture', capacity: 60 });
  }

  const p = { courses: realCourses, teachers: realTeachers, rooms: realRooms, days, slotsPerDay, timeslots };

  // GA main loop
  const POP = 40;
  const GENERATIONS = 60;
  let population = generateInitialPopulation(p, POP);

  for(let gen=0; gen<GENERATIONS; gen++){
    // evaluate
    const fitnesses = population.map(ind => fitnessFunction(ind, p));
    // selection
    const selected = selection(population, fitnesses);
    // crossover
    const children = [];
    for(let i=0;i<selected.length;i+=2){
      const a = selected[i];
      const b = selected[i+1] || selected[0];
      const child1 = crossover(a,b);
      const child2 = crossover(b,a);
      children.push(child1, child2);
    }
    // mutation
    children.forEach(ch => mutate(ch, p, 0.06));
    population = children;
  }

  // choose best
  const { best } = bestFrom(population, p);
  const normalized = normalizeSlots(best.slots, p);
  return { slots: normalized };
};
