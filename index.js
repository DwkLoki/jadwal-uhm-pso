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

    // Main aplication

    // // Definisikan parameter PSO
    // let globalBestPosition = null;
    // let jumlahPartikel = pengampu.length;
    // let iterasiMaksimal = 100;
    // let c1 = 2;
    // let c2 = 2;
    // let w = 0.9;

    // // Initialize the swarm with particles
    // const swarm = [];
    // for (let i = 0; i < jumlahPartikel; i++) {
    //     const particle = new Particle(pengampu[i]);
    //     particle.initialize(pengampu);
    //     swarm.push(particle);
    // }

    // // Perform PSO iterations until fitness reaches 0
    // // let iteration = 0;
    // let fitness = calculateFitness(swarm);

    // while (fitness > 0) {
    //     // Evaluate fitness for each particle and update global best position
    //     swarm.forEach(particle => {
    //         // Calculate fitness based on defined criteria and update personal best position
    //         const particleFitness = calculateFitness(swarm);
    //             if (!particle.bestFitness || particleFitness < particle.bestFitness) {
    //             particle.bestFitness = particleFitness;
    //             particle.bestPosition = { ...particle.position };
    //         }
    //         // Update global best position if necessary
    //         if (!globalBestPosition || particleFitness < globalBestPositionFitness) {
    //             globalBestPosition = { ...particle.position };
    //             globalBestPositionFitness = particleFitness;
    //         }
    //     });

    //     // Update particle velocities and positions
    //     swarm.forEach(particle => {
    //         particle.updateVelocity(globalBestPosition, w, c1, c2);
    //     });

    //     // iteration++;
    //     fitness = calculateFitness(swarm);
    // }
    
    // console.log("Final fitness:", fitness);

    // // menampilkan hasil pembuatan jadwal
    // swarm.forEach(particle => {
    //     const convertPositionResult = convertPositionToData(particle.position);
    //     const finalSwarm = {...convertPositionResult, ...particle.pengampu};
    //     console.log(finalSwarm);
    // });
    
    // console.log(swarm);
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

    // for (let i = 0; i < pengampu.length; i++) {
    //     const dataPengampu = document.createElement("tr");
    //     dataPengampu.innerHTML = 
    //     `
    //         <td scope="row">${i + 1}</td>
    //         <td>${pengampu[i].courseName}</td>
    //         <td>${pengampu[i].lecturerName}</td>
    //         <td>${pengampu[i].className}</td>
    //         <td>
    //             <div class="action-btn">
    //                 <button class="edit-btn">
    //                     <i class="bi bi-pencil-square"></i>
    //                 </button>
    //                 <button class="delete-btn">
    //                     <i class="bi bi-trash"></i>
    //                 </button>
    //             </div>
    //         </td>
    //     `

    //     tabelDaftarPengampu.append(dataPengampu);
    // }
});

// handle delete dan edit button
// const deletePengampuBtn = document.querySelector(".delete-btn");
// deletePengampuBtn.addEventListener("click", function() {
//     console.log("hallo");
// })

// handle submit
// const inputPengampuForm = document.getElementById("inputPengampu");

// inputPengampuForm.addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent form submission

//     // Retrieve form values
//     const pengampuId = +new Date();

//     let courseName = document.getElementById("inputCourseName").value;
//     let lecturerName = document.getElementById("inputLecturerName").value;
//     let className = document.getElementById("inputClassName").value;
//     let jenisMatkul = document.getElementById("inputJenisMatkul").value;
//     let kategoriKelas = document.getElementById("inputKategoriKelas").value;
//     let fakultas = document.getElementById("inputFakultas").value;

//     const pengampuObject = generatePengampuObject(pengampuId, courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas);

//     document.getElementById("inputCourseName").value = null;
//     document.getElementById("inputLecturerName").value = null;
//     document.getElementById("inputClassName").value = null;
//     document.getElementById("inputJenisMatkul").value = '';
//     document.getElementById("inputKategoriKelas").value = '';
//     document.getElementById("inputFakultas").value = '';


//     pengampu.push(pengampuObject);
//     saveDataPengampu();

//     // Perform validation if needed
    
    
//     // Perform further processing, such as sending the data to the server
    
//     // For demonstration purposes, log the form data to the console
//     console.log(pengampu);
//     // console.log(pengampu.length);
// });


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
    editBtn.append(logoEditBtn);
    editBtn.addEventListener("click", function() {
        console.log("berhasil edit");
    })

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.append(logoDeleteBtn);
    deleteBtn.addEventListener("click", function() {
        console.log("berhasil hapus");
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
    dataKolomNomor.innerText = "1";

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

    // const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    // const completeBookshelfList = document.getElementById("completeBookshelfList");
    // inCompleteBookshelfList.innerHTML = "";
    // completeBookshelfList.innerHTML = "";

    // const tabelDaftarPengampu = document.querySelector("tbody");
    // tabelDaftarPengampu.innerHTML = '';

    // for (let i = 0; i < pengampu.length; i++) {
    //     const dataPengampu = document.createElement("tr");
    //     dataPengampu.innerHTML = 
    //     `
    //         <td scope="row">${i + 1}</td>
    //         <td>${pengampu[i].courseName}</td>
    //         <td>${pengampu[i].lecturerName}</td>
    //         <td>${pengampu[i].className}</td>
    //         <td>
    //             <div class="action-btn">
    //                 <button class="edit-btn">
    //                     <i class="bi bi-pencil-square"></i>
    //                 </button>
    //                 <button class="delete-btn">
    //                     <i class="bi bi-trash"></i>
    //                 </button>
    //             </div>
    //         </td>
    //     `

    //     tabelDaftarPengampu.append(dataPengampu);
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