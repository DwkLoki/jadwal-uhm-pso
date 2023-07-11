const pengampu = [];
const localStoragePengampu = "PENGAMPU_GENAP";
// Definisikan slot waktu, hari dan ruangan yang tersedia
let slotWaktu = ["08:00-10:00", "10:00-12:00", "13:00-15:00", "15:00-17:00", "17:00-19:00", "19:00-21:00"];
let hariTersedia = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
let slotRuangan = ["205", "101", "305", "306", "402", "403", "404", "FHIS 01", "Pasca Lt.1", "Lab 1", "Lab 2"];

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

    // const prosesJadwalBtn = document.querySelector("section .proses-jadwal-btn");
    // prosesJadwalBtn.addEventListener("click", function() {
        // Main aplication

        // Definisikan parameter PSO
        let globalBestPosition = null;
        let jumlahPartikel = pengampu.length;
        let iterasiMaksimal = 100;
        let c1 = 2;
        let c2 = 2;
        let w = 1;

        // Initialize the swarm with particles
        const swarm = [];
        for (let i = 0; i < jumlahPartikel; i++) {
            const particle = new Particle(pengampu[i]);
            particle.initialize(pengampu);
            swarm.push(particle);
        }

        // ini tambahan kode, bisa dihapus nanti (eksperimen)
        // Define initial and final values for w
        const initialW = 1.0; // Initial inertia weight
        const finalW = 0.4; // Final inertia weight
        const maxIterations = 50000; // Total number of iterations
        let currentIteration = 0; // Current iteration
        
        // Perform PSO iterations until fitness reaches 0
        // let iteration = 0;
        let fitness = calculateFitness(swarm);
        // let w = initialW;

        while (fitness > 0 && currentIteration < maxIterations) {
            // Evaluate fitness for each particle and update global best position
            swarm.forEach(particle => {
                // Calculate fitness based on defined criteria and update personal best position
                const particleFitness = calculateFitness(swarm);
                if (!particle.bestFitness || particleFitness < particle.bestFitness) {
                    particle.bestFitness = particleFitness;
                    particle.bestPosition = { ...particle.position };
                }
                // Update global best position if necessary
                if (!globalBestPosition || particleFitness < globalBestPositionFitness) {
                    globalBestPosition = { ...particle.position };
                    globalBestPositionFitness = particleFitness;
                }
            });

            // Update particle velocities and positions
            swarm.forEach(particle => {
                particle.updateVelocity(globalBestPosition, w, c1, c2);
            });

            // Update inertia weight (w) based on current iteration
            const progress = currentIteration / maxIterations;
            w = 1 - (1 - 0.4) * progress;

            // iteration++;
            fitness = calculateFitness(swarm);
            currentIteration++;
        }
        
        console.log("Final fitness:", fitness);

        // menampilkan hasil pembuatan jadwal
        swarm.forEach(particle => {
            const convertPositionResult = convertPositionToData(particle.position);
            const finalSwarm = {...convertPositionResult, ...particle.pengampu};
            console.log(finalSwarm);
        });
        
        console.log(swarm);
    // })
});

// handle submit
const inputPengampuForm = document.getElementById("inputPengampu");

inputPengampuForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form values
    const pengampuId = +new Date();

    let courseName = document.getElementById("inputCourseName").value;
    let lecturerName = document.getElementById("inputLecturerName").value;
    let className = document.getElementById("inputClassName").value;
    let jenisMatkul = document.getElementById("inputJenisMatkul").value;
    let kategoriKelas = document.getElementById("inputKategoriKelas").value;
    let fakultas = document.getElementById("inputFakultas").value;

    const pengampuObject = generatePengampuObject(pengampuId, courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas);

    document.getElementById("inputCourseName").value = null;
    document.getElementById("inputLecturerName").value = null;
    document.getElementById("inputClassName").value = null;
    document.getElementById("inputJenisMatkul").value = '';
    document.getElementById("inputKategoriKelas").value = '';
    document.getElementById("inputFakultas").value = '';


    pengampu.push(pengampuObject);
    saveDataPengampu();

    // Perform validation if needed
    
    
    // Perform further processing, such as sending the data to the server
    
    // For demonstration purposes, log the form data to the console
    console.log(pengampu);
    // console.log(pengampu.length);

    // menampilkan semua data pada array pengampu dalam bentuk baris tabel
    const tabelDaftarPengampu = document.querySelector("tbody");
    tabelDaftarPengampu.innerHTML = '';

    for (const pengampuItem of pengampu) {
        const newPengampuElement = generatePengampuElement(pengampuItem);
        tabelDaftarPengampu.append(newPengampuElement);
    }
});

