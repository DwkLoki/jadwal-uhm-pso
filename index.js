const pengampu = [];
const pesanan = [];
const particlesToUpdate = [];
const localStoragePengampu = "PENGAMPU_GENAP";
const localStoragePesanan = "JADWAL_PESANAN";
// Definisikan slot waktu, hari dan ruangan yang tersedia
let slotWaktu = ["08:00-10:00", "10:00-12:00", "13:00-15:00", "15:00-17:00", "17:00-19:00", "19:00-21:00"];
let hariTersedia = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
let slotRuangan = ["205", "101", "305", "306", "402", "403", "404", "FHIS 01", "Pasca Lt.1", "Lab 1", "Lab 2"];

// Particle Class
class Particle {
    constructor(pengampu) {
        this.pengampu = pengampu;
        this.fitness = 0;
        this.position = {}; // Current particle position
        this.velocity = {}; // Current particle velocity
        this.bestPosition = {}; // Personal best position achieved by the particle
        this.isSesuaiKriteria = false;
    }

    initialize(pengampu) {
        let randomDay, randomRoom, randomTime;
        
        // Randomly select day, time and room
        if (pengampu.kategoriKelas === "reguler") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 4) + 1; // 1-4 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00)

            if (pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (pengampu.kategoriKelas === "malam") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 2) + 5; // 5-6 (17:00-19:00, 19:00-21:00)

            if (pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (pengampu.kategoriKelas === "ekstensi") {
            randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
            randomTime = Math.floor(Math.random() * 6) + 1; // 1-6 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00)
        
            if (pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9

                while (randomRoom === 9) {
                    randomRoom = Math.floor(Math.random() * 9) + 1; // Menghasilkan ulang angka acak jika angka sebelumnya adalah 9
                }

            } else if (pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }
        }

        // Menentukan room, time dan day matkul hukum
        if (pengampu.fakultas === "hukum") {
            randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
            randomTime = Math.floor(Math.random() * 5) + 1; // 1-5 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00)
            randomRoom = Math.floor(Math.random() * 3) + 7; // 7-9
        }
        
        // Assign position and velocity
        this.position = { room: randomRoom, time: randomTime, day: randomDay };
        this.velocity = { room: randomRoom, time: randomTime, day: randomDay };
        this.bestPosition = { room: randomRoom, time: randomTime, day: randomDay };
    }

    // cek status optimal partikel
    checkStatus(swarm) {
        // let particleFitness = 0;
        const currentParticle = this;

        // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle saat ini
        const currentTime = currentParticle.position.time;
        const currentDay = currentParticle.position.day;
        const currentRoom = currentParticle.position.room;

        for (let i = 0; i < swarm.length; i++) {
            const otherParticle = swarm[i];

            if (currentParticle === otherParticle) continue; // Skip jika partikel sama
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
                this.fitness++; // Tambahkan fitness jika terdapat jadwal yang bentrok
                // currentParticle.isSesuaiKriteria = false; // Setel properti isSesuaiKriteria ke false jika terdapat bentrok
            }
        }

        if (this.fitness === 0) {
            this.isSesuaiKriteria = true;
        }
    }

    // Update the particle's velocity and position
    updateVelocity() {
        let randomDay, randomRoom, randomTime;
        
        // Randomly select day, time and room
        if (this.pengampu.kategoriKelas === "reguler") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 4) + 1; // 1-4 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00)

            if (this.pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (this.pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (this.pengampu.kategoriKelas === "malam") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 2) + 5; // 5-6 (17:00-19:00, 19:00-21:00)

            if (this.pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (this.pengampu.kategoriKelas === "ekstensi") {
            randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
            randomTime = Math.floor(Math.random() * 6) + 1; // 1-6 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00)
        
            if (this.pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9

                while (randomRoom === 9) {
                    randomRoom = Math.floor(Math.random() * 9) + 1; // Menghasilkan ulang angka acak jika angka sebelumnya adalah 9
                }

            } else if (this.pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }
        }

        // Menentukan room, time dan day matkul hukum
        if (this.pengampu.fakultas === "hukum") {
            randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
            randomTime = Math.floor(Math.random() * 5) + 1; // 1-5 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00)
            randomRoom = Math.floor(Math.random() * 3) + 7; // 7-9
        }
        
        // Assign position and velocity
        this.velocity = { room: randomRoom, time: randomTime, day: randomDay };
        this.position = { room: randomRoom, time: randomTime, day: randomDay };
        this.bestPosition = { room: randomRoom, time: randomTime, day: randomDay };
        this.fitness = 0;
    }
}

