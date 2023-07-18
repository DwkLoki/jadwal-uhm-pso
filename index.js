const pengampu = [];
const particlesToUpdate = [];
const localStoragePengampu = "PENGAMPU_GENAP";
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
        // for (const key in this.velocity) {
        //     this.velocity[key] = Math.floor(
        //         w * this.velocity[key] +
        //         Math.random() * c1 * (this.bestPosition[key] - this.position[key]) +
        //         Math.random() * c2 * (globalBestPosition[key] - this.position[key])
        //     )

        //     this.position[key] = this.velocity[key] + this.position[key]
        // }

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

    // const prosesJadwalBtn = document.querySelector("section .proses-jadwal-btn");
    // prosesJadwalBtn.addEventListener("click", function() {
    //     // Main aplication

    //     // Initialize the swarm with particles
    //     for (let i = 0; i < jumlahPengampu; i++) {
    //         const particle = new Particle(pengampu[i]);
    //         particle.initialize(pengampu[i]);
    //         swarm.push(particle);
    //     }
        
    //     // Perform PSO iterations until fitness reaches 0
    //     // let iteration = 0; // kalo mau pake maxiterasi, aktifkan baris kode ini
    //     // let fitness = calculateFitness(swarm);

    //     // swarm.forEach(particle => {
    //     //     // Calculate fitness based on defined criteria and update personal best position
    //     //     const particleFitness = calculateFitness(particle, swarm);
    //     //     // console.log(particleFitness);
    //     //     // if (!particle.bestFitness || particleFitness < particle.bestFitness) {
    //     //     //     particle.bestFitness = particleFitness;
    //     //     //     particle.bestPosition = { ...particle.position };
    //     //     // }
    //     //     // // Update global best position if necessary
    //     //     // if (!globalBestPosition || particleFitness < globalBestPositionFitness) {
    //     //     //     globalBestPosition = { ...particle.position };
    //     //     //     globalBestPositionFitness = particleFitness;
    //     //     // }
    //     // });

    //     // while (fitness > 0) {
    //     //     // Evaluate fitness for each particle and update global best position
    //     //     swarm.forEach(particle => {
    //     //         // Calculate fitness based on defined criteria and update personal best position
    //     //         const particleFitness = calculateFitness(swarm);
    //     //         if (!particle.bestFitness || particleFitness < particle.bestFitness) {
    //     //             particle.bestFitness = particleFitness;
    //     //             particle.bestPosition = { ...particle.position };
    //     //         }
    //     //         // Update global best position if necessary
    //     //         if (!globalBestPosition || particleFitness < globalBestPositionFitness) {
    //     //             globalBestPosition = { ...particle.position };
    //     //             globalBestPositionFitness = particleFitness;
    //     //         }
    //     //     });

    //     //     // Update particle velocities and positions
    //     //     swarm.forEach(particle => {
    //     //         particle.updateVelocity(globalBestPosition, w, c1, c2);
    //     //     });

    //     //     // iteration++;
    //     //     fitness = calculateFitness(swarm);
    //     // }
        
    //     // console.log("Final fitness:", fitness);

    //     // menampilkan hasil pembuatan jadwal
    //     swarm.forEach(particle => {
    //         const convertPositionResult = convertPositionToData(particle.position);
    //         const finalSwarm = {...convertPositionResult, ...particle.pengampu};
    //         hasilPenjadwalan.push(finalSwarm);
    //         // console.log(finalSwarm);
    //     });
        
    //     console.log(swarm);
    //     console.log(hasilPenjadwalan);

    //     // // Menampilkan data jadwal dalam bentuk tabel
    //     // // Ambil referensi tabel
    //     // const tabelJadwal = document.querySelector('.tabel-jadwal');

    //     // const row = tabelJadwal.rows[2];

    //     // // Ambil waktu, ruangan dan hari dari slot jadwal pertama
    //     // const waktuTabel = row.cells[1].textContent;
    //     // const ruanganTabel = tabelJadwal.rows[1].cells[0].textContent;
    //     // const hariTabel = row.cells[0].textContent;

    //     // // cari jadwal yg sesuai dengan slot
    //     // const jadwal = hasilPenjadwalan.find((item) => item.time === waktuTabel && item.room === ruanganTabel && item.day === hariTabel);
        
    //     // // kalo jadwal yg sesuai ditemukan, maka tampilkan ke slot
    //     // if (jadwal) {                 
    //     //     const cell = row.cells[2];
    //     //     cell.innerHTML = `
    //     //     ${jadwal.className} <br>
    //     //     ${jadwal.courseName} <br>
    //     //     ${jadwal.lecturerName}
    //     //     `
    //     // }
    // })
});

