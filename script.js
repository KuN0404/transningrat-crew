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

// Inisialisasi field2 uang dengan event format
function setupRupiahInput(id) {
  const input = document.getElementById(id);
  if (!input) return; // guard

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

// Untuk field biaya lainnya yang akan ditambahkan secara dinamis
function setupDynamicRupiahInput(el) {
  el.addEventListener('input', () => {
    const raw = el.value.replace(/\D/g, '');
    el.value = formatRupiah(raw);
    updateTotals();
  });
  el.addEventListener('keypress', (e) => {
    if (!/[0-9]/.test(String.fromCharCode(e.which))) {
      e.preventDefault();
    }
  });
}

// Daftar input uang bawaan (tidak termasuk biaya_lainnya)
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

// Fungsi untuk menambah baris "Biaya Lainnya"
const biayaLainnyaContainer = document.getElementById('biayaLainnyaContainer');
const addBiayaLainnyaBtn = document.getElementById('addBiayaLainnya');

function addBiayaLainnyaRow() {
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'g-3', 'mt-2', 'biaya-lainnya-row');

  const colNama = document.createElement('div');
  colNama.classList.add('col-md-5');
  const inputNama = document.createElement('input');
  inputNama.type = 'text';
  inputNama.classList.add('form-control');
  inputNama.name = 'biaya_lainnya_nama[]'; // ← DIBUAT ARRAY
  inputNama.placeholder = 'Nama Biaya';
  inputNama.required = true;
  colNama.appendChild(inputNama);

  const colNominal = document.createElement('div');
  colNominal.classList.add('col-md-5');
  const inputNominal = document.createElement('input');
  inputNominal.type = 'text';
  inputNominal.classList.add('form-control', 'biaya-lainnya-nominal');
  inputNominal.name = 'biaya_lainnya_biaya[]'; // ← DIBUAT ARRAY
  inputNominal.placeholder = 'Nominal Biaya';
  inputNominal.required = true;
  colNominal.appendChild(inputNominal);

  const colRemove = document.createElement('div');
  colRemove.classList.add('col-md-2', 'd-flex', 'align-items-center');
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.classList.add('btn', 'btn-danger');
  removeBtn.innerText = 'Hapus';
  removeBtn.addEventListener('click', () => {
    rowDiv.remove();
    updateTotals();
  });
  colRemove.appendChild(removeBtn);

  rowDiv.appendChild(colNama);
  rowDiv.appendChild(colNominal);
  rowDiv.appendChild(colRemove);

  biayaLainnyaContainer.appendChild(rowDiv);

  setupDynamicRupiahInput(inputNominal);
}

// Tombol tambah baris
addBiayaLainnyaBtn.addEventListener('click', addBiayaLainnyaRow);

// Fungsi untuk update total
function updateTotals() {
  // Helper getValue
  const getValue = (id) => {
    const el = document.getElementById(id);
    return el ? parseRupiah(el.value) : 0;
  };

  const uangJalan = getValue('uangJalan');
  const bbm = ['bbm1', 'bbm2', 'bbm3', 'bbm4', 'bbm5'].reduce((sum, id) => sum + getValue(id), 0);
  const tol = getValue('tol');
  const uangMakan = getValue('uangMakan');
  const uangCuci = getValue('uangCuci');

  // Hitung total dari biaya lainnya
  let totalBiayaLainnya = 0;
  const biayaLainnyaNominals = document.querySelectorAll('.biaya-lainnya-nominal');
  biayaLainnyaNominals.forEach((el) => {
    totalBiayaLainnya += parseRupiah(el.value);
  });

  const pengeluaran = bbm + tol + uangMakan + uangCuci + totalBiayaLainnya;
  const bersih = uangJalan - pengeluaran;

  // Set ke field readOnly
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

  // Format ulang semua input uang bawaan agar hanya berupa angka mentah
  // uangInputs.forEach((id) => {
  //   const el = document.getElementById(id);
  //   if (el) {
  //     el.value = parseRupiah(el.value);
  //   }
  // });

  // Format ulang semua input biaya_lainnya juga
  // document.querySelectorAll('.biaya-lainnya-nominal').forEach((el) => {
  //   el.value = parseRupiah(el.value);
  // });

  try {
    const formData = new FormData(form);

    const namaBiaya = [];
    const namaInputs = document.querySelectorAll('input[name="biaya_lainnya_nama[]"]');

    if (namaInputs.length === 0) {
      namaBiaya.push('-');
    } else {
      namaInputs.forEach((el) => {
        const val = el.value.trim();
        namaBiaya.push(val ? val : '-');
      });
    }

    const nominalBiaya = [];
    const nominalInputs = document.querySelectorAll('input[name="biaya_lainnya_biaya[]"]');

    if (nominalInputs.length === 0) {
      nominalBiaya.push('0');
    } else {
      nominalInputs.forEach((el) => {
        const val = el.value.trim();
        nominalBiaya.push(val ? val : '0');
      });
    }

    // Hapus field array lama
    formData.delete('biaya_lainnya_nama[]');
    formData.delete('biaya_lainnya_biaya[]');

    // Tambahkan sebagai string gabungan
    if (namaBiaya.length > 0) {
      formData.append('biaya_lainnya_nama', namaBiaya.join(' | '));
      formData.append('biaya_lainnya_biaya', nominalBiaya.join(' | '));
    }

    // Kirim formData ke Google Script
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

  // Re-enable submit button
  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = 'Kirim Form';
  }, 1000);
});

// Inisialisasi awal
updateTotals();