// load data setiap kali DOM sudah dimuat
document.addEventListener("DOMContentLoaded", function() {
    loadDataFromStorage();
    loadDataPesananFromStorage();
});

const prosesJadwalBtn = document.querySelector(".proses-jadwal-btn");
prosesJadwalBtn.addEventListener("click", function() {
    // Main aplication

    // Definisikan parameter PSO
    let globalBestPosition = null;
    let jumlahPengampu = pengampu.length;
    let iterasiMaksimal = 5;
    let c1 = 2;
    let c2 = 2;
    let w = 1;
    
    // Initialize the swarm with particles
    const hasilPenjadwalan = []; // menyimpan hasil akhir pembuatan jadwal
    const swarm = [];

    // proses #1 inisialisasi/pembangkitan posisi dan velocity partikel
    for (let i = 0; i < jumlahPengampu; i++) {
        const particle = new Particle(pengampu[i]);
        particle.initialize(pengampu[i]);
        swarm.push(particle);
    }

    for (let indexPesanan = 0; indexPesanan < pesanan.length; indexPesanan++) {
        const particle = new Particle(pesanan[indexPesanan]);
        particle.isSesuaiKriteria = true;
        particle.position = { 
            room: Number(pesanan[indexPesanan].ruangan), 
            time: Number(pesanan[indexPesanan].waktu), 
            day: Number(pesanan[indexPesanan].hari) 
        };

        particle.velocity = { 
            room: Number(pesanan[indexPesanan].ruangan), 
            time: Number(pesanan[indexPesanan].waktu), 
            day: Number(pesanan[indexPesanan].hari) 
        };

        particle.bestPosition = { 
            room: Number(pesanan[indexPesanan].ruangan), 
            time: Number(pesanan[indexPesanan].waktu), 
            day: Number(pesanan[indexPesanan].hari) 
        };
        swarm.push(particle);
    }

    // proses #2 mengurutkan seluruh partikel bedasarkan hari
    // sampai sini, tiap partikel sudah dipasangkan posisi/slot jadwal yang sesuai dengan kriteria yg ditentukan saat inisialisasi
    // namun masih ada beberapa partikel yg memiliki nilai posisi yang sama (bentrok)
    const swarmDaySorted = swarm.sort(function (a, b) {
        return a.position.day - b.position.day;
    });
    
    // proses #3 mengindentifikasi partikel yg memiliki nilai posisi sama / bentrok
    swarmDaySorted.forEach(particle => {
        particle.checkStatus(swarmDaySorted);
    })

    // proses #4 pisahkan partikel yg sudah optimal dan belum
    const swarmBelumOptimal = swarmDaySorted.filter(particle => particle.isSesuaiKriteria === false);
    const swarmSudahOptimal = swarmDaySorted.filter(particle => particle.isSesuaiKriteria);

    // proses #5 duplikat array swarmBelumOptimal agar kita bisa melakukan update velocity/posisi
    const newSwarmBelumOptimal = swarmBelumOptimal.map(particle => Object.create(Object.getPrototypeOf(particle), Object.getOwnPropertyDescriptors(particle)));
    
    // proses #6 main looping PSO, looping akan terus terjadi sampai jadwal optimal
    let isAllOptimal = 0;
    while (!isAllOptimal) {
        newSwarmBelumOptimal.forEach(particle => {
            particle.updateVelocity();
            // particle.initialize(particle.pengampu)
        })

        newSwarmBelumOptimal.forEach(particle => {
            particle.checkStatus(swarmSudahOptimal);

            if (particle.isSesuaiKriteria === true) {
                swarmSudahOptimal.push(particle)
            }
        })

        // Menghapus partikel yang sesuai kriteria dari newSwarmBelumOptimal
        const newSwarmBelumOptimalFiltered = newSwarmBelumOptimal.filter(particle => !particle.isSesuaiKriteria);

        // Memperbarui newSwarmBelumOptimal dengan partikel yang tidak sesuai kriteria
        newSwarmBelumOptimal.length = 0;
        newSwarmBelumOptimal.push(...newSwarmBelumOptimalFiltered);

        // Memeriksa apakah semua partikel sudah optimal
        isAllOptimal = newSwarmBelumOptimal.length === 0;

        // mengecek berapa kali looping terjadi
        console.log("terjadi looping");
    }

    // proses #7 array jadwal yg sudah optimal kita urutkan berdasarkan hari
    swarmSudahOptimal.sort(function (a, b) {
        return a.position.day - b.position.day;
    });

    // konversi hasil pembuatan jadwal ke data yang sesuai
    swarmSudahOptimal.forEach(particle => {
        const convertPositionResult = convertPositionToData(particle.position);
        const finalSwarm = {...convertPositionResult, ...particle.pengampu, fitness: particle.fitness, isSesuaiKriteria: particle.isSesuaiKriteria};
        hasilPenjadwalan.push(finalSwarm);
        // console.log(finalSwarm);
    });
    
    hasilPenjadwalan.forEach(particle => {
        console.log(`${particle.day} || ${particle.time} || ${particle.room} || ${particle.courseName} || ${particle.lecturerName} || ${particle.className} || ${particle.kategoriKelas} || ${particle.jenisMatkul} || ${particle.fitness} || ${particle.isSesuaiKriteria}`);
    })

    // console.log("partikel sudah optimal", swarmSudahOptimal);
    console.log("partikel belum optimal", newSwarmBelumOptimal);
    // console.log(hasilPenjadwalan.length);

    // ------------------------------------------------ //
    //    Menampilkan data jadwal dalam bentuk tabel    //
    // ------------------------------------------------ //

    const tabelJadwal = document.querySelector('.tabel-jadwal');
    const timeElements = document.querySelectorAll('th.time');
    const dayElements = document.querySelectorAll('th.day');
    const cells = document.querySelectorAll('.tabel-jadwal td');
    const cellArray = Array.from(cells);

    let cellIndex = 0;

    for (let hari = 0; hari <= 6; hari++) {
        for (let time = 0; time <= 5; time++) {
            for (let ruangan = 0; ruangan <= 10; ruangan++) {
                let indexI = hari % 7;

                const hariTabel = dayElements[indexI].textContent;
                const waktuTabel = timeElements[time].textContent;
                const ruanganTabel = tabelJadwal.rows[1].cells[ruangan].textContent;

                const jadwal = hasilPenjadwalan.find((item) => item.time === waktuTabel && item.room === ruanganTabel && item.day === hariTabel);

                if (jadwal) {
                    cellArray[cellIndex].innerHTML = `
                    ${jadwal.className} <br>
                    ${jadwal.courseName} <br>
                    ${jadwal.lecturerName}
                    `;
                }

                cellIndex++;
                // console.log(`${hariTabel} || ${waktuTabel} || ${ruanganTabel}`);
            }
        }
    }
})

