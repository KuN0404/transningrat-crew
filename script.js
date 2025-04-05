const form = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const confirm = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data akan dikirim!",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, kirim",
    cancelButtonText: "Batal",
  });

  if (!confirm.isConfirmed) return;

  submitButton.disabled = true;
  submitButton.textContent = "Mengirim...";

  const formData = new FormData(form);
  const data = new URLSearchParams(formData);

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwgTEAQk8W_6HBJRqniBa-4RnuOg1D84ZHMG_kpRinsEAqKrrta1Cmm4_BNOWYgJhyNtQ/exec",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();

    if (result.result === "success") {
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "✅ Data berhasil dikirim.",
        confirmButtonText: "OK",
      });
      form.reset();
      updateTotals();
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Terjadi Kesalahan",
      text: "❌ Tidak dapat mengirim data. Silakan coba lagi.",
      confirmButtonText: "OK",
    });
    console.error(error);
  }

  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }, 3000);
});

// Format angka ke dalam Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
}

function parseRupiah(rp) {
  return parseInt(rp.replace(/[^0-9]/g, "")) || 0;
}

function setupRupiahInput(id) {
  const input = document.getElementById(id);
  input.addEventListener("input", function () {
    const raw = input.value.replace(/[^0-9]/g, "");
    input.value = formatRupiah(raw);
    updateTotals();
  });

  input.addEventListener("keypress", function (e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) {
      e.preventDefault();
    }
  });
}

const uangInputs = [
  "uangJalan",
  "bbm1",
  "bbm2",
  "bbm3",
  "bbm4",
  "bbm5",
  "tol",
  "uangMakan",
  "uangCuci",
];
uangInputs.forEach(setupRupiahInput);

// Field readonly yang masih bisa dikirim
const totalPemasukan = document.getElementById("totalPemasukan");
const totalPengeluaran = document.getElementById("totalPengeluaran");
const totalBersih = document.getElementById("totalBersih");

[totalPemasukan, totalPengeluaran, totalBersih].forEach((el) => {
  el.readOnly = true;
  el.style.backgroundColor = "#e9ecef";
  el.style.cursor = "not-allowed";
});

function updateTotals() {
  const uangJalan = parseRupiah(document.getElementById("uangJalan").value);
  const bbm1 = parseRupiah(document.getElementById("bbm1").value);
  const bbm2 = parseRupiah(document.getElementById("bbm2").value);
  const bbm3 = parseRupiah(document.getElementById("bbm3").value);
  const bbm4 = parseRupiah(document.getElementById("bbm4").value);
  const bbm5 = parseRupiah(document.getElementById("bbm5").value);
  const tol = parseRupiah(document.getElementById("tol").value);
  const uangMakan = parseRupiah(document.getElementById("uangMakan").value);
  const uangCuci = parseRupiah(document.getElementById("uangCuci").value);

  const pengeluaran =
    bbm1 + bbm2 + bbm3 + bbm4 + bbm5 + tol + uangMakan + uangCuci;
  const bersih = uangJalan - pengeluaran;

  totalPemasukan.value = formatRupiah(uangJalan);
  totalPengeluaran.value = formatRupiah(pengeluaran);
  totalBersih.value = formatRupiah(bersih);
}

// Panggil saat awal
updateTotals();
