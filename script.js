// const form = document.getElementById('contactForm');
// const submitButton = document.getElementById('submitButton');

// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const confirm = await Swal.fire({
//     title: 'Apakah Anda yakin?',
//     text: 'Data akan dikirim!',
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonText: 'Ya, kirim',
//     cancelButtonText: 'Batal',
//   });

//   if (!confirm.isConfirmed) return;

//   submitButton.disabled = true;
//   submitButton.textContent = 'Mengirim...';

//   const formData = new FormData(form);
//   const data = new URLSearchParams(formData);

//   try {
//     const response = await fetch('https://script.google.com/macros/s/AKfycbwgTEAQk8W_6HBJRqniBa-4RnuOg1D84ZHMG_kpRinsEAqKrrta1Cmm4_BNOWYgJhyNtQ/exec', {
//       method: 'POST',
//       body: data,
//     });

//     const result = await response.json();

//     if (result.result === 'success') {
//       await Swal.fire({
//         icon: 'success',
//         title: 'Berhasil!',
//         text: '✅ Data berhasil dikirim.',
//         confirmButtonText: 'OK',
//       });
//       form.reset();
//       updateTotals();
//     } else {
//       throw new Error(result.error);
//     }
//   } catch (error) {
//     await Swal.fire({
//       icon: 'error',
//       title: 'Terjadi Kesalahan',
//       text: '❌ Tidak dapat mengirim data. Silakan coba lagi.',
//       confirmButtonText: 'OK',
//     });
//     console.error(error);
//   }

//   setTimeout(() => {
//     submitButton.disabled = false;
//     submitButton.textContent = 'Submit';
//   }, 3000);
// });

// // Format angka ke dalam Rupiah
// function formatRupiah(angka) {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//   }).format(angka || 0);
// }

// function parseRupiah(rp) {
//   return parseInt(rp.replace(/[^0-9]/g, '')) || 0;
// }

// function setupRupiahInput(id) {
//   const input = document.getElementById(id);
//   input.addEventListener('input', function () {
//     const raw = input.value.replace(/[^0-9]/g, '');
//     input.value = formatRupiah(raw);
//     updateTotals();
//   });

//   input.addEventListener('keypress', function (e) {
//     const char = String.fromCharCode(e.which);
//     if (!/[0-9]/.test(char)) {
//       e.preventDefault();
//     }
//   });
// }

// const uangInputs = ['uangJalan', 'bbm1', 'bbm2', 'bbm3', 'bbm4', 'bbm5', 'tol', 'uangMakan', 'uangCuci'];
// uangInputs.forEach(setupRupiahInput);

// // Field readonly yang masih bisa dikirim
// const totalPemasukan = document.getElementById('uangJalan');
// const totalBbm = document.getElementById('totalBbm');
// const totalPengeluaran = document.getElementById('totalPengeluaran');
// const totalBersih = document.getElementById('totalBersih');

// [totalBbm, totalPengeluaran, totalBersih].forEach((el) => {
//   el.readOnly = true;
//   el.style.backgroundColor = '#e9ecef';
//   el.style.cursor = 'not-allowed';
// });

// function updateTotals() {
//   const uangJalan = parseRupiah(document.getElementById('uangJalan').value);
//   const bbm1 = parseRupiah(document.getElementById('bbm1').value);
//   const bbm2 = parseRupiah(document.getElementById('bbm2').value);
//   const bbm3 = parseRupiah(document.getElementById('bbm3').value);
//   const bbm4 = parseRupiah(document.getElementById('bbm4').value);
//   const bbm5 = parseRupiah(document.getElementById('bbm5').value);
//   const tol = parseRupiah(document.getElementById('tol').value);
//   const uangMakan = parseRupiah(document.getElementById('uangMakan').value);
//   const uangCuci = parseRupiah(document.getElementById('uangCuci').value);

//   const totalBBM = bbm1 + bbm2 + bbm3 + bbm4 + bbm5;
//   const pengeluaran = bbm1 + bbm2 + bbm3 + bbm4 + bbm5 + tol + uangMakan + uangCuci;
//   const bersih = uangJalan - pengeluaran;

//   // totalPemasukan.value = formatRupiah(uangJalan);
//   totalBbm.value = formatRupiah(totalBBM);
//   totalPengeluaran.value = formatRupiah(pengeluaran);
//   totalBersih.value = formatRupiah(bersih);
// }

// // Panggil saat awal
// updateTotals();

const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');

// Format angka ke format "1.000.000"
function formatRupiah(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Hapus titik dan parsing ke integer
function parseRupiah(rp) {
  return parseInt(rp.replace(/\./g, '')) || 0;
}

function setupRupiahInput(id) {
  const input = document.getElementById(id);

  input.addEventListener('input', () => {
    const raw = input.value.replace(/\D/g, '');
    input.value = formatRupiah(raw);
    updateTotals();
  });

  input.addEventListener('keypress', (e) => {
    if (!/[0-9]/.test(String.fromCharCode(e.which))) {
      e.preventDefault();
    }
  });
}

// Input uang
const uangInputs = ['uangJalan', 'bbm1', 'bbm2', 'bbm3', 'bbm4', 'bbm5', 'tol', 'uangMakan', 'uangCuci'];
uangInputs.forEach(setupRupiahInput);

// Field readonly untuk hasil
const totalBbm = document.getElementById('totalBbm');
const totalPengeluaran = document.getElementById('totalPengeluaran');
const sisa = document.getElementById('jml_sisa');

[totalBbm, totalPengeluaran, sisa].forEach((el) => {
  el.readOnly = true;
  el.style.backgroundColor = '#e9ecef';
  el.style.cursor = 'not-allowed';
});

function updateTotals() {
  const getValue = (id) => parseRupiah(document.getElementById(id).value);

  const uangJalan = getValue('uangJalan');
  const bbm = ['bbm1', 'bbm2', 'bbm3', 'bbm4', 'bbm5'].reduce((sum, id) => sum + getValue(id), 0);
  const tol = getValue('tol');
  const uangMakan = getValue('uangMakan');
  const uangCuci = getValue('uangCuci');

  const pengeluaran = bbm + tol + uangMakan + uangCuci;
  const bersih = uangJalan - pengeluaran;

  totalBbm.value = formatRupiah(bbm);
  totalPengeluaran.value = formatRupiah(pengeluaran);
  sisa.value = formatRupiah(bersih);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const confirm = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Data akan dikirim!',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, kirim',
    cancelButtonText: 'Batal',
  });

  if (!confirm.isConfirmed) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Mengirim...';

  // Format ulang semua input uang agar hanya berupa angka mentah
  uangInputs.forEach((id) => {
    const el = document.getElementById(id);
    el.value = parseRupiah(el.value);
  });

  try {
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    const response = await fetch('https://script.google.com/macros/s/AKfycbwgTEAQk8W_6HBJRqniBa-4RnuOg1D84ZHMG_kpRinsEAqKrrta1Cmm4_BNOWYgJhyNtQ/exec', {
      method: 'POST',
      body: data,
    });

    const result = await response.json();

    if (result.result === 'success') {
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: '✅ Data berhasil dikirim.',
        confirmButtonText: 'OK',
      });
      form.reset();
      updateTotals();
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(error);
    await Swal.fire({
      icon: 'error',
      title: 'Terjadi Kesalahan',
      text: '❌ Tidak dapat mengirim data. Silakan coba lagi.',
      confirmButtonText: 'OK',
    });
  }

  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit';
  }, 3000);
});

// Inisialisasi awal
updateTotals();