// handle submit input pengampu
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

    // Check if the same schedule already exists
    if (isJadwalPengampuExists(courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas)) {
        alert(`Data pengampu yang anda masukkan sudah ada.`);
        return;
    }

    const pengampuObject = generatePengampuObject(pengampuId, courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas);

    document.getElementById("inputCourseName").value = null;
    document.getElementById("inputLecturerName").value = null;
    document.getElementById("inputClassName").value = null;
    document.getElementById("inputJenisMatkul").value = '';
    document.getElementById("inputKategoriKelas").value = '';
    document.getElementById("inputFakultas").value = '';


    pengampu.push(pengampuObject);
    saveDataPengampu();

    console.log(pengampu);
    // console.log(pengampu.length);

    // menampilkan semua data pada array pengampu dalam bentuk baris tabel
    const tabelDaftarPengampu = document.querySelector("tbody");
    tabelDaftarPengampu.innerHTML = '';
    $('#timetabling').DataTable().destroy(); // Menghapus objek DataTable yang ada sebelumnya
    $('#timetabling tbody').empty(); // Menghapus semua baris yang ada di tbody

    for (const pengampuItem of pengampu) {
        const newPengampuElement = generatePengampuElement(pengampuItem);
        tabelDaftarPengampu.append(newPengampuElement);
    }

    new DataTable('#timetabling');
});

