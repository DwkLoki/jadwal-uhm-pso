const pengampu = [];
const localStoragePengampu = "PENGAMPU_KEY";
// Definisikan slot waktu, hari dan ruangan yang tersedia
let slotWaktu = ["08:00-10:00", "10:00-12:00", "13:00-15:00", "15:00-17:00", "17:00-19:00", "19:00-21:00"];
let hariTersedia = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
let slotRuangan = ["Ruangan 1", "Ruangan 2", "Ruangan 3", "Ruangan 4", "Ruangan 5", "Ruangan 6", "Ruangan 7", "Ruangan 8", "Ruangan 9", "Ruangan 10", "Ruangan 11",];

// Particle Class
class Particle {
  constructor(pengampu) {
    this.pengampu = pengampu;
    // this.fitness = 0;
    this.position = {}; // Current particle position
    this.velocity = {}; // Current particle velocity
    this.bestPosition = {}; // Personal best position achieved by the particle
  }

  // Initialization of the particle's position and velocity
  initialize(pengampu) {
    // Initialize the position and velocity for each course
    pengampu.forEach(ajar => {
        const randomDay = 1 + Math.floor(Math.random() * (7 - 1));
        const randomRoom = 1 + Math.floor(Math.random() * (11 - 1));
        const randomTime = 1 + Math.floor(Math.random() * (6 - 1));
        this.position = { room: randomRoom, time: randomTime, day: randomDay };
        this.velocity = { room: randomRoom, time: randomTime, day: randomDay };
        this.bestPosition = { room: randomRoom, time: randomTime, day: randomDay };
    });
  }

  // Update the particle's velocity and position
  updateVelocity(globalBestPosition, w, c1, c2) {
    for (const key in this.velocity) {
        this.velocity[key] = Math.floor(
            w * this.velocity[key] +
            Math.random() * c1 * (this.bestPosition[key] - this.position[key]) +
            Math.random() * c2 * (globalBestPosition[key] - this.position[key])
        )

        this.position[key] = this.velocity[key] + this.position[key]
    }
  }
}

// load data setiap kali DOM sudah dimuat
document.addEventListener("DOMContentLoaded", function() {
    loadDataFromStorage();

    // Main aplication

    // Definisikan parameter PSO
    let globalBestPosition = null;
    let jumlahPartikel = pengampu.length;
    let iterasiMaksimal = 100;
    let c1 = 1.5;
    let c2 = 1.5;
    let w = 0.5;

    // Initialize the swarm with particles
    const swarm = [];
    for (let i = 0; i < jumlahPartikel; i++) {
        const particle = new Particle(pengampu[i]);
        particle.initialize(pengampu);
        swarm.push(particle);
    }
    // console.log(pengampu.length);

    // Perform PSO iterations
    for (let iteration = 0; iteration < iterasiMaksimal; iteration++) {
        // Evaluate fitness for each particle and update global best position
        swarm.forEach(particle => {
            // Calculate fitness based on defined criteria and update personal best position
            const fitness = calculateFitness(swarm);
            if (!particle.bestFitness || fitness < particle.bestFitness) {
                particle.bestFitness = fitness;
                particle.bestPosition = { ...particle.position };
            }
            // Update global best position if necessary
            if (!globalBestPosition || fitness < globalBestPosition) {
                globalBestPosition = { ...particle.position };
            }
        });

        // Update particle velocities and positions
        swarm.forEach(particle => {
            particle.updateVelocity(globalBestPosition, w, c1, c2);
        });
    }

    // menampilkan hasil pembuatan jadwal
    swarm.forEach(particle => {
        const convertPositionResult = convertPositionToData(particle.position);
        console.log(convertPositionResult);
    });
    // Contoh penggunaan fungsi convertPositionToData
    // const particle = swarm[0]; // Ambil particle pertama dari swarm sebagai contoh
    // const particleData = convertPositionToData(particle.position); // hasil konversi disimpan di sini
    
    console.log(swarm);
    // console.log(particleData);
});

// handle submit
const inputPengampuForm = document.getElementById("inputPengampu");

inputPengampuForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form values
    let courseName = document.getElementById("inputCourseName").value;
    let lecturerName = document.getElementById("inputLecturerName").value;
    let className = document.getElementById("inputClassName").value;
    let academicYear = document.getElementById("inputAcademicYear").value;

    const pengampuObject = generatePengampuObject(courseName, lecturerName, className, academicYear);

    document.getElementById("inputCourseName").value = null;
    document.getElementById("inputLecturerName").value = null;
    document.getElementById("inputClassName").value = null;
    document.getElementById("inputAcademicYear").value = '';

    pengampu.push(pengampuObject);
    saveDataPengampu();

    // Perform validation if needed
    
    
    // Perform further processing, such as sending the data to the server
    
    // For demonstration purposes, log the form data to the console
    // console.log(pengampu);
    // console.log(pengampu.length);
});


// define all function here
function generatePengampuObject(courseName, lecturerName, className, academicYear) {
    return {
        courseName,
        lecturerName,
        className,
        academicYear
    }
}

function saveDataPengampu() {
    const dataJson = JSON.stringify(pengampu);
    localStorage.setItem(localStoragePengampu, dataJson);
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(localStoragePengampu);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null){
        for(let pengampuItem of data){
            pengampu.push(pengampuItem);
        }
    }

    // const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    // const completeBookshelfList = document.getElementById("completeBookshelfList");
    // inCompleteBookshelfList.innerHTML = "";
    // completeBookshelfList.innerHTML = "";
    
    // for(let bookItem of books){
    //     const bookElement = generateBookElement(bookItem);
    //     if (bookItem.isCompleted === true) {
    //         completeBookshelfList.append(bookElement);
    //     } else {
    //         inCompleteBookshelfList.append(bookElement);
    //     }  
    // }
}

// fungsi untuk menghitung nilai fitness
function calculateFitness(particle) {
    let fitness = 0;

    for (let i = 0; i < particle.length; i++) {
        const currentParticle = particle[i];

        // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle saat ini
        const currentTime = currentParticle.position.time;
        const currentDay = currentParticle.position.day;
        const currentRoom = currentParticle.position.room;

        for (let j = i + 1; j < particle.length; j++) {
            const otherParticle = particle[j];

            // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle lainnya
            const otherTime = otherParticle.position.time;
            const otherDay = otherParticle.position.day;
            const otherRoom = otherParticle.position.room;

            // Memeriksa apakah terdapat bentrok jadwal pada slot waktu, hari, atau ruangan
            if (
                currentTime === otherTime &&
                currentDay === otherDay &&
                currentRoom === otherRoom
            ) {
                fitness++; // Menambahkan fitness jika terdapat jadwal yang bentrok
            }
        }
    }

    return fitness;
}

// Fungsi untuk mengkonversi nilai posisi menjadi data yang sesuai
function convertPositionToData(position) {
    const room = slotRuangan[position.room - 1];
    const time = slotWaktu[position.time - 1];
    const day = hariTersedia[position.day - 1];

    return { room, time, day };
}

// // Fungsi untuk mengkonversi nilai posisi menjadi data yang sesuai
// function convertPositionToData(position) {
//   const room = slotRuangan[position.room - 1];
//   const time = slotWaktu[position.time - 1];
//   const day = hariTersedia[position.day - 1];

//   return { room, time, day };
// }

// // Contoh penggunaan fungsi convertPositionToData
// const particle = swarm[0]; // Ambil particle pertama dari swarm sebagai contoh
// const particleData = convertPositionToData(particle.position); // hasil konversi disimpan di sini
// console.log(particleData);