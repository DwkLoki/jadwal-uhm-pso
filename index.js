let pengampu = [];
const pesanan = [];
const pesananTidakBersedia = [];
const particlesToUpdate = [];
const localStoragePengampu = "PENGAMPU_GENAP";
const localStoragePesanan = "JADWAL_PESANAN";
const localStoragePesananTidakBersedia = "JADWAL_TIDAK_BERSEDIA";
// const dosenJadwal = {};
// const localStoragePengampu = "PENGAMPU_GENAP_TES";
// const localStoragePesanan = "JADWAL_PESANAN_TES";

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

        // // Track jadwal yang sudah ditempatkan untuk dosen ini
        // if (!dosenJadwal[pengampu.lecturerName]) {
        //     // Randomly select day, time and room
        //     if (pengampu.kategoriKelas === "Reguler" || pengampu.kategoriKelas === "reguler") {
        //         randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
        //         randomTime = Math.floor(Math.random() * 4) + 1; // 1-4 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00)

        //         if (pengampu.jenisMatkul === "Teori" || pengampu.jenisMatkul === "teori"){
        //             randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
        //         } else if (pengampu.jenisMatkul === "Praktikum" || pengampu.jenisMatkul === "praktikum") {
        //             randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
        //         }

        //     } else if (pengampu.kategoriKelas === "Malam" || pengampu.kategoriKelas === "malam") {
        //         randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
        //         randomTime = Math.floor(Math.random() * 2) + 5; // 5-6 (17:00-19:00, 19:00-21:00)

        //         if (pengampu.jenisMatkul === "Teori" || pengampu.jenisMatkul === "teori"){
        //             randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
        //         } else if (pengampu.jenisMatkul === "Praktikum" || pengampu.jenisMatkul === "praktikum") {
        //             randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
        //         }

        //     } else if (pengampu.kategoriKelas === "Ekstensi" || pengampu.kategoriKelas === "ekstensi") {
        //         randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
        //         randomTime = Math.floor(Math.random() * 6) + 1; // 1-6 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00)
            
        //         if (pengampu.jenisMatkul === "Teori" || pengampu.jenisMatkul === "teori"){
        //             randomRoom = Math.floor(Math.random() * 8) + 2; // 2-9

        //             while (randomRoom === 8) {
        //                 randomRoom = Math.floor(Math.random() * 8) + 2; // Menghasilkan ulang angka acak jika angka sebelumnya adalah 8
        //             }

        //         } else if (pengampu.jenisMatkul === "Praktikum" || pengampu.jenisMatkul === "praktikum") {
        //             randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
        //         }
        //     }

        //     // Menentukan room, time dan day matkul hukum
        //     if (pengampu.fakultas === "Hukum dan Ilmu Sosial" || pengampu.fakultas === "hukum dan ilmu sosial") {
        //         randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
        //         randomTime = Math.floor(Math.random() * 5) + 1; // 1-5 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00)
        //         randomRoom = Math.floor(Math.random() * 3) + 7; // 7-9
        //     }

        //     dosenJadwal[pengampu.lecturerName] = {
        //         day: randomDay,
        //         time: randomTime,
        //         kategoriKelas: pengampu.kategoriKelas,
        //         jenisMatkul: pengampu.jenisMatkul,
        //         fakultas: pengampu.fakultas,
        //         count: 1 // Menghitung berapa kali dosen ini sudah muncul
        //     };
        // } else {
        //     // Cek apakah sudah mencapai batas maksimum (3 kali dalam satu hari)
        //     if (dosenJadwal[pengampu.lecturerName].count < 3) {
        //         if (dosenJadwal[pengampu.lecturerName].kategoriKelas === pengampu.kategoriKelas) {
        //             randomDay = dosenJadwal[pengampu.lecturerName].day; // Hari harus tetap sama
        //             randomTime = dosenJadwal[pengampu.lecturerName].time + 1;
        //         } else {

        //         }
        //         dosenJadwal[pengampu.lecturerName].count++;
        //     } else {
        //         // Jika sudah mencapai batas maksimum, pindah ke hari berikutnya
        //         randomDay = dosenJadwal[pengampu.lecturerName].day + 1;
        //         randomTime = 1; // Kembali ke waktu awal, generate time random lagi
        //         dosenJadwal[pengampu.lecturerName].day = randomDay;
        //         dosenJadwal[pengampu.lecturerName].count = 1; // Reset jumlah jadwal untuk hari baru
        //     }
        // }
        
        // Randomly select day, time and room
        if (pengampu.kategoriKelas === "Reguler" || pengampu.kategoriKelas === "reguler") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 4) + 1; // 1-4 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00)

            if (pengampu.jenisMatkul === "Teori" || pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (pengampu.jenisMatkul === "Praktikum" || pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (pengampu.kategoriKelas === "Malam" || pengampu.kategoriKelas === "malam") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 2) + 5; // 5-6 (17:00-19:00, 19:00-21:00)

            if (pengampu.jenisMatkul === "Teori" || pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (pengampu.jenisMatkul === "Praktikum" || pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (pengampu.kategoriKelas === "Ekstensi" || pengampu.kategoriKelas === "ekstensi") {
            randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
            randomTime = Math.floor(Math.random() * 6) + 1; // 1-6 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00)
        
            if (pengampu.jenisMatkul === "Teori" || pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 8) + 2; // 2-9

                while (randomRoom === 8) {
                    randomRoom = Math.floor(Math.random() * 8) + 2; // Menghasilkan ulang angka acak jika angka sebelumnya adalah 8
                }

            } else if (pengampu.jenisMatkul === "Praktikum" || pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }
        }

        // Menentukan room, time dan day matkul hukum
        if (pengampu.fakultas === "Hukum dan Ilmu Sosial" || pengampu.fakultas === "hukum dan ilmu sosial") {
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

        // Mendapatkan slot waktu, hari, ruangan, nama kelas dan nama dosen yang digunakan oleh particle saat ini
        const currentTime = currentParticle.position.time;
        const currentDay = currentParticle.position.day;
        const currentRoom = currentParticle.position.room;
        const currentLecturer = currentParticle.pengampu.lecturerName;
        const currentClass = currentParticle.pengampu.className;
        // const currentSemester = currentParticle.pengampu.semester;
        
        for (let i = 0; i < swarm.length; i++) {
            const otherParticle = swarm[i];

            if (currentParticle === otherParticle) continue; // Skip jika partikel sama
            
            // Mendapatkan slot waktu, hari, dan ruangan yang digunakan oleh particle lainnya
            const otherTime = otherParticle.position.time;
            const otherDay = otherParticle.position.day;
            const otherRoom = otherParticle.position.room;
            const otherLecturer = otherParticle.pengampu.lecturerName;
            const otherClass = otherParticle.pengampu.className;
            // const otherSemester = otherParticle.pengampu.semester;
            const isCurrentClassTI = currentClass.startsWith('TI');
            const isOtherClassTI = otherClass.startsWith('TI');
            
            // Memeriksa apakah terdapat bentrok jadwal pada slot waktu, hari, atau ruangan
            if (
                (currentTime === otherTime && currentDay === otherDay && currentRoom === otherRoom) ||
                (currentLecturer === otherLecturer && currentDay === otherDay && currentTime === otherTime) ||
                (currentClass === otherClass && currentDay === otherDay && currentTime === otherTime)
                // (
                //     isCurrentClassTI && isOtherClassTI &&
                //     // currentClass !== otherClass &&
                //     (currentClass.split("-")[0].split("/")[1] === otherClass.split("-")[0].split("/")[1]) && // memeriksa semester yang sama
                //     (currentClass.split("-")[1].length > 1 && otherClass.split("-")[1].length === 1) && // Memeriksa gabungan dengan dasar (A, B, C, D, E)
                //     currentClass.split("-")[1].includes(otherClass.split("-")[1]) &&
                //     (currentDay === otherDay && currentTime === otherTime)
                // )
            ) {
                this.fitness++; // Tambahkan fitness jika terdapat jadwal yang bentrok
                // currentParticle.isSesuaiKriteria = false; // Setel properti isSesuaiKriteria ke false jika terdapat bentrok
            }

            // Tambahkan kondisi untuk menghindari bentrok dengan kelas gabungan
            // const isCurrentClassTI = currentClass.startsWith('TI');
            // const isOtherClassTI = otherClass.startsWith('TI');
            // if (
            //     isCurrentClassTI && isOtherClassTI &&
            //     currentClass !== otherClass &&
            //     currentClass.split("-")[0].split("/")[1] === otherClass.split("-")[0].split("/")[1] && // memeriksa semester yang sama
            //     currentClass.split("-")[1].length > 1 && otherClass.split("-")[1].length === 1 && // Memeriksa gabungan dengan dasar (A, B, C, D, E)
            //     // currentClass.substring(2) === otherClass.substring(2) && // Memeriksa semester yang sama
            //     currentClass.split("-")[1].includes(otherClass.split("-")[1]) &&
            //     // (currentClass[1] !== otherClass[1] || currentClass[0] !== otherClass[2]) && // Memeriksa gabungan yang sama
            //     currentDay === otherDay && currentTime === otherTime
            // ) {
            //     this.fitness++;
            // }
        }

        for (let i = 0; i < pesananTidakBersedia.length; i++) {
            const otherParticle = pesananTidakBersedia[i];
            
            // Memeriksa apakah partikel saat ini, terdapat pada daftar pesanan tidak bersedia
            if (
                currentLecturer.replace(/[^\w\s]/gi, '').toLowerCase().trim().replaceAll(' ','') === otherParticle.lecturerName.replace(/[^\w\s]/gi, '').toLowerCase().trim().replaceAll(' ','') && 
                currentDay === Number(otherParticle.hari)
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
        if (this.pengampu.kategoriKelas === "Reguler" || this.pengampu.kategoriKelas === "reguler") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 4) + 1; // 1-4 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00)

            if (this.pengampu.jenisMatkul === "Teori" || this.pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (this.pengampu.jenisMatkul === "Praktikum" || this.pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (this.pengampu.kategoriKelas === "Malam" || this.pengampu.kategoriKelas === "malam") {
            randomDay = Math.floor(Math.random() * 5) + 1; // 1-5 (Senin-Jumat)
            randomTime = Math.floor(Math.random() * 2) + 5; // 5-6 (17:00-19:00, 19:00-21:00)

            if (this.pengampu.jenisMatkul === "Teori" || this.pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 9) + 1; // 1-9
            } else if (this.pengampu.jenisMatkul === "Praktikum" || this.pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }

        } else if (this.pengampu.kategoriKelas === "Ekstensi" || this.pengampu.kategoriKelas === "ekstensi") {
            randomDay = Math.floor(Math.random() * 2) + 6; // 6-7 (Sabtu-Minggu)
            randomTime = Math.floor(Math.random() * 6) + 1; // 1-6 (08:00-10:00, 10:00-12:00, 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00)
        
            if (this.pengampu.jenisMatkul === "Teori" || this.pengampu.jenisMatkul === "teori"){
                randomRoom = Math.floor(Math.random() * 8) + 2; // 2-9

                while (randomRoom === 8) {
                    randomRoom = Math.floor(Math.random() * 8) + 2; // Menghasilkan ulang angka acak jika angka sebelumnya adalah 8
                }

            } else if (this.pengampu.jenisMatkul === "Praktikum" || this.pengampu.jenisMatkul === "praktikum") {
                randomRoom = Math.floor(Math.random() * 2) + 10; // 10-11
            }
        }

        // Menentukan room, time dan day matkul hukum
        if (this.pengampu.fakultas === "Hukum dan Ilmu Sosial" || this.pengampu.fakultas === "hukum dan ilmu sosial") {
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
    loadDataPesananTidakBersediaFromStorage();
    // console.log(pengampu);
    // console.log(pesanan);
});

// handler proses jadwal menggunakan algoritma PSO
const prosesJadwalBtn = document.querySelector(".proses-jadwal-btn");
prosesJadwalBtn.addEventListener("click", function() {   
    // Menghapus hasil jadwal sebelumnya
    const tabelJadwal = document.querySelector('.tabel-jadwal');
    const cells = document.querySelectorAll('.tabel-jadwal td'); 

    // Mengosongkan semua sel dalam tabel
    cells.forEach(cell => {
        cell.innerHTML = "";
    });

    // hapus daftar jadwal yang belum optimal jika hasil generate sebelumnya memiliki jadwal yang belum optimal
    const daftarJadwalBelumOptimal = document.querySelector("tbody.daftar-belum-optimal");
    daftarJadwalBelumOptimal.innerHTML = '';
    
    // Main aplication

    // Definisikan parameter PSO
    let globalBestPosition = null;
    let jumlahPengampu = pengampu.length;
    let iterasiMaksimal = 200;
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

    // console.log(swarmBelumOptimal);
    // console.log(swarmSudahOptimal);

    // proses #5 duplikat array swarmBelumOptimal agar kita bisa melakukan update velocity/posisi
    let newSwarmBelumOptimal = swarmBelumOptimal.map(particle => Object.create(Object.getPrototypeOf(particle), Object.getOwnPropertyDescriptors(particle)));
    // console.log(newSwarmBelumOptimal);

    // proses #6 main looping PSO, looping akan terus terjadi sampai jadwal optimal
    let isAllOptimal = false;
    let iterasiSaatIni = 0; // Inisialisasi iterasi saat ini
    let counterOptimal = 1;
    while ((!isAllOptimal) && (iterasiSaatIni < iterasiMaksimal)) {
        newSwarmBelumOptimal.forEach(particle => {
            particle.updateVelocity();
            // particle.initialize(particle.pengampu)
            particle.checkStatus(swarmSudahOptimal);

            if (particle.isSesuaiKriteria === true) {
                swarmSudahOptimal.push(particle)
            }
        })

        // newSwarmBelumOptimal.forEach(particle => {
        //     particle.checkStatus(swarmSudahOptimal);

        //     if (particle.isSesuaiKriteria === true) {
        //         swarmSudahOptimal.push(particle)
        //     }
        // })

        // Menghapus partikel yang sesuai kriteria dari newSwarmBelumOptimal
        // const newSwarmBelumOptimalFiltered = newSwarmBelumOptimal.filter(particle => !particle.isSesuaiKriteria);
        newSwarmBelumOptimal = newSwarmBelumOptimal.filter(particle => !particle.isSesuaiKriteria);

        // // Memperbarui newSwarmBelumOptimal dengan partikel yang tidak sesuai kriteria
        // newSwarmBelumOptimal.length = 0;
        // newSwarmBelumOptimal.push(...newSwarmBelumOptimalFiltered);

        // Memeriksa apakah semua partikel sudah optimal
        isAllOptimal = newSwarmBelumOptimal.length === 0;
        // // Memeriksa apakah semua partikel sudah optimal
        // isAllOptimal = newSwarmBelumOptimal.every(particle => particle.isSesuaiKriteria);

        
        // mengecek berapa kali looping terjadi
        console.log(`terjadi looping ke ${counterOptimal}`);
        iterasiSaatIni++;
        counterOptimal++;
        console.log("partikel belum optimal", newSwarmBelumOptimal);
    }

    // Tampilkan peringatan jika hasil belum optimal
    if (newSwarmBelumOptimal.length !== 0) {
        alert(`Masih Terdapat ${newSwarmBelumOptimal.length} Jadwal yg belum mendapat posisi yg tepat`);

        // const daftarJadwalBelumOptimal = document.querySelector("tbody.daftar-belum-optimal");
        daftarJadwalBelumOptimal.innerHTML = '';
        
        let jadwalBelumOptimalHTML = ''; // String untuk mengumpulkan semua baris
        for (const jadwalBelumOptimal of newSwarmBelumOptimal) {
            jadwalBelumOptimalHTML += `
                <tr>
                    <td scope="col">${jadwalBelumOptimal.pengampu.courseName}</td>
                    <td scope="col">${jadwalBelumOptimal.pengampu.lecturerName}</td>
                    <td scope="col">${jadwalBelumOptimal.pengampu.className}</td>
                    <td scope="col">${jadwalBelumOptimal.pengampu.jumlahSks}</td>
                    <td scope="col">${jadwalBelumOptimal.pengampu.jenisMatkul}</td>
                    <td scope="col">${jadwalBelumOptimal.pengampu.kategoriKelas}</td>
                    <td scope="col">${jadwalBelumOptimal.pengampu.fakultas}</td>
                </tr>
            `;
        }
    
        // Sekali loop selesai, setel innerHTML
        daftarJadwalBelumOptimal.innerHTML = jadwalBelumOptimalHTML;

        // location.reload();
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
    // console.log("partikel belum optimal", newSwarmBelumOptimal.length);
    // console.log(hasilPenjadwalan);

    // ------------------------------------------------ //
    //    Menampilkan data jadwal dalam bentuk tabel    //
    // ------------------------------------------------ //

    // const tabelJadwal = document.querySelector('.tabel-jadwal');
    const timeElements = document.querySelectorAll('th.time');
    const dayElements = document.querySelectorAll('th.day');
    // const cells = document.querySelectorAll('.tabel-jadwal td');
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
                    <div id="jadwal">
                        <p>${jadwal.className}</p>
                        <p>${jadwal.courseName} || ${jadwal.jumlahSks} SKS</p>
                        <p>${jadwal.lecturerName}</p>
                    </div>
                    `;
                } else {
                    cellArray[cellIndex].innerHTML = `
                    <div id="jadwal">
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>
                    `;
                }

                cellIndex++;
                // console.log(`${hariTabel} || ${waktuTabel} || ${ruanganTabel}`);
            }
        }
    }

    for (const cell of cellArray) {
        cell.addEventListener('click', function() {
            // Mengambil semua elemen paragraf di dalam elemen dengan id "jadwal"
            let divJadwal = this.querySelector('#jadwal');
            let paragraphs = divJadwal.querySelectorAll('p');

            // Iterasi melalui semua paragraf dan terapkan logika yang sama untuk setiap paragraf
            for (let i = 0; i < paragraphs.length; i++) {
                let paragraph = paragraphs[i];

                if (paragraph.hasAttribute('data-clicked')) {
                    continue;
                }
                paragraph.setAttribute('data-clicked', 'yes');
                paragraph.setAttribute('data-text', paragraph.innerText);

                let input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.value = paragraph.innerText;
                input.style.border = "0px";
                input.style.padding = "5px";
                input.style.backgroundColor = "#a7c0ff";

                input.onblur = function() {
                    var td = input.parentElement;
                    var orig_text = input.parentElement.getAttribute('data-text');
                    var current_text = this.value;

                    if (orig_text != current_text) {
                        // Terdapat perubahan; simpan perubahan
                        td.removeAttribute('data-clicked');
                        td.removeAttribute('data-text');
                        td.innerHTML = current_text;
                        console.log(orig_text + ' is changed to ' + current_text);
                    } else {
                        td.removeAttribute('data-clicked');
                        td.removeAttribute('data-text');
                        td.innerHTML = orig_text;
                        console.log('no changes');
                    }
                }

                paragraph.innerText = '';
                paragraph.style.cssText = 'padding: 0px 0px';
                paragraph.append(input);
                // paragraph.firstElementChild.select();
            }
        })
    }

    document.addEventListener('click', function(event) {
        let paragraphs = document.querySelectorAll('#tabel-jadwal p[data-clicked="yes"]');
        // Periksa apakah yang diklik berada di luar tabel (tidak ada elemen dengan id "tabel-jadwal" yang berisi sel yang diklik)
        if (!event.target.closest('#tabel-jadwal')) {
            // Kembalikan semua elemen paragraf ke kondisi awal
            for (let i = 0; i < paragraphs.length; i++) {
                let paragraph = paragraphs[i];
                let orig_text = paragraph.getAttribute('data-text');
                paragraph.removeAttribute('data-clicked');
                paragraph.removeAttribute('data-text');
                paragraph.innerText = orig_text;
            }
        }
    });

})


// handle submit input pesanan
const inputPesananForm = document.getElementById("inputPesanan");

inputPesananForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form values
    const pengampuId = +new Date();

    let courseName = document.getElementById("inputPesananCourseName").value;
    let lecturerName = document.getElementById("inputPesananLecturerName").value;
    let className = document.getElementById("inputPesananClassName").value;
    let jumlahSks = document.getElementById("inputPesananJumlahSks").value;
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

    if (isJadwalPesananPengampuEqual(courseName, lecturerName, className)) {
        alert(`Jadwal yang anda masukkan sudah tersedia di daftar pengampu non-pesanan, hapus terlebih dahulu data pada jadwal non-pesanan`);
        return;
    }

    const pesananObject = generatePesananObject(pengampuId, courseName, lecturerName, className, jumlahSks, jenisMatkul, kategoriKelas, fakultas, hari, waktu, ruangan);

    document.getElementById("inputPesananCourseName").value = null;
    document.getElementById("inputPesananLecturerName").value = null;
    document.getElementById("inputPesananClassName").value = null;
    document.getElementById("inputPesananJumlahSks").value = '';
    document.getElementById("inputPesananJenisMatkul").value = '';
    document.getElementById("inputPesananKategoriKelas").value = '';
    document.getElementById("inputPesananFakultas").value = '';
    document.getElementById("inputHari").value = '';
    document.getElementById("inputWaktu").value = '';
    document.getElementById("inputRuangan").value = '';


    pesanan.push(pesananObject);
    saveDataPesanan();

    // console.log(pesanan);

    // menampilkan semua data pada array pesanan dalam bentuk baris tabel
    const tabelDaftarPesanan = document.querySelector("tbody.daftar-pesanan");
    tabelDaftarPesanan.innerHTML = '';

    for (const pesananItem of pesanan) {
        const newPesananElement = generatePesananElement(pesananItem);
        tabelDaftarPesanan.append(newPesananElement);
    }
});

// handle submit input jadwal tidak bersedia dosen
const inputTidakBersedia = document.getElementById("inputTidakBersedia");

inputTidakBersedia.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form values
    const pengampuId = +new Date();
    let lecturerName = document.getElementById("inputTidakBersediaLecturerName").value;
    let hari = document.getElementById("inputTidakBersediaHari").value;
    
    // Check if the same schedule already exists
    // if (isJadwalPesananExists(hari, waktu, ruangan)) {
    //     alert(`Jadwal pada Hari, Pukul dan di Ruangan tersebut sudah terisi.`);
    //     return;
    // }

    // if (isJadwalPesananPengampuEqual(courseName, lecturerName, className)) {
    //     alert(`Jadwal yang anda masukkan sudah tersedia di daftar pengampu non-pesanan, hapus terlebih dahulu data pada jadwal non-pesanan`);
    //     return;
    // }

    const pesananTidakBersediaObject = generatePesananTidakBersediaObject(pengampuId, lecturerName, hari);

    document.getElementById("inputTidakBersediaLecturerName").value = null;
    document.getElementById("inputTidakBersediaHari").value = '';

    pesananTidakBersedia.push(pesananTidakBersediaObject);
    saveDataPesananTidakBersedia();

    // console.log(pesanan);

    // menampilkan semua data pada array pesanan dalam bentuk baris tabel
    const tabelDaftarPesananTidakBersedia = document.querySelector("tbody.daftar-pesanan-tidak-bersedia");
    tabelDaftarPesananTidakBersedia.innerHTML = '';

    for (const pesananTidakBersediaItem of pesananTidakBersedia) {
        const newPesananTidakBersediaElement = generatePesananTidakBersediaElement(pesananTidakBersediaItem);
        tabelDaftarPesananTidakBersedia.append(newPesananTidakBersediaElement);
    }
});

// handle download button
const downloadBtn = document.querySelector("#download-jadwal-btn");
downloadBtn.addEventListener("click", function() {
    exportTableToPdf();
})

// handle hapus data
const deleteAllDataBtn = document.querySelector("#hapus-jadwal-btn");
deleteAllDataBtn.addEventListener("click", function() {
    const confirmation = window.confirm("APAKAH ANDA YAKIN INGIN MENGHAPUS SEMUA DATA?");

    if (confirmation) {
        // Jika user menekan tombol "OK", maka hapus semua data
        removeDataPengampu();
        removeDataPesanan();
        removeDataPesananTidakBersedia();
        alert("Semua data telah dihapus!");

        // Perbarui halaman setelah penghapusan data berhasil
        location.reload();
    } else {
        // Jika user menekan tombol "Batal", tidak melakukan apa-apa
        alert("Penghapusan data dibatalkan!");
    }
})


// ---------------------------------------------- //
//    Mendefinisikan semua function di sini      //
// -------------------------------------------- //

// function untuk mengkonversi file excel ke JSON kemudian tampilkan 
// dalam bentuk tabel
let selectedFile;

document.getElementById("input-file").addEventListener("change", (e) => {
    selectedFile = e.target.files[0];

    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, {type:"binary"});
            let sheet = workbook.SheetNames[0];
            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            
            // Modifikasi nama properti di dalam array rowObject
            rowObject.forEach((item, index) => {
                item.pengampuId = index + 1;

                item.courseName = item["Nama Matakuliah"]; // Ganti nama properti di sini
                delete item["Nama Matakuliah"]; // Hapus nama properti lama jika perlu
                
                item.lecturerName = item["Nama Dosen"]; 
                delete item["Nama Dosen"];
                
                item.className = item["Kelas"]; 
                delete item["Kelas"]; 

                item.jumlahSks = item.SKS.toString(); 
                delete item.SKS; 

                item.jenisMatkul = item["Jenis Matkul"]; 
                delete item["Jenis Matkul"]; 

                // validasi nilai kolom jenis matkul
                const distanceToTeori = levenshteinDistance(item.jenisMatkul.toLowerCase(), "teori");
                const distanceToPraktikum = levenshteinDistance(item.jenisMatkul.toLowerCase(), "praktikum");

                if (distanceToTeori <= 3 || distanceToPraktikum <= 3) {
                    if (distanceToTeori <= distanceToPraktikum) {
                        item.jenisMatkul = "Teori";
                    } else {
                        item.jenisMatkul = "Praktikum";
                    }
                } else {
                    // Default jika tidak ada kesalahan pengejaan yang mendekati "Praktikum"
                    item.jenisMatkul = "Teori"; // Atau pilihan lain sesuai kebutuhan
                }

                item.kategoriKelas = item["Kategori Kelas"]; 
                delete item["Kategori Kelas"];
                
                // Validasi nilai kolom kategori kelas
                const distanceToReguler = levenshteinDistance(item.kategoriKelas.toLowerCase(), "reguler");
                const distanceToMalam = levenshteinDistance(item.kategoriKelas.toLowerCase(), "malam");
                const distanceToEkstensi = levenshteinDistance(item.kategoriKelas.toLowerCase(), "ekstensi");

                if (distanceToReguler <= 3 || distanceToMalam <= 3 || distanceToEkstensi <= 3) {
                    // Jika mendekati "reguler"
                    if (distanceToReguler <= distanceToMalam && distanceToReguler <= distanceToEkstensi) {
                        item.kategoriKelas = "Reguler";
                    }
                    // Jika mendekati "malam"
                    else if (distanceToMalam <= distanceToReguler && distanceToMalam <= distanceToEkstensi) {
                        item.kategoriKelas = "Malam";
                    }
                    // Jika mendekati "ekstensi"
                    else {
                        item.kategoriKelas = "Ekstensi";
                    }
                } else {
                    // Default jika tidak ada kesalahan pengejaan yang mendekati kategori kelas
                    item.kategoriKelas = "Reguler"; // Atau pilihan lain sesuai kebutuhan
                }

                item.fakultas = item["Fakultas"]; 
                delete item["Fakultas"]; 
                // validasi nilai kolom fakultas
                const distanceToIlkom = levenshteinDistance(item.fakultas.toLowerCase().replace(/\s/g, ""), "ilmukomputer");
                const distanceToHukum = levenshteinDistance(item.fakultas.toLowerCase().replace(/\s/g, ""), "hukumdanilmusosial");

                if (distanceToIlkom <= 3 || distanceToHukum <= 3) {
                    if (distanceToIlkom <= distanceToHukum) {
                        item.fakultas = "Ilmu Komputer";
                    } else {
                        item.fakultas = "Hukum dan Ilmu Sosial";
                    }
                } else {
                    // Default jika tidak ada kesalahan pengejaan yang mendekati "Praktikum"
                    item.fakultas = "Ilmu Komputer"; // Atau pilihan lain sesuai kebutuhan
                }

                item.semester = item.Semester; 
                delete item.Semester; 
            });
            
            pengampu = rowObject;

            // menampilkan semua data pada array pengampu dalam bentuk baris tabel
            const tabelDaftarPengampu = document.querySelector("tbody.daftar-pengampu");
            tabelDaftarPengampu.innerHTML = '';
            $('#timetabling').DataTable().destroy(); // Menghapus objek DataTable yang ada sebelumnya
            $('#timetabling tbody.daftar-pengampu').empty(); // Menghapus semua baris yang ada di tbody

            for (const pengampuItem of pengampu) {
                const newPengampuElement = generatePengampuElement(pengampuItem);
                tabelDaftarPengampu.append(newPengampuElement);
            }

            new DataTable('#timetabling');

            saveDataPengampu();
            
            // Setelah pemrosesan selesai, kosongkan input file
            e.target.value = "";

            // console.log(pengampu);
            // workbook.SheetNames.forEach(sheet => {
            //     let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            //     console.log(rowObject);
            // });
        }
    }
});

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Deletion
                matrix[i][j - 1] + 1, // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return matrix[b.length][a.length];
}

function generatePesananObject(pengampuId, courseName, lecturerName, className, jumlahSks, jenisMatkul, kategoriKelas, fakultas, hari, waktu, ruangan) {
    return {
        pengampuId,
        courseName,
        lecturerName,
        className,
        jumlahSks,
        jenisMatkul,
        kategoriKelas,
        fakultas,
        hari,
        waktu,
        ruangan
    }
}

function generatePesananTidakBersediaObject(pengampuId, lecturerName, hari) {
    return {
        pengampuId,
        lecturerName,
        hari
    }
}

// Event delegation untuk tombol "Edit pengampu"
let selectedPengampu = null;

const tablePengampuContainer = document.querySelector("tbody.daftar-pengampu"); // Gantikan "container" dengan elemen induk yang sesuai
tablePengampuContainer.addEventListener("click", function(event) {
    if (event.target.matches("i.bi.bi-pencil-square")) {
        const pengampuId = parseInt(event.target.dataset.pengampuId);
        if (!isNaN(pengampuId) && pengampuId >= 0 && pengampuId < pengampu.length) {
            selectedPengampu = pengampu[pengampuId];
            console.log(selectedPengampu);
            handleEditPengampuButton(selectedPengampu);
        }
    }
});

function generatePengampuElement(pengampuObject) {
    const logoEditBtn = document.createElement("i");
    logoEditBtn.classList.add("bi", "bi-pencil-square");
    // logoEditBtn.setAttribute("data-pengampu-id", pengampuObject.pengampuId);
    logoEditBtn.setAttribute("data-pengampu-id", pengampu.indexOf(pengampuObject));

    const logoDeleteBtn = document.createElement("i");
    logoDeleteBtn.classList.add("bi", "bi-trash");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("type", "button");
    editBtn.append(logoEditBtn);

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

// Event delegation untuk tombol "Edit pesanan"
let selectedPesanan = null;

const tablePesananContainer = document.querySelector("tbody.daftar-pesanan"); // Gantikan "container" dengan elemen induk yang sesuai
tablePesananContainer.addEventListener("click", function(event) {
    if (event.target.matches("i.bi.bi-pencil-square")) {
        const rowIndex = event.target.closest("tr").rowIndex;
        selectedPesanan = pesanan[rowIndex - 1]; // Kurangi 1 karena indeks dimulai dari 0
        // console.log(selectedPesanan);
        handleEditButton(selectedPesanan);
    }
});

function generatePesananElement(pesananObject) {
    const logoEditBtn = document.createElement("i");
    logoEditBtn.classList.add("bi", "bi-pencil-square");

    const logoDeleteBtn = document.createElement("i");
    logoDeleteBtn.classList.add("bi", "bi-trash");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("type", "button");
    editBtn.append(logoEditBtn);

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

    const dataJadwal = document.createElement("td");
    dataJadwal.innerHTML = 
    `
        ${hariTersedia[Number(pesananObject.hari) - 1]} <br>
        Ruangan ${slotRuangan[Number(pesananObject.ruangan) - 1]} <br> 
        ${slotWaktu[Number(pesananObject.waktu) - 1]} 
    `;

    const dataKolomKelas = document.createElement("td");
    dataKolomKelas.innerText = pesananObject.className;

    const dataKolomDosen = document.createElement("td");
    dataKolomDosen.innerText = pesananObject.lecturerName;

    const dataKolomMatkul = document.createElement("td");
    dataKolomMatkul.innerText = pesananObject.courseName;

    const dataKolomNomor = document.createElement("td");
    dataKolomNomor.innerText = pesanan.indexOf(pesananObject) + 1; //mendapatkan indeks sebuah array

    const dataPesananElement = document.createElement("tr");
    dataPesananElement.append(dataKolomNomor, dataKolomMatkul, dataKolomDosen, dataKolomKelas, dataJadwal, dataKolomAksi);

    return dataPesananElement;
}

// Event delegation untuk tombol "Edit pesanan tidak bersedia"
let selectedPesananTidakBersedia = null;

const tablePesananTidakBersediaContainer = document.querySelector("tbody.daftar-pesanan-tidak-bersedia"); // Gantikan "container" dengan elemen induk yang sesuai
tablePesananTidakBersediaContainer.addEventListener("click", function(event) {
    if (event.target.matches("i.bi.bi-pencil-square")) {
        const rowIndex = event.target.closest("tr").rowIndex;
        selectedPesananTidakBersedia = pesananTidakBersedia[rowIndex - 1]; // Kurangi 1 karena indeks dimulai dari 0
        // console.log(selectedPesanan);
        handleEditPesananTidakBersediaButton(selectedPesananTidakBersedia);
    }
});

function generatePesananTidakBersediaElement(pesananObject) {
    const logoEditBtn = document.createElement("i");
    logoEditBtn.classList.add("bi", "bi-pencil-square");

    const logoDeleteBtn = document.createElement("i");
    logoDeleteBtn.classList.add("bi", "bi-trash");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("type", "button");
    editBtn.append(logoEditBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.append(logoDeleteBtn);
    deleteBtn.addEventListener("click", function() {
        const selectedPesananTidakBersedia = pesananTidakBersedia.indexOf(pesananObject);
        pesananTidakBersedia.splice(selectedPesananTidakBersedia, 1);

        const tabelDaftarPesananTidakBersedia = document.querySelector("tbody.daftar-pesanan-tidak-bersedia");
        tabelDaftarPesananTidakBersedia.innerHTML = '';

        for (const pesananTidakBersediaItem of pesananTidakBersedia) {
            const newPesananTidakBersediaElement = generatePesananTidakBersediaElement(pesananTidakBersediaItem);
            tabelDaftarPesananTidakBersedia.append(newPesananTidakBersediaElement);
        }

        saveDataPesananTidakBersedia();
    })

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("action-btn");
    btnContainer.append(editBtn, deleteBtn);

    const dataKolomAksi = document.createElement("td");
    dataKolomAksi.append(btnContainer);

    const dataJadwal = document.createElement("td");
    dataJadwal.innerHTML = 
    `
        ${hariTersedia[Number(pesananObject.hari) - 1]}
    `;

    const dataKolomDosen = document.createElement("td");
    dataKolomDosen.innerText = pesananObject.lecturerName;

    const dataKolomNomor = document.createElement("td");
    dataKolomNomor.innerText = pesananTidakBersedia.indexOf(pesananObject) + 1; //mendapatkan indeks sebuah array

    const dataPesananTidakBersediaElement = document.createElement("tr");
    dataPesananTidakBersediaElement.append(dataKolomNomor, dataKolomDosen, dataJadwal, dataKolomAksi);

    return dataPesananTidakBersediaElement;
}

function saveDataPengampu() {
    const dataJson = JSON.stringify(pengampu);
    localStorage.setItem(localStoragePengampu, dataJson);
}

function saveDataPesanan() {
    const dataJson = JSON.stringify(pesanan);
    localStorage.setItem(localStoragePesanan, dataJson);
}

function saveDataPesananTidakBersedia() {
    const dataJson = JSON.stringify(pesananTidakBersedia);
    localStorage.setItem(localStoragePesananTidakBersedia, dataJson);
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

function loadDataPesananTidakBersediaFromStorage() {
    const serializedData = localStorage.getItem(localStoragePesananTidakBersedia);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null){
        for(let pesananItem of data){
            pesananTidakBersedia.push(pesananItem);
        }
    }

    // menampilkan semua data pada array pengampu dalam bentuk baris tabel
    const tabelDaftarPesananTidakBersedia = document.querySelector("tbody.daftar-pesanan-tidak-bersedia");
    tabelDaftarPesananTidakBersedia.innerHTML = '';

    for (const pesananTidakBersediaItem of pesananTidakBersedia) {
        const newPesananTidakBersediaElement = generatePesananTidakBersediaElement(pesananTidakBersediaItem);
        tabelDaftarPesananTidakBersedia.append(newPesananTidakBersediaElement);
    }
}

function removeDataPengampu() {
    localStorage.removeItem(localStoragePengampu);
}

function removeDataPesanan() {
    localStorage.removeItem(localStoragePesanan);
}

function removeDataPesananTidakBersedia() {
    localStorage.removeItem(localStoragePesananTidakBersedia);
}

// fungsi print table
function exportTableToPdf() {
    $('header').css('display', 'none');
    $('hr').css('display', 'none');
    $('.first-section').css('display', 'none');
    $('.second-section').css('display', 'none');
    $('.proses-jadwal-btn-container').css('display', 'none');
    $('.tabel-daftar-belum-optimal').css('display', 'none');

    // Ambil semua tabel hari
    const tabelSenin = document.querySelector(".tabel-senin");
    const tabelSelasa = document.querySelector(".tabel-selasa");
    const tabelRabu = document.querySelector(".tabel-rabu");
    const tabelKamis = document.querySelector(".tabel-kamis");
    const tabelJumat = document.querySelector(".tabel-jumat");
    const tabelSabtu = document.querySelector(".tabel-sabtu");
    const tabelMinggu = document.querySelector(".tabel-minggu");

    // Fungsi untuk mencetak tabel ke halaman PDF
    const printTabelToPdf = async (tabel, isLastPage) => {
        // Menambahkan keterangan waktu pada konten tanda tangan
        const arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        const date = new Date();

        const tanggal = date.getDate();
        const bulan = date.getMonth();
        const tahun = date.getFullYear();
        // alert(`Makassar, ${tanggal} ${arrbulan[bulan]} ${tahun}`);

        // Tambahkan elemen <div> untuk tanda tangan dan keterangan tanggal
        const tandaTanganContainer = document.createElement("div");
        tandaTanganContainer.classList.add("d-flex", "justify-content-end");
        tandaTanganContainer.innerHTML = 
        `
        <div>
            <p style="margin-bottom: 0; font-size: 12px;">Makassar, ${tanggal} ${arrbulan[bulan]} ${tahun}</p>
            <br><br><br>
            <p style="text-decoration:underline; margin-bottom: 0; font-size: 12px;">Ir. Billy Eden William Asrul, S.Kom., M.T.</p>
            <p style="margin-bottom: 0; font-size: 12px;">Wakil Rektor Bidang Akademik</p>
        </div>
        `

        const dataUrl = await domtoimage.toPng(tabel);
        const img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img); // Menambahkan gambar ke body halaman

        // Jika halaman terakhir (tabel Minggu), tambahkan konten tanda tangan dan keterangan tanggal
        if (isLastPage) {
            document.body.appendChild(tandaTanganContainer);
        }

        window.print(); // Mencetak halaman
        document.body.removeChild(img); // Menghapus gambar setelah mencetak

        // Jika halaman terakhir (tabel Minggu), hapus konten tanda tangan dan keterangan tanggal setelah mencetak
        if (isLastPage) {
            document.body.removeChild(tandaTanganContainer);
        }
    };

    // Sembunyikan semua tabel hari kecuali tabel senin
    $('.tabel-senin').show();
    $('.tabel-selasa, .tabel-rabu, .tabel-kamis, .tabel-jumat, .tabel-sabtu, .tabel-minggu').hide();

    // Cetak tabel senin
    printTabelToPdf(tabelSenin, false)
        .then(() => {
            // Sembunyikan semua tabel hari kecuali tabel selasa
            $('.tabel-selasa').show();
            $('.tabel-senin, .tabel-rabu, .tabel-kamis, .tabel-jumat, .tabel-sabtu, .tabel-minggu').hide();

            // Cetak tabel selasa
            return printTabelToPdf(tabelSelasa, false);
        })
        .then(() => {
            // Sembunyikan semua tabel hari kecuali tabel selasa
            $('.tabel-rabu').show();
            $('.tabel-senin, .tabel-selasa, .tabel-kamis, .tabel-jumat, .tabel-sabtu, .tabel-minggu').hide();

            // Cetak tabel selasa
            return printTabelToPdf(tabelRabu, false);
        })
        .then(() => {
            // Sembunyikan semua tabel hari kecuali tabel selasa
            $('.tabel-kamis').show();
            $('.tabel-senin, .tabel-selasa, .tabel-rabu, .tabel-jumat, .tabel-sabtu, .tabel-minggu').hide();

            // Cetak tabel selasa
            return printTabelToPdf(tabelKamis, false);
        })
        .then(() => {
            // Sembunyikan semua tabel hari kecuali tabel selasa
            $('.tabel-jumat').show();
            $('.tabel-senin, .tabel-selasa, .tabel-rabu, .tabel-kamis, .tabel-sabtu, .tabel-minggu').hide();

            // Cetak tabel selasa
            return printTabelToPdf(tabelJumat, false);
        })
        .then(() => {
            // Sembunyikan semua tabel hari kecuali tabel selasa
            $('.tabel-sabtu').show();
            $('.tabel-senin, .tabel-selasa, .tabel-rabu, .tabel-kamis, .tabel-jumat, .tabel-minggu').hide();

            // Cetak tabel selasa
            return printTabelToPdf(tabelSabtu, false);
        })
        .then(() => {
            // Sembunyikan semua tabel hari kecuali tabel selasa
            $('.tabel-minggu').show();
            $('.tabel-senin, .tabel-selasa, .tabel-rabu, .tabel-kamis, .tabel-jumat, .tabel-sabtu').hide();

            // Cetak tabel selasa
            return printTabelToPdf(tabelMinggu, true);
        })
        .then(() => {
            // Lanjutkan proses serupa untuk setiap hari
            // ...

            // Setelah semua cetakan selesai, tampilkan kembali elemen yang disembunyikan
            $('.tabel-senin, .tabel-selasa, .tabel-rabu, .tabel-kamis, .tabel-jumat, .tabel-sabtu, .tabel-minggu').show();

            // Lakukan reload halaman setelah proses cetak selesai
            location.reload();
        })
        .catch((error) => {
            console.error('Error capturing elements:', error);
        });
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

// Fungsi untuk memeriksa apakah jadwal pesanan sudah ada dalam data pengampu non-pesanan
function isJadwalPesananPengampuEqual(courseName, lecturerName, className) {
    // Lakukan perulangan pada array data pengampu non-pesanan
    return pengampu.some(
        (item) =>
        item.courseName.trim().toLowerCase() === courseName.trim().toLowerCase() &&
        item.lecturerName.trim().toLowerCase() === lecturerName.trim().toLowerCase() &&
        item.className.trim().toLowerCase() === className.trim().toLowerCase()
    );
}

function isJadwalPengampuExists(courseName, lecturerName, className, jumlahSks, jenisMatkul, kategoriKelas, fakultas) {
    return pengampu.some(
        (item) =>
        item.courseName === courseName &&
        item.lecturerName === lecturerName &&
        item.className === className &&
        item.jumlahSks === jumlahSks &&
        item.jenisMatkul === jenisMatkul &&
        item.kategoriKelas === kategoriKelas &&
        item.fakultas === fakultas
    );
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

// fungsi untuk handle edit pesanan
function handleEditButton(selectedPesanan) {
    // Tampilkan data pesanan di dalam modal
    document.getElementById("inputPesananCourseNameModal").value = selectedPesanan.courseName;
    document.getElementById("inputPesananLecturerNameModal").value = selectedPesanan.lecturerName;
    document.getElementById("inputPesananClassNameModal").value = selectedPesanan.className;
    document.getElementById("inputPesananJumlahSksModal").value = selectedPesanan.jumlahSks;
    document.getElementById("inputPesananJenisMatkulModal").value = selectedPesanan.jenisMatkul;
    document.getElementById("inputPesananKategoriKelasModal").value = selectedPesanan.kategoriKelas;
    document.getElementById("inputPesananFakultasModal").value = selectedPesanan.fakultas;
    document.getElementById("inputHariModal").value = selectedPesanan.hari;
    document.getElementById("inputWaktuModal").value = selectedPesanan.waktu;
    document.getElementById("inputRuanganModal").value = selectedPesanan.ruangan;

    console.log("ter klik");

    // Tampilkan modal
    const editPesananModal = new bootstrap.Modal(document.getElementById('editPesananModal'));
    editPesananModal.show();
}

// Menangani klik tombol "Save" pada modal
const saveBtn = document.getElementById("pesananEditBtn");
saveBtn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("ter klik save");
    // Ambil nilai-nilai dari input di dalam modal
    const newCourseName = document.getElementById("inputPesananCourseNameModal").value;
    const newLecturerName = document.getElementById("inputPesananLecturerNameModal").value;
    const newClassName = document.getElementById("inputPesananClassNameModal").value;
    const newJumlahSks = document.getElementById("inputPesananJumlahSksModal").value;
    const newJenisMatkul = document.getElementById("inputPesananJenisMatkulModal").value;
    const newKategoriKelas = document.getElementById("inputPesananKategoriKelasModal").value;
    const newFakultas = document.getElementById("inputPesananFakultasModal").value;
    const newHari = document.getElementById("inputHariModal").value;
    const newWaktu = document.getElementById("inputWaktuModal").value;
    const newRuangan = document.getElementById("inputRuanganModal").value;

    // Update data pesanan dengan nilai-nilai baru
    selectedPesanan.courseName = newCourseName;
    selectedPesanan.lecturerName = newLecturerName;
    selectedPesanan.className = newClassName;
    selectedPesanan.jumlahSks = newJumlahSks;
    selectedPesanan.jenisMatkul = newJenisMatkul;
    selectedPesanan.kategoriKelas = newKategoriKelas;
    selectedPesanan.fakultas = newFakultas;
    selectedPesanan.hari = newHari;
    selectedPesanan.waktu = newWaktu;
    selectedPesanan.ruangan = newRuangan;

    // Simpan data pesanan yang sudah diubah ke local storage
    saveDataPesanan();

    // Update tampilan tabel dengan data pesanan yang baru
    const tabelDaftarPesanan = document.querySelector("tbody.daftar-pesanan");
    tabelDaftarPesanan.innerHTML = '';
    
    for (const pesananItem of pesanan) {
        const newPesananElement = generatePesananElement(pesananItem);
        tabelDaftarPesanan.append(newPesananElement);
    }
});

// fungsi untuk handle edit pesanan jadwal tidak bersedia
function handleEditPesananTidakBersediaButton(selectedPesananTidakBersedia) {
    // Tampilkan data pesanan di dalam modal
    document.getElementById("inputPesananTidakBersediaLecturerNameModal").value = selectedPesananTidakBersedia.lecturerName;
    document.getElementById("inputTidakBersediaHariModal").value = selectedPesananTidakBersedia.hari;

    console.log("ter klik");

    // Tampilkan modal
    const editPesananTidakBersediaModal = new bootstrap.Modal(document.getElementById('editPesananTidakBersediaModal'));
    editPesananTidakBersediaModal.show();
}

// Menangani klik tombol "Save" pada modal
const savePesananTidakBersediaBtn = document.getElementById("pesananTidakBersediaEditBtn");
savePesananTidakBersediaBtn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("ter klik save");
    // Ambil nilai-nilai dari input di dalam modal
    const newLecturerName = document.getElementById("inputPesananTidakBersediaLecturerNameModal").value;
    const newHari = document.getElementById("inputTidakBersediaHariModal").value;

    // Update data pesanan dengan nilai-nilai baru
    selectedPesananTidakBersedia.lecturerName = newLecturerName;
    selectedPesananTidakBersedia.hari = newHari;

    // Simpan data pesanan yang sudah diubah ke local storage
    saveDataPesananTidakBersedia();

    // Update tampilan tabel dengan data pesanan yang baru
    const tabelDaftarPesananTidakBersedia = document.querySelector("tbody.daftar-pesanan-tidak-bersedia");
    tabelDaftarPesananTidakBersedia.innerHTML = '';
    
    for (const pesananTidakBersediaItem of pesananTidakBersedia) {
        const newPesananTidakBersediaElement = generatePesananTidakBersediaElement(pesananTidakBersediaItem);
        tabelDaftarPesananTidakBersedia.append(newPesananTidakBersediaElement);
    }
});

// fungsi untuk handle edit pengampu
function handleEditPengampuButton(selectedPengampu) {
    // Tampilkan data pesanan di dalam modal
    document.getElementById("inputPengampuCourseNameModal").value = selectedPengampu.courseName;
    document.getElementById("inputPengampuLecturerNameModal").value = selectedPengampu.lecturerName;
    document.getElementById("inputPengampuClassNameModal").value = selectedPengampu.className;
    document.getElementById("inputPengampuJumlahSksModal").value = selectedPengampu.jumlahSks;
    document.getElementById("inputPengampuJenisMatkulModal").value = selectedPengampu.jenisMatkul;
    document.getElementById("inputPengampuKategoriKelasModal").value = selectedPengampu.kategoriKelas;
    document.getElementById("inputPengampuFakultasModal").value = selectedPengampu.fakultas;

    console.log("ter klik");

    // Tampilkan modal
    const editPengampuModal = new bootstrap.Modal(document.getElementById('editPengampuModal'));
    editPengampuModal.show();
}

// Menangani klik tombol "Save" pada modal
const savePengampuBtn = document.getElementById("pengampuEditBtn");
savePengampuBtn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("ter klik save");
    // Ambil nilai-nilai dari input di dalam modal
    const newCourseName = document.getElementById("inputPengampuCourseNameModal").value;
    const newLecturerName = document.getElementById("inputPengampuLecturerNameModal").value;
    const newClassName = document.getElementById("inputPengampuClassNameModal").value;
    const newJumlahSks = document.getElementById("inputPengampuJumlahSksModal").value;
    const newJenisMatkul = document.getElementById("inputPengampuJenisMatkulModal").value;
    const newKategoriKelas = document.getElementById("inputPengampuKategoriKelasModal").value;
    const newFakultas = document.getElementById("inputPengampuFakultasModal").value;

    // Update data pesanan dengan nilai-nilai baru
    selectedPengampu.courseName = newCourseName;
    selectedPengampu.lecturerName = newLecturerName;
    selectedPengampu.className = newClassName;
    selectedPengampu.jumlahSks = newJumlahSks;
    selectedPengampu.jenisMatkul = newJenisMatkul;
    selectedPengampu.kategoriKelas = newKategoriKelas;
    selectedPengampu.fakultas = newFakultas;

    // Simpan data pesanan yang sudah diubah ke local storage
    saveDataPengampu();

    // Update tampilan tabel dengan data pesanan yang baru
    const tabelDaftarPengampu = document.querySelector("tbody.daftar-pengampu");
    tabelDaftarPengampu.innerHTML = '';
    $('#timetabling').DataTable().destroy(); // Menghapus objek DataTable yang ada sebelumnya
    $('#timetabling tbody.daftar-pengampu').empty(); // Menghapus semua baris yang ada di tbody

    for (const pengampuItem of pengampu) {
        const newPengampuElement = generatePengampuElement(pengampuItem);
        tabelDaftarPengampu.append(newPengampuElement);
    }

    new DataTable('#timetabling');
});

// penyesuaian form jadwal permintaan dosen
const elemenSelectJenisMatkul = document.getElementById("inputPesananJenisMatkul");
const elemenSelectKategoriKelas = document.getElementById("inputPesananKategoriKelas");
const elemenSelectRuangan = document.getElementById("inputRuangan");
const elemenSelectFakultas = document.getElementById("inputPesananFakultas");
const elemenSelectHari = document.getElementById("inputHari");
const elemenSelectWaktu = document.getElementById("inputWaktu");

elemenSelectJenisMatkul.addEventListener("change", function(e) {
    // Menghapus atribut disabled dari semua elemen option pada select ruangan
    for (let i = 0; i < elemenSelectRuangan.options.length; i++) {
        elemenSelectRuangan.options[i].removeAttribute("disabled");
    }

    if (e.target.value === "teori") {
        elemenSelectRuangan.options[10].disabled = true;
        elemenSelectRuangan.options[11].disabled = true;
    } else {
        elemenSelectRuangan.options[1].disabled = true;
        elemenSelectRuangan.options[2].disabled = true;
        elemenSelectRuangan.options[3].disabled = true;
        elemenSelectRuangan.options[4].disabled = true;
        elemenSelectRuangan.options[5].disabled = true;
        elemenSelectRuangan.options[6].disabled = true;
        elemenSelectRuangan.options[7].disabled = true;
        elemenSelectRuangan.options[8].disabled = true;
        elemenSelectRuangan.options[9].disabled = true;
    }
})

elemenSelectKategoriKelas.addEventListener("change", function(e) {
    for (let i = 0; i < elemenSelectHari.options.length; i++) {
        elemenSelectHari.options[i].removeAttribute("disabled");
    }

    for (let i = 0; i < elemenSelectWaktu.options.length; i++) {
        elemenSelectWaktu.options[i].removeAttribute("disabled");
    }

    if (e.target.value === "reguler") {
        elemenSelectHari.options[6].disabled = true;
        elemenSelectHari.options[7].disabled = true;
        elemenSelectWaktu.options[5].disabled = true;
        elemenSelectWaktu.options[6].disabled = true;
    } else if (e.target.value === "malam") {
        elemenSelectHari.options[6].disabled = true;
        elemenSelectHari.options[7].disabled = true;
        elemenSelectWaktu.options[1].disabled = true;
        elemenSelectWaktu.options[2].disabled = true;
        elemenSelectWaktu.options[3].disabled = true;
        elemenSelectWaktu.options[4].disabled = true;
    } else {
        elemenSelectHari.options[1].disabled = true;
        elemenSelectHari.options[2].disabled = true;
        elemenSelectHari.options[3].disabled = true;
        elemenSelectHari.options[4].disabled = true;
        elemenSelectHari.options[5].disabled = true;
    }
})

// elemenSelectFakultas.addEventListener("change", function(e) {
//     for (let i = 0; i < elemenSelectHari.options.length; i++) {
//         elemenSelectHari.options[i].removeAttribute("disabled");
//     }

//     for (let i = 0; i < elemenSelectWaktu.options.length; i++) {
//         elemenSelectWaktu.options[i].removeAttribute("disabled");
//     }

//     if (e.target.value === "hukum") {
//         elemenSelectHari.options[1].disabled = true;
//         elemenSelectHari.options[2].disabled = true;
//         elemenSelectHari.options[3].disabled = true;
//         elemenSelectHari.options[4].disabled = true;
//         elemenSelectHari.options[5].disabled = true;
//         elemenSelectWaktu.options[6].disabled = true;
//         elemenSelectRuangan.options[1].disabled = true;
//         elemenSelectRuangan.options[2].disabled = true;
//         elemenSelectRuangan.options[3].disabled = true;
//         elemenSelectRuangan.options[4].disabled = true;
//         elemenSelectRuangan.options[5].disabled = true;
//         elemenSelectRuangan.options[6].disabled = true;
//         elemenSelectRuangan.options[10].disabled = true;
//         elemenSelectRuangan.options[11].disabled = true;
//     }
// })