// handle submit input pesanan
const inputPesananForm = document.getElementById("inputPesanan");

inputPesananForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form values
    const pengampuId = +new Date();

    let courseName = document.getElementById("inputPesananCourseName").value;
    let lecturerName = document.getElementById("inputPesananLecturerName").value;
    let className = document.getElementById("inputPesananClassName").value;
    let jenisMatkul = document.getElementById("inputPesananJenisMatkul").value;
    let kategoriKelas = document.getElementById("inputPesananKategoriKelas").value;
    let fakultas = document.getElementById("inputPesananFakultas").value;
    let hari = document.getElementById("inputHari").value;
    let waktu = document.getElementById("inputWaktu").value;
    let ruangan = document.getElementById("inputRuangan").value;

    
    // Check if the same schedule already exists
    if (isJadwalPesananExists(hari, waktu, ruangan)) {
        alert(`Jadwal pada Hari, Pukul dan di Ruangan tersebut sudah terisi.`);
        return;
    }

    const pesananObject = generatePesananObject(pengampuId, courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas, hari, waktu, ruangan);

    document.getElementById("inputPesananCourseName").value = null;
    document.getElementById("inputPesananLecturerName").value = null;
    document.getElementById("inputPesananClassName").value = null;
    document.getElementById("inputPesananJenisMatkul").value = '';
    document.getElementById("inputPesananKategoriKelas").value = '';
    document.getElementById("inputPesananFakultas").value = '';
    document.getElementById("inputHari").value = '';
    document.getElementById("inputWaktu").value = '';
    document.getElementById("inputRuangan").value = '';


    pesanan.push(pesananObject);
    saveDataPesanan();

    console.log(pesanan);

    // menampilkan semua data pada array pesanan dalam bentuk baris tabel
    const tabelDaftarPesanan = document.querySelector("tbody.daftar-pesanan");
    tabelDaftarPesanan.innerHTML = '';

    for (const pesananItem of pesanan) {
        const newPesananElement = generatePesananElement(pesananItem);
        tabelDaftarPesanan.append(newPesananElement);
    }
});

// handle download button
const downloadBtn = document.querySelector(".download-jadwal-btn");
downloadBtn.addEventListener("click", function() {
    exportTableToPdf();
})

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

function generatePesananObject(pengampuId, courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas, hari, waktu, ruangan) {
    return {
        pengampuId,
        courseName,
        lecturerName,
        className,
        jenisMatkul,
        kategoriKelas,
        fakultas,
        hari,
        waktu,
        ruangan
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
        $('#timetabling').DataTable().destroy(); // Menghapus objek DataTable yang ada sebelumnya
        $('#timetabling tbody').empty(); // Menghapus semua baris yang ada di tbody

        for (const pengampuItem of pengampu) {
            const newPengampuElement = generatePengampuElement(pengampuItem);
            tabelDaftarPengampu.append(newPengampuElement);
        }

        new DataTable('#timetabling');

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

function generatePesananElement(pesananObject) {
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
        const selectedPesanan = pesanan.indexOf(pesananObject);
        pesanan.splice(selectedPesanan, 1);

        const tabelDaftarPesanan = document.querySelector("tbody.daftar-pesanan");
        tabelDaftarPesanan.innerHTML = '';

        for (const pesananItem of pesanan) {
            const newPesananElement = generatePesananElement(pesananItem);
            tabelDaftarPesanan.append(newPesananElement);
        }

        saveDataPesanan();
    })

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("action-btn");
    btnContainer.append(editBtn, deleteBtn);

    const dataKolomAksi = document.createElement("td");
    dataKolomAksi.append(btnContainer);

    const dataKolomKelas = document.createElement("td");
    dataKolomKelas.innerText = pesananObject.className;

    const dataKolomDosen = document.createElement("td");
    dataKolomDosen.innerText = pesananObject.lecturerName;

    const dataKolomMatkul = document.createElement("td");
    dataKolomMatkul.innerText = pesananObject.courseName;

    const dataKolomNomor = document.createElement("td");
    dataKolomNomor.innerText = pesanan.indexOf(pesananObject) + 1; //mendapatkan indeks sebuah array

    const dataPesananElement = document.createElement("tr");
    dataPesananElement.append(dataKolomNomor, dataKolomMatkul, dataKolomDosen, dataKolomKelas, dataKolomAksi);

    return dataPesananElement;
}

