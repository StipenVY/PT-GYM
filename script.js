(() => {
  const phoneWA = '+6285792177153';

  const $ = (sel) => document.querySelector(sel);
  const orderForm = $('#orderForm');
  const paket = $('#paket');
  const kategori = $('#kategori');
  const estimasi = $('#estimasi');
  const slot = $('#slot');

  const nama = $('#nama');
  const usia = $('#usia');
  const tinggi = $('#tinggi');
  const berat = $('#berat');
  const goal = $('#goal');

  const btnPreview = $('#btnPreview');
  const previewBox = $('#previewBox');
  const previewText = $('#previewText');

  const waTop = $('#waTop');
  const waFooter = $('#waFooter');

  const yearEl = $('#year');
  yearEl.textContent = new Date().getFullYear();

  const pricing = {
    // estimasi harga (contoh). Bisa diganti sesuai kebutuhan.
    '1_hari': { bulking: 50000, cutting: 50000, recomp: 65000, slot: 'Tersisa 8 slot' },
    '1_minggu': { bulking: 300000, cutting: 300000, recomp: 450000, slot: 'Tersisa 5 slot' },
    '1_bulan': { bulking: 900000, cutting: 900000, recomp: 1000000, slot: 'Tersisa 2 slot' },
  };

  const formatIDR = (n) => {
    try {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);
    } catch {
      return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  };

  function selectedHarga() {
    const p = paket.value;
    const k = kategori.value;
    const pack = pricing[p];
    if (!pack || !pack[k]) return { harga: null, slotText: '—' };
    return { harga: pack[k], slotText: pack.slot };
  }

  function updateEstimasi() {
    const { harga, slotText } = selectedHarga();
    estimasi.textContent = harga ? formatIDR(harga) : '—';
    slot.textContent = slotText;
  }

  function buildMessage() {
    const pLabel = paket.options[paket.selectedIndex].text;
    const kLabel = kategori.options[kategori.selectedIndex].text;

    const g = (goal.value || '').trim();

    return [
      'Halo PT Gym 👋',
      'Saya ingin pesan program:',
      `- Paket: ${pLabel}`,
      `- Kategori: ${kLabel}`,
      '',
      'Data diri:',
      `- Nama: ${nama.value || '-'}`,
      `- Usia: ${usia.value || '-'}`,
      `- Tinggi: ${tinggi.value || '-' } cm`,
      `- Berat: ${berat.value || '-' } kg`,
      '',
      `Catatan/Target: ${g || '-'}`,
      '',
      'Mohon konfirmasi & informasi pembayaran.'
    ].join('\n');
  }

  function toWaLink(message) {
    // WA: gunakan format nomor tanpa '+' dan tanpa spasi
    const text = encodeURIComponent(message);
    return `https://wa.me/${phoneWA}?text=${text}`;
  }

  function setWaLinks(message) {
    const link = toWaLink(message);
    waTop.href = link;
    waFooter.href = link;
  }

  function refreshPreviewAndLinks() {
    const msg = buildMessage();
    setWaLinks(msg);
    return msg;
  }

  paket.addEventListener('change', () => {
    updateEstimasi();
    previewBox.hidden = true;
    refreshPreviewAndLinks();
  });
  kategori.addEventListener('change', () => {
    updateEstimasi();
    previewBox.hidden = true;
    refreshPreviewAndLinks();
  });

  [nama, usia, tinggi, berat, goal].forEach((el) => {
    el.addEventListener('input', () => {
      // saat typing, jangan munculkan preview otomatis
      refreshPreviewAndLinks();
    });
  });

  updateEstimasi();
  refreshPreviewAndLinks();

  btnPreview.addEventListener('click', () => {
    // Validasi basic
    const requiredEls = [nama, usia, tinggi, berat];
    for (const el of requiredEls) {
      if (!el.value.trim()) {
        alert('Tolong lengkapi field yang wajib: ' + el.previousElementSibling.textContent);
        el.focus();
        return;
      }
    }

    const msg = buildMessage();
    previewText.textContent = msg;
    previewBox.hidden = false;
    previewBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Validasi
    const requiredEls = [nama, usia, tinggi, berat];
    for (const el of requiredEls) {
      if (!el.value.trim()) {
        alert('Lengkapi data terlebih dahulu.' );
        el.focus();
        return;
      }
    }

    const msg = refreshPreviewAndLinks();
    const link = toWaLink(msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  });
})();

