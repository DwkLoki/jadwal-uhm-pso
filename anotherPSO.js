// Define the necessary classes
class Course {
  constructor(name, professor, duration) {
    this.name = name;
    this.professor = professor;
    this.duration = duration;
  }
}

class Room {
  constructor(name, capacity) {
    this.name = name;
    this.capacity = capacity;
    this.availability = []; // Array to track availability slots
  }
}

class Schedule {
  constructor() {
    this.timetable = {}; // Object to store the timetable schedule
  }

  addCourse(course, room, time) {
    if (!this.timetable[room.name]) {
      this.timetable[room.name] = {};
    }

    if (!this.timetable[room.name][time]) {
      this.timetable[room.name][time] = [];
    }

    this.timetable[room.name][time].push(course);
  }

  displayTimetable() {
    for (let room in this.timetable) {
      console.log(`Room: ${room}`);
      for (let time in this.timetable[room]) {
        console.log(`Time: ${time}`);
        this.timetable[room][time].forEach(course => {
          console.log(`Course: ${course.name} | Professor: ${course.professor}`);
        });
      }
    }
  }
}

// Particle Swarm Optimization (PSO) algorithm implementation
class Particle {
  constructor() {
    this.position = {}; // Current particle position
    this.velocity = {}; // Current particle velocity
    this.bestPosition = {}; // Personal best position achieved by the particle
  }
  
  // Initialization of the particle's position and velocity
  initialize(courseList, roomList, timeSlots) {
    // Initialize the position and velocity for each course
    courseList.forEach(course => {
      const randomRoom = roomList[Math.floor(Math.random() * roomList.length)];
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      this.position[course.name] = { room: randomRoom, time: randomTime };
      this.velocity[course.name] = { room: 0, time: 0 };
      this.bestPosition[course.name] = { room: randomRoom, time: randomTime };
    });
  }

  // Update the particle's velocity and position
  updateVelocity(globalBestPosition, inertiaWeight, cognitiveWeight, socialWeight) {
    for (let course in this.velocity) {
      const r1 = Math.random();
      const r2 = Math.random();

      const cognitiveComponent = multiplyVectorByScalar(
        subtractVectors(this.bestPosition[course], this.position[course]),
        cognitiveWeight * r1
      );

      const socialComponent = multiplyVectorByScalar(
        subtractVectors(globalBestPosition[course], this.position[course]),
        socialWeight * r2
      );

      const inertiaComponent = multiplyVectorByScalar(this.velocity[course], inertiaWeight);

      this.velocity[course] = addVectors(inertiaComponent, addVectors(cognitiveComponent, socialComponent));

      // Update the position based on the new velocity
      this.position[course] = addVectors(this.position[course], this.velocity[course]);
    }
  }
}

// Helper functions for vector operations
function addVectors(a, b) {
  const result = {};
  for (let key in a) {
    result[key] = a[key] + b[key];
  }
  return result;
}

function subtractVectors(a, b) {
  const result = {};
  for (let key in a) {
    result[key] = a[key] - b[key];
  }
  return result;
}

function multiplyVectorByScalar(vector, scalar) {
  const result = {};
  for (let key in vector) {
    result[key] = vector[key] * scalar;
  }
  return result;
}

// Main application
const courseList = []; // Array to store the course objects
const roomList = []; // Array to store the room objects
const timeSlots = []; // Array to store the available time slots

// Add courses to the courseList
courseList.push(new Course("Math", "Professor A", 2));
courseList.push(new Course("Physics", "Professor B", 3));
courseList.push(new Course("English", "Professor C", 1));

// Add rooms to the roomList
roomList.push(new Room("Room 1", 30));
roomList.push(new Room("Room 2", 20));

// Add available time slots to the timeSlots array
timeSlots.push("Monday 9:00");
timeSlots.push("Monday 10:00");
timeSlots.push("Monday 11:00");

// PSO parameters
const iterations = 100;
const particleCount = 20;
const inertiaWeight = 0.7;
const cognitiveWeight = 1.4;
const socialWeight = 1.4;

// Initialize the swarm with particles
const swarm = [];
for (let i = 0; i < particleCount; i++) {
  const particle = new Particle();
  particle.initialize(courseList, roomList, timeSlots);
  swarm.push(particle);
}

// Perform PSO iterations
let globalBestPosition = null;
for (let iteration = 0; iteration < iterations; iteration++) {
  // Evaluate fitness for each particle and update global best position
  swarm.forEach(particle => {
    // Generate schedule based on the particle's current position
    const schedule = new Schedule();
    for (let course in particle.position) {
      const { room, time } = particle.position[course];
      schedule.addCourse(courseList.find(c => c.name === course), room, time);
    }
    // Calculate fitness based on defined criteria and update personal best position
    const fitness = calculateFitness(schedule);
    if (!particle.bestFitness || fitness < particle.bestFitness) {
      particle.bestFitness = fitness;
      particle.bestPosition = { ...particle.position };
    }
    // Update global best position if necessary
    if (!globalBestPosition || fitness < calculateFitness(new Schedule(globalBestPosition))) {
      globalBestPosition = { ...particle.position };
    }
  });

  // Update particle velocities and positions
  swarm.forEach(particle => {
    particle.updateVelocity(globalBestPosition, inertiaWeight, cognitiveWeight, socialWeight);
  });
}

// Generate final schedule based on the global best position
const finalSchedule = new Schedule();
for (let course in globalBestPosition) {
  const { room, time } = globalBestPosition[course];
  finalSchedule.addCourse(courseList.find(c => c.name === course), room, time);
}

// Display the final schedule
finalSchedule.displayTimetable();

// Fitness calculation function (customize based on your criteria)
function calculateFitness(schedule) {
  // Add your fitness calculation logic here
  return 0; // Placeholder fitness value
}