function saveDataPengampu() {
    const dataJson = JSON.stringify(pengampu);
    localStorage.setItem(localStoragePengampu, dataJson);
}

function saveDataPesanan() {
    const dataJson = JSON.stringify(pesanan);
    localStorage.setItem(localStoragePesanan, dataJson);
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
    $('#timetabling').DataTable().destroy(); // Menghapus objek DataTable yang ada sebelumnya
    $('#timetabling tbody').empty(); // Menghapus semua baris yang ada di tbody

    for (const pengampuItem of pengampu) {
        const newPengampuElement = generatePengampuElement(pengampuItem);
        tabelDaftarPengampu.append(newPengampuElement);
    }

    new DataTable('#timetabling');
}

function loadDataPesananFromStorage() {
    const serializedData = localStorage.getItem(localStoragePesanan);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null){
        for(let pesananItem of data){
            pesanan.push(pesananItem);
        }
    }

    // menampilkan semua data pada array pengampu dalam bentuk baris tabel
    const tabelDaftarPesanan = document.querySelector("tbody.daftar-pesanan");
    tabelDaftarPesanan.innerHTML = '';

    for (const pesananItem of pesanan) {
        const newPesananElement = generatePesananElement(pesananItem);
        tabelDaftarPesanan.append(newPesananElement);
    }
}

// ekspor hasil penjadwalan ke excel
function exportTableToPdf() {
    const fileName = 'jadwal.' + 'xls'
    const table = document.getElementById("tabel-jadwal")
    const wb = XLSX.utils.table_to_book(table)
    XLSX.writeFile(wb, fileName)
}

// form validation
function isJadwalPesananExists(hari, waktu, ruangan) {
    return pesanan.some(
        (item) =>
        item.hari === hari &&
        item.waktu === waktu &&
        item.ruangan === ruangan
    );
}

function isJadwalPengampuExists(courseName, lecturerName, className, jenisMatkul, kategoriKelas, fakultas) {
    return pengampu.some(
        (item) =>
        item.courseName === courseName &&
        item.lecturerName === lecturerName &&
        item.className === className &&
        item.jenisMatkul === jenisMatkul &&
        item.kategoriKelas === kategoriKelas &&
        item.fakultas === fakultas
    );
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

function calculateFitness(particle, swarmDaySorted) {
    let particleFitness = 0;
    const currentParticle = particle;

    // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle saat ini
    const currentTime = currentParticle.position.time;
    const currentDay = currentParticle.position.day;
    const currentRoom = currentParticle.position.room;

    for (let i = 0; i < swarmDaySorted.length; i++) {
        const otherParticle = swarmDaySorted[i];
        
        if (swarmDaySorted.indexOf(currentParticle) === i) continue; // Skip jika partikel sama
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
            currentParticle.fitness++; // Tambahkan fitness jika terdapat jadwal yang bentrok
            // currentParticle.isSesuaiKriteria = false; // Setel properti isSesuaiKriteria ke false jika terdapat bentrok
        }
    }

    if (currentParticle.fitness === 0) {
        currentParticle.isSesuaiKriteria = true;
        // particlesToUpdate.push(currentParticle); // Tambahkan partikel ke dalam array particlesToUpdate
    } else {
        particleFitness = currentParticle.fitness;
    }

    return particleFitness;
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