const prosesJadwalBtn = document.querySelector("section .proses-jadwal-btn");
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
        const hasilPenjadwalan = [];
        const jadwalBelumOptimal = [];
        const jadwalSudahOptimal = [];
        const swarm = [];
        const particlesToUpdate = [];

        // proses #1 inisialisasi/pembangkitan posisi dan velocity partikel
        for (let i = 0; i < jumlahPengampu; i++) {
            const particle = new Particle(pengampu[i]);
            particle.initialize(pengampu[i]);
            swarm.push(particle);
        }

        // const newSwarm = swarm.map(particle => Object.create(Object.getPrototypeOf(particle), Object.getOwnPropertyDescriptors(particle)));

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
        
        // proses #5 cek apakah jumlah partikel yg belum optimal lebih sedikit?
        // selama jumlah partikel yg belum optimal lebih banyak, maka inisialisasi ulang
        // while (swarmBelumOptimal.length > swarmSudahOptimal.length) {
        //     // proses #6 inisialisasi/pembangkitan posisi dan velocity partikel
        //     for (let i = 0; i < jumlahPengampu; i++) {
        //         const particle = new Particle(pengampu[i]);
        //         particle.initialize(pengampu[i]);
        //         swarm.push(particle);
        //     }

        //     // proses #7 mengurutkan seluruh partikel bedasarkan hari
        //     swarmDaySorted = swarm.sort(function (a, b) {
        //         return a.position.day - b.position.day;
        //     });
        // }

        // swarmSudahOptimal.sort(function (a, b) {
        //     return a.position.day - b.position.day;
        // });

        // swarmBelumOptimal.sort(function (a, b) {
        //     return a.position.day - b.position.day;
        // });

        // console.log(swarmDaySorted);
        // console.log("partikel belum optimal", swarmBelumOptimal);
        // console.log("partikel sudah optimal", swarmSudahOptimal);


        const newSwarmBelumOptimal = swarmBelumOptimal.map(particle => Object.create(Object.getPrototypeOf(particle), Object.getOwnPropertyDescriptors(particle)));
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


        // Perform PSO iterations until fitness reaches 0
        // let iteration = 0; // kalo mau pake maxiterasi, aktifkan baris kode ini
        // let fitness = calculateFitness(swarm);
        // let swarmFitness = 1;
        // while (swarmFitness > 0) {
        //     swarmFitness = 0;
        //     swarm.forEach(particle => {
        //         // Calculate fitness based on defined criteria and update personal best position
        //         const particleFitness = calculateFitness(particle, swarm);
        //         particle.fitness = particleFitness;
        //         // Tambahkan partikel ke dalam array particlesToUpdate
        //         if (particleFitness > 0) {
        //             particlesToUpdate.push(particle); 
        //         }

        //         // akumulasi fitness partikel ini dengan partikel lain
        //         swarmFitness += particleFitness
        //     });

        //     if (swarmFitness > 0) {
        //         swarm.forEach(particle => {
        //             if (particle.fitness > 0) {
        //                 particle.updateVelocity(particle);
        //             }
        //         });
        //     }
        // }
        


        // konversi hasil pembuatan jadwal ke data yang sesuai
        // swarmDaySorted.forEach(particle => {
        //     const convertPositionResult = convertPositionToData(particle.position);
        //     const finalSwarm = {...convertPositionResult, ...particle.pengampu, fitness: particle.fitness, isSesuaiKriteria: particle.isSesuaiKriteria};
        //     hasilPenjadwalan.push(finalSwarm);
        //     // console.log(finalSwarm);
        // });
        
        // hasilPenjadwalan.forEach(particle => {
        //     console.log(`${particle.day} || ${particle.time} || ${particle.room} || ${particle.courseName} || ${particle.lecturerName} || ${particle.className} || ${particle.kategoriKelas} || ${particle.jenisMatkul} || ${particle.fitness} || ${particle.isSesuaiKriteria}`);
        // })
        // console.log(swarm);
        // console.log(hasilPenjadwalan);
        // console.log(particlesToUpdate);
        // console.log(swarmFitness);

        // Menampilkan data jadwal dalam bentuk tabel
        // Ambil referensi tabel
        // const tabelJadwal = document.querySelector('.tabel-jadwal');

        // ambil referensi header time dan day
        // const timeElements = document.querySelectorAll('th.time');
        // const dayElements = document.querySelectorAll('th.day');

        // Membuat array dari elemen-elemen time dan day yang ditemukan
        // const timeArray = Array.from(timeElements);
        // const dayArray = Array.from(dayElements);

        // ambil referensi seluruh cell pada tabel dan ubah ke array
        // const cells = document.querySelectorAll('.tabel-jadwal td');
        // const cellArray = Array.from(cells);

        // looping sebanyak 7 kali (hari tersedia)
        // for (let i = 0; i < 7; i++) {

            // looping sebanyak 6 kali (time tersedia)
            // for (let j = 0; j < 6; j++) {

            //     // looping sebanyak 11 kali (ruangan tersedia)
            //     for (let k = 0; k < 11; k++) {
            //         const ruanganTabel = tabelJadwal.rows[1].cells[k].textContent;
            //         const waktuTabel = tabelJadwal.rows[2].cells[1].textContent;

            //         // cari jadwal yg sesuai dengan slot
            //         const jadwal = hasilPenjadwalan.find((item) => item.time === waktuTabel && item.room === ruanganTabel && item.day === hariTabel);

            //         // kalo jadwal yg sesuai ditemukan, maka tampilkan ke slot
            //         if (jadwal) {                 
            //             cellArray[i].innerHTML = `
            //             ${jadwal.className} <br>
            //             ${jadwal.courseName} <br>
            //             ${jadwal.lecturerName}
            //             `
            //         }
            //         console.log(k);
            //     }   
            // }
        // }

        // hasilPenjadwalan.forEach((item, index) => {
        //     // console.log(`${item} dan ${index}: ${item.courseName} di ruangan ${item.room}`);
        //     const time = item.time;
        //     const day = item.day;
        //     const room = item.room;

        //     // Menghitung indeks elemen <td> berdasarkan time, day, dan room
        //     const rowIndex = Math.floor(1 + (index % 6)); // Menyesuaikan dengan struktur tabel (indeks dimulai dari 1)
        //     const columnIndex = Math.floor(2 + index / 6); // Menyesuaikan dengan struktur tabel (indeks dimulai dari 2)

        //     // Mengisi nilai pada elemen <td> yang sesuai dengan time, day, dan room
        //     const cellIndex = rowIndex * 12 + columnIndex;
        //     console.log(cellArray[cellIndex]);
        //     // // cellArray[cellIndex].innerHTML = `
        //     // //     ${item.className} <br>
        //     // //     ${item.courseName} <br>
        //     // //     ${item.lecturerName}
        //     // // `;
        // })

        // for (let i = 0; i < 462; i++) {
        //     cellArray[i].innerHTML = `
        //         nama kelas
        //         nama matkul
        //         nama dosen pengampu
        //     `
        // }

        // looping sebanyak 7 kali (hari tersedia)
        // for (let i = 0; i < dayArray.length; i++) {

        //     const hariTabel = dayArray[i].textContent; // senin-minggu
            
        //     // looping sebanyak 6 kali (time tersedia)
        //     for (let j = 0; j < timeArray.length; j++) {
        //         const waktuTabel = timeArray[j].textContent; // 08:00-10:00 sampai 19:00-21:00

        //         // looping sebanyak 11 kali (ruangan tersedia)
        //         for (let k = 0; k < tabelJadwal.rows[1].cells.length; k++) {
        //             const ruanganTabel = tabelJadwal.rows[1].cells[k].textContent;
        //             // const waktuTabel = tabelJadwal.rows[2].cells[1].textContent;

        //             // cari jadwal yg sesuai dengan slot
        //             // const jadwal = hasilPenjadwalan.find((item) => item.time === waktuTabel && item.room === ruanganTabel && item.day === hariTabel);
                
        //             // // Menghitung indeks elemen <td> berdasarkan waktu, hari, dan ruangan
        //             // const rowIndex = 2 + (j % 6); // Menyesuaikan dengan struktur tabel (indeks dimulai dari 2)
        //             // const columnIndex = k;

        //             // // Mengisi nilai pada elemen <td> yang sesuai dengan waktu, hari, dan ruangan
        //             // const cellIndex = rowIndex * 12 + columnIndex;
        //             // cellArray[cellIndex].innerHTML = jadwal ? `
        //             //     ${jadwal.className} <br>
        //             //     ${jadwal.courseName} <br>
        //             //     ${jadwal.lecturerName}
        //             // ` : '';

        //             // kalo jadwal yg sesuai ditemukan, maka tampilkan ke slot
        //             // if (jadwal) {                 
        //             //     cellArray[i].innerHTML = `
        //             //     ${jadwal.className} <br>
        //             //     ${jadwal.courseName} <br>
        //             //     ${jadwal.lecturerName}
        //             //     `
        //             // }
        //             // console.log(j);
        //         }   
        //     }
        // }

        // ambil baris jadwal senin
        // const tabelSenin = tabelJadwal.rows[2];

        // looping sebanyak jumlah time yg tersedia
        // for (let i = 0; i < 6; i++) {
        //     // Ambil waktu, ruangan dan hari dari slot jadwal pertama
        //     const hariTabel = tabelSenin.cells[0].textContent; // senin
        //     const waktuTabel = tabelJadwal.rows[i + 2].cells[1].textContent;
        //     // const waktuTabel = tabelSenin.cells[1].textContent; // 08:00-10:00
            
        //     // looping sebanyak jumlah ruangan yang tersedia
        //     for (let j = 0; j < tabelJadwal.rows[1].cells.length; j++) {
        //         const ruanganTabel = tabelJadwal.rows[1].cells[j].textContent; // 205
                
        //         // cari jadwal yg sesuai dengan slot
        //         const jadwal = hasilPenjadwalan.find((item) => item.time === waktuTabel && item.room === ruanganTabel && item.day === hariTabel);
            
        //         // kalo jadwal yg sesuai ditemukan, maka tampilkan ke slot
        //         if (jadwal) {                 
        //             const cell = tabelSenin.cells[j + 2];
        //             cell.innerHTML = `
        //             ${jadwal.className} <br>
        //             ${jadwal.courseName} <br>
        //             ${jadwal.lecturerName}
        //             `
        //         }
        //     }
        // }
})

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
// function calculateFitness(particle, swarm) {
//     let fitness = 0;

