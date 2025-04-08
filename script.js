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