// define all function here
function generatePengampuObject(pengampuId, courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas) {
    return {
        pengampuId,
        courseName,
        lecturerName,
        className,
        jenisMatkul,
        kategoriKelas,
        fakultas
    }
}

function generatePengampuElement(pengampuObject) {
    const logoEditBtn = document.createElement("i");
    logoEditBtn.classList.add("bi", "bi-pencil-square");

    const logoDeleteBtn = document.createElement("i");
    logoDeleteBtn.classList.add("bi", "bi-trash");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("type", "button");
    editBtn.setAttribute("data-bs-toggle", "modal");
    editBtn.setAttribute("data-bs-target", "#editModal");
    editBtn.append(logoEditBtn);
    // editBtn.addEventListener("click", function(e) {
    //     handleEditButton(pengampuObject.pengampuId);
    // })

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.append(logoDeleteBtn);
    deleteBtn.addEventListener("click", function() {
        const selectedPengampu = pengampu.indexOf(pengampuObject);
        pengampu.splice(selectedPengampu, 1);

        const tabelDaftarPengampu = document.querySelector("tbody");
        tabelDaftarPengampu.innerHTML = '';

        for (const pengampuItem of pengampu) {
            const newPengampuElement = generatePengampuElement(pengampuItem);
            tabelDaftarPengampu.append(newPengampuElement);
        }

        saveDataPengampu();
    })

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("action-btn");
    btnContainer.append(editBtn, deleteBtn);

    const dataKolomAksi = document.createElement("td");
    dataKolomAksi.append(btnContainer);

    const dataKolomKelas = document.createElement("td");
    dataKolomKelas.innerText = pengampuObject.className;

    const dataKolomDosen = document.createElement("td");
    dataKolomDosen.innerText = pengampuObject.lecturerName;

    const dataKolomMatkul = document.createElement("td");
    dataKolomMatkul.innerText = pengampuObject.courseName;

    const dataKolomNomor = document.createElement("td");
    dataKolomNomor.innerText = pengampu.indexOf(pengampuObject) + 1; //mendapatkan indeks sebuah array

    const dataPengampuElement = document.createElement("tr");
    dataPengampuElement.append(dataKolomNomor, dataKolomMatkul, dataKolomDosen, dataKolomKelas, dataKolomAksi);

    return dataPengampuElement;
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

    // menampilkan semua data pada array pengampu dalam bentuk baris tabel
    const tabelDaftarPengampu = document.querySelector("tbody");
    tabelDaftarPengampu.innerHTML = '';

    for (const pengampuItem of pengampu) {
        const newPengampuElement = generatePengampuElement(pengampuItem);
        tabelDaftarPengampu.append(newPengampuElement);
    }
}