//     for (let i = 0; i < swarm.length; i++) {
//         const currentParticle = particle;

//         // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle saat ini
//         const currentTime = currentParticle.position.time;
//         const currentDay = currentParticle.position.day;
//         const currentRoom = currentParticle.position.room;

//         for (let j = i + 1; j < swarm.length; j++) {
//             const otherParticle = swarm[j];

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
//                 particlesToUpdate.push(currentParticle); // Menambahkan partikel ke dalam array particlesToUpdate
//             }
//         }

//         if (fitness === 0) {
//             currentParticle.isSesuaiKriteria = true;
//         }
//     }

//     return fitness;
// }

function calculateFitness(particle, swarmDaySorted) {
    // const currentParticle = particle;
    // currentParticle.isSesuaiKriteria = true; // Setel awal properti isSesuaiKriteria ke true
    
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

        // Memeriksa kriteria tambahan

        // if (
        //     currentJenisMatkul === "praktikum" &&
        //     currentRoom !== 10 &&
        //     currentRoom !== 11
        // ) {
        //     currentParticle.fitness++; // Menambahkan fitness jika terdapat jadwal praktikum yang tidak di ruangan Lab 1 atau Lab 2
        // }

        // if (
        //     currentJenisMatkul === "teori" &&
        //     currentRoom === 10 &&
        //     currentRoom === 11
        // ) {
        //     currentParticle.fitness++; // Menambahkan fitness jika terdapat jadwal teori yang di ruangan Lab 1 atau Lab 2
        // }

        // if (
        //     currentKategoriKelas === "malam" &&
        //     (currentDay === 1 ||
        //     currentDay === 2 ||
        //     currentDay === 3 ||
        //     currentDay === 4 ||
        //     currentDay === 5) &&
        //     (currentTime === 5 || currentTime === 6)
        // ) {
        //     currentParticle.fitness++; // Menambahkan fitness jika terdapat jadwal malam yang tidak di hari dan slot waktu yang tersedia
        // }

        // if (
        //     currentKategoriKelas === "ekstensi" &&
        //     (currentDay === 6 || currentDay === 7)
        // ) {
        //     currentParticle.fitness++; // Menambahkan fitness jika terdapat jadwal ekstensi yang tidak di hari yang tersedia
        // }

        // if (
        //     currentKategoriKelas === "reguler" &&
        //     (currentDay === 1 ||
        //     currentDay === 2 ||
        //     currentDay === 3 ||
        //     currentDay === 4 ||
        //     currentDay === 5) &&
        //     (currentTime === 1 ||
        //     currentTime === 2 ||
        //     currentTime === 3 ||
        //     currentTime === 4)
        // ) {
        //     currentParticle.fitness++; // Menambahkan fitness jika terdapat jadwal reguler yang tidak di hari dan slot waktu yang tersedia
        // }

        // if (
        //     currentFakultas === "hukum" &&
        //     (currentDay === 6 || currentDay === 7) &&
        //     (currentTime === 1 ||
        //     currentTime === 2 ||
        //     currentTime === 3 ||
        //     currentTime === 4 ||
        //     currentTime === 5) &&
        //     (currentRoom === 7 ||
        //     currentRoom === 8 ||
        //      currentRoom === 9)
        // ) {
        //     currentParticle.fitness++; // Menambahkan fitness jika terdapat jadwal reguler yang tidak di hari dan slot waktu yang tersedia
        // }

    if (currentParticle.fitness === 0) {
        currentParticle.isSesuaiKriteria = true;
        // particlesToUpdate.push(currentParticle); // Tambahkan partikel ke dalam array particlesToUpdate
    } else {
        particleFitness = currentParticle.fitness;
    }

    // }
    return particleFitness;
}