// handle edit button pengampu
function handleEditButton(pengampuId) {
    const selectedPengampu = pengampu.find(pengampu => pengampu.pengampuId === pengampuId);

    // Set modal form values
    document.getElementById("editCourseName").value = selectedPengampu.courseName;
    document.getElementById("editLecturerName").value = selectedPengampu.lecturerName;
    document.getElementById("editClassName").value = selectedPengampu.className;
    document.getElementById("editJenisMatkul").value = selectedPengampu.jenisMatkul;
    document.getElementById("editKategoriKelas").value = selectedPengampu.kategoriKelas;
    document.getElementById("editFakultas").value = selectedPengampu.fakultas;

    // handle edit form submit event
    const editPengampuForm = document.getElementById("editPengampu");

    editPengampuForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission

        // Retrieve form values
        const newCourseName = document.getElementById("editCourseName").value;
        const newLecturerName = document.getElementById("editLecturerName").value;
        const newClassName = document.getElementById("editClassName").value;
        const newJenisMatkul = document.getElementById("editJenisMatkul").value;
        const newKategoriKelas = document.getElementById("editKategoriKelas").value;
        const newFakultas = document.getElementById("editFakultas").value;

        // Update the copied pengampu object with new values
        selectedPengampu.courseName = newCourseName;
        selectedPengampu.lecturerName = newLecturerName;
        selectedPengampu.className = newClassName;
        selectedPengampu.jenisMatkul = newJenisMatkul;
        selectedPengampu.kategoriKelas = newKategoriKelas;
        selectedPengampu.fakultas = newFakultas;

        // Find the pengampu object in the array
        const selectedPengampuAgain = pengampu.find(pengampu => pengampu.pengampuId === pengampuId);
        // console.log(selectedPengampuAgain.pengampuId);
        // Update the pengampu object with new values
        // selectedPengampuAgain.pengampuId = pengampuId
        selectedPengampuAgain.courseName = newCourseName;
        selectedPengampuAgain.lecturerName = newLecturerName;
        selectedPengampuAgain.className = newClassName;
        selectedPengampuAgain.jenisMatkul = newJenisMatkul;
        selectedPengampuAgain.kategoriKelas = newKategoriKelas;
        selectedPengampuAgain.fakultas = newFakultas;

        // Save the updated pengampu array to local storage
        saveDataPengampu();

        // Update the table with the updated pengampu data
        const tabelDaftarPengampu = document.querySelector("tbody");
        tabelDaftarPengampu.innerHTML = '';
        
        for (const pengampuItem of pengampu) {
            const newPengampuElement = generatePengampuElement(pengampuItem);
            tabelDaftarPengampu.append(newPengampuElement);
        }
        // return false;
    });
}

// fungsi untuk menghitung nilai fitness
// function calculateFitness(particle) {
//     let fitness = 0;

//     for (let i = 0; i < particle.length; i++) {
//         const currentParticle = particle[i];

//         // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle saat ini
//         const currentTime = currentParticle.position.time;
//         const currentDay = currentParticle.position.day;
//         const currentRoom = currentParticle.position.room;

//         for (let j = i + 1; j < particle.length; j++) {
//             const otherParticle = particle[j];

//             // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle lainnya
//             const otherTime = otherParticle.position.time;
//             const otherDay = otherParticle.position.day;
//             const otherRoom = otherParticle.position.room;

//             // Memeriksa apakah terdapat bentrok jadwal pada slot waktu, hari, atau ruangan
//             if (
//                 currentTime === otherTime &&
//                 currentDay === otherDay &&
//                 currentRoom === otherRoom
//             ) {
//                 fitness++; // Menambahkan fitness jika terdapat jadwal yang bentrok
//             }
//         }
//     }

//     return fitness;
// }