// function calculateFitness(particle) {
//   let fitness = 0;

//   for (let i = 0; i < particle.length; i++) {
//     const currentParticle = particle[i];

//     // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle saat ini
//     const currentTime = currentParticle.position.time;
//     const currentDay = currentParticle.position.day;
//     const currentRoom = currentParticle.position.room;
//     const currentFakultas = currentParticle.pengampu.fakultas;
//     const currentJenisMatkul = currentParticle.pengampu.jenisMatkul;
//     const currentKategoriKelas = currentParticle.pengampu.kategoriKelas;

//     for (let j = i + 1; j < particle.length; j++) {
//       const otherParticle = particle[j];

//       // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle lainnya
//       const otherTime = otherParticle.position.time;
//       const otherDay = otherParticle.position.day;
//       const otherRoom = otherParticle.position.room;
//       const otherFakultas = otherParticle.pengampu.fakultas;
//       const otherJenisMatkul = otherParticle.pengampu.jenisMatkul;
//       const otherKategoriKelas = otherParticle.pengampu.kategoriKelas;

//       // Memeriksa apakah terdapat bentrok jadwal pada slot waktu, hari, atau ruangan
//       if (
//         currentTime === otherTime &&
//         currentDay === otherDay &&
//         currentRoom === otherRoom
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal yang bentrok
//       }

//       // Memeriksa kriteria tambahan
//       if (
//         currentFakultas === "hukum" &&
//         otherFakultas === "hukum" &&
//         currentRoom !== "FHIS 01" &&
//         otherRoom !== "FHIS 01"
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal hukum yang tidak di ruangan FHIS 01
//       }

//       if (
//         currentFakultas === "ilkom" &&
//         otherFakultas === "ilkom" &&
//         currentRoom === "FHIS 01" &&
//         otherRoom === "FHIS 01"
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal ilkom yang di ruangan FHIS 01
//       }

//       if (
//         currentJenisMatkul === "praktikum" &&
//         otherJenisMatkul === "praktikum" &&
//         currentRoom !== "Lab 1" &&
//         currentRoom !== "Lab 2" &&
//         otherRoom !== "Lab 1" &&
//         otherRoom !== "Lab 2"
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal praktikum yang tidak di ruangan Lab 1 atau Lab 2
//       }

//       if (
//         currentJenisMatkul === "teori" &&
//         otherJenisMatkul === "teori" &&
//         currentRoom === "Lab 1" &&
//         currentRoom === "Lab 2" &&
//         otherRoom === "Lab 1" &&
//         otherRoom === "Lab 2"
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal teori yang di ruangan Lab 1 atau Lab 2
//       }