function calculateFitness(particle) {
  let fitness = 0;

  for (let i = 0; i < particle.length; i++) {
    const currentParticle = particle[i];

    // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle saat ini
    const currentTime = currentParticle.position.time;
    const currentDay = currentParticle.position.day;
    const currentRoom = currentParticle.position.room;
    const currentFakultas = currentParticle.pengampu.fakultas;
    const currentJenisMatkul = currentParticle.pengampu.jenisMatkul;
    const currentKategoriKelas = currentParticle.pengampu.kategoriKelas;

    for (let j = i + 1; j < particle.length; j++) {
      const otherParticle = particle[j];

      // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle lainnya
      const otherTime = otherParticle.position.time;
      const otherDay = otherParticle.position.day;
      const otherRoom = otherParticle.position.room;
      const otherFakultas = otherParticle.pengampu.fakultas;
      const otherJenisMatkul = otherParticle.pengampu.jenisMatkul;
      const otherKategoriKelas = otherParticle.pengampu.kategoriKelas;

      // Memeriksa apakah terdapat bentrok jadwal pada slot waktu, hari, atau ruangan
      if (
        currentTime === otherTime &&
        currentDay === otherDay &&
        currentRoom === otherRoom
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal yang bentrok
      }

      // Memeriksa kriteria tambahan
      if (
        currentFakultas === "hukum" &&
        otherFakultas === "hukum" &&
        currentRoom !== "FHIS 01" &&
        otherRoom !== "FHIS 01"
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal hukum yang tidak di ruangan FHIS 01
      }

      if (
        currentFakultas === "ilkom" &&
        otherFakultas === "ilkom" &&
        currentRoom === "FHIS 01" &&
        otherRoom === "FHIS 01"
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal ilkom yang di ruangan FHIS 01
      }

      if (
        currentJenisMatkul === "praktikum" &&
        otherJenisMatkul === "praktikum" &&
        currentRoom !== "Lab 1" &&
        currentRoom !== "Lab 2" &&
        otherRoom !== "Lab 1" &&
        otherRoom !== "Lab 2"
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal praktikum yang tidak di ruangan Lab 1 atau Lab 2
      }

      if (
        currentJenisMatkul === "teori" &&
        otherJenisMatkul === "teori" &&
        currentRoom === "Lab 1" &&
        currentRoom === "Lab 2" &&
        otherRoom === "Lab 1" &&
        otherRoom === "Lab 2"
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal teori yang di ruangan Lab 1 atau Lab 2
      }

      if (
        currentKategoriKelas === "malam" &&
        otherKategoriKelas === "malam" &&
        (currentDay === "Senin" ||
          currentDay === "Selasa" ||
          currentDay === "Rabu" ||
          currentDay === "Kamis" ||
          currentDay === "Jumat") &&
        (otherDay === "Senin" ||
          otherDay === "Selasa" ||
          otherDay === "Rabu" ||
          otherDay === "Kamis" ||
          otherDay === "Jumat") &&
        (currentTime === "17:00-19:00" || currentTime === "19:00-21:00") &&
        (otherTime === "17:00-19:00" || otherTime === "19:00-21:00")
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal malam yang tidak di hari dan slot waktu yang tersedia
      }

      if (
        currentKategoriKelas === "ekstensi" &&
        otherKategoriKelas === "ekstensi" &&
        (currentDay === "Sabtu" || currentDay === "Minggu") &&
        (otherDay === "Sabtu" || otherDay === "Minggu")
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal ekstensi yang tidak di hari yang tersedia
      }

      if (
        currentKategoriKelas === "reguler" &&
        otherKategoriKelas === "reguler" &&
        (currentDay === "Senin" ||
          currentDay === "Selasa" ||
          currentDay === "Rabu" ||
          currentDay === "Kamis" ||
          currentDay === "Jumat") &&
        (otherDay === "Senin" ||
          otherDay === "Selasa" ||
          otherDay === "Rabu" ||
          otherDay === "Kamis" ||
          otherDay === "Jumat") &&
        (currentTime === "08:00-10:00" ||
          currentTime === "10:00-12:00" ||
          currentTime === "13:00-15:00" ||
          currentTime === "15:00-17:00") &&
        (otherTime === "08:00-10:00" ||
          otherTime === "10:00-12:00" ||
          otherTime === "13:00-15:00" ||
          otherTime === "15:00-17:00")
      ) {
        fitness++; // Menambahkan fitness jika terdapat jadwal reguler yang tidak di hari dan slot waktu yang tersedia
      }
    }
  }

  return fitness;
}

// Fungsi untuk mengkonversi nilai posisi menjadi data yang sesuai
function convertPositionToData(position) {
    let roomIndex = (position.room - 1) % slotRuangan.length;
    let timeIndex = (position.time - 1) % slotWaktu.length;
    let dayIndex = (position.day - 1) % hariTersedia.length;

    if (roomIndex < 0) {
        roomIndex += slotRuangan.length;
    }

    if (timeIndex < 0) {
        timeIndex += slotWaktu.length;
    }

    if (dayIndex < 0) {
        dayIndex += hariTersedia.length;
    }

    const room = slotRuangan[roomIndex];
    const time = slotWaktu[timeIndex];
    const day = hariTersedia[dayIndex];

    return { room, time, day };
}