//       if (
//         currentKategoriKelas === "malam" &&
//         otherKategoriKelas === "malam" &&
//         (currentDay === "Senin" ||
//           currentDay === "Selasa" ||
//           currentDay === "Rabu" ||
//           currentDay === "Kamis" ||
//           currentDay === "Jumat") &&
//         (otherDay === "Senin" ||
//           otherDay === "Selasa" ||
//           otherDay === "Rabu" ||
//           otherDay === "Kamis" ||
//           otherDay === "Jumat") &&
//         (currentTime === "17:00-19:00" || currentTime === "19:00-21:00") &&
//         (otherTime === "17:00-19:00" || otherTime === "19:00-21:00")
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal malam yang tidak di hari dan slot waktu yang tersedia
//       }

//       if (
//         currentKategoriKelas === "ekstensi" &&
//         otherKategoriKelas === "ekstensi" &&
//         (currentDay === "Sabtu" || currentDay === "Minggu") &&
//         (otherDay === "Sabtu" || otherDay === "Minggu")
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal ekstensi yang tidak di hari yang tersedia
//       }

//       if (
//         currentKategoriKelas === "reguler" &&
//         otherKategoriKelas === "reguler" &&
//         (currentDay === "Senin" ||
//           currentDay === "Selasa" ||
//           currentDay === "Rabu" ||
//           currentDay === "Kamis" ||
//           currentDay === "Jumat") &&
//         (otherDay === "Senin" ||
//           otherDay === "Selasa" ||
//           otherDay === "Rabu" ||
//           otherDay === "Kamis" ||
//           otherDay === "Jumat") &&
//         (currentTime === "08:00-10:00" ||
//           currentTime === "10:00-12:00" ||
//           currentTime === "13:00-15:00" ||
//           currentTime === "15:00-17:00") &&
//         (otherTime === "08:00-10:00" ||
//           otherTime === "10:00-12:00" ||
//           otherTime === "13:00-15:00" ||
//           otherTime === "15:00-17:00")
//       ) {
//         fitness++; // Menambahkan fitness jika terdapat jadwal reguler yang tidak di hari dan slot waktu yang tersedia
//       }
//     }
//   }

//   return fitness;
// }

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

// // Menampilkan data jadwal dalam bentuk tabel

// // Ambil referensi tabel
// const tabelJadwal = document.querySelector('.tabel-jadwal');

// const row = tabelJadwal.rows[2];

// // Ambil waktu dan ruangan dari slot jadwal pertama di baris saat ini
// const waktu = row.cells[1].textContent;
// const room = tabelJadwal.rows[1].cells[0].textContent;
// console.log(hasilPenjadwalan);

// Cari jadwal yang sesuai dengan waktu saat ini di finalSwarm
// const jadwal = hasilPenjadwalan.find((item) => item.time === waktu);
// console.log(jadwal);

// Iterasi untuk setiap baris dalam tabel, dimulai dari baris ke-2 (indeks 1) karena baris pertama adalah header
// for (let i = 2; i < tabelJadwal.rows.length; i++) {
//   const row = tabelJadwal.rows[i];

//   // Ambil waktu dari elemen kolom pertama di baris saat ini
//   const waktu = row.cells[0].textContent;

//   // Cari jadwal yang sesuai dengan waktu saat ini di finalSwarm
//   const jadwal = finalSwarm.find((item) => item.slotWaktu === waktu);

//   // Jika jadwal ditemukan, isi data ke kolom-kolom selanjutnya
//   if (jadwal) {
//     for (let j = 0; j < jadwal.hariTersedia.length; j++) {
//       const ruangan = jadwal.hariTersedia[j].ruangan;
//       const cell = row.cells[j + 1];
//       cell.textContent = ruangan;
//     }
//   }
// }


// const jadwal = {
//     senin: {
//         '08:00-10:00': '205',
//         '10:00-12:00': '101',
//         '13:00-15:00': '305',
//         '15:00-17:00': '306',
//         '17:00-19:00': '402',
//         '19:00-21:00': '403'
//     },
//     // Tambahkan data jadwal untuk hari Selasa, Rabu, dst.
//     // selasa: {
//     //     '08:00-10:00': '...',
//     //     ...
//     // },
//     // rabu: {
//     //     '08:00-10:00': '...',
//     //     ...
//     // },
//     // ...
// };

// // Mengisi data jadwal ke dalam tabel
// for (const hari in jadwal) {
//     for (const waktu in jadwal[hari]) {
//         const cellId = `${hari.toLowerCase()}-${waktu.replace(':', '')}`;
//         const cell = document.getElementById(cellId);
//         cell.textContent = jadwal[hari][waktu];
//     }
// }