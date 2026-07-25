// // // Collections page — pulls products from the Express API instead of
// // // hardcoding them into the HTML, and posts quick enquiries back to the API.
// // (function () {
// //   const API_BASE = "https://labelbymansha.onrender.com";
// //   const grid = document.getElementById('product-grid');
// //   const filterRow = document.querySelector('.filter-row');
// //   if (!grid) return; // not on the collections page

// //   const modal = document.getElementById('enquire-modal');
// //   const modalForm = document.getElementById('enquire-form');
// //   const modalProductName = document.getElementById('enquire-product-name');
// //   const modalProductId = document.getElementById('enquire-product-id');
// //   const modalStatus = document.getElementById('enquire-status');

// //   let currentFilter = 'all';

// //   function money(amount) {
// //     return '₹' + Number(amount).toLocaleString('en-IN');
// //   }

// //   function cardTemplate(p) {
// //     const [from, to] = p.gradient || ['#EE7B4D', '#D6357E'];
// //     const badge = p.badge ? `<span class="badge">${p.badge}</span>` : '';
// //     const productImage = p.image ? `<img src="${p.image}" alt="${p.name}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">` : '';
// //     return `
// //       <div class="product-card" data-cat="${p.category}">
// //         <div class="product-media" style="--card-bg: linear-gradient(160deg, ${from}, ${to});">
// //           ${productImage}
// //           <img class="pattern" src="images/floral-pattern.svg" alt="" style="position: relative; z-index: 1;">
// //           ${badge}
// //           <span class="monogram" style="position: relative; z-index: 1;">M</span>
// //         </div>
// //         <div class="product-info">
// //           <span class="cat">${p.categoryLabel}</span>
// //           <h3>${p.name}</h3>
// //           <p class="fabric">${p.fabric}</p>
// //           <div class="price-row">
// //             <span class="price">${money(p.price)}</span>
// //             <button type="button" class="enquire" data-id="${p.id}" data-name="${p.name}">Enquire →</button>
// //           </div>
// //         </div>
// //       </div>
// //     `;
// //   }

// //   async function loadProducts(category) {
// //     grid.setAttribute('aria-busy', 'true');
// //     grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft);">Loading pieces…</p>';
// //     try {
// //       // const url = category && category !== 'all'
// //       //   ? `/api/products?category=${encodeURIComponent(category)}`
// //       //   : '/api/products';
// //       const API_BASE = "https://labelbymansha.onrender.com";

// // const url = category && category !== 'all'
// //   ? `${API_BASE}/api/products?category=${encodeURIComponent(category)}`
// //   : `${API_BASE}/api/products`;
// //       const res = await fetch(url);
// //       const data = await res.json();

// //       if (!data.products || !data.products.length) {
// //         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft);">Nothing in this edit yet — check back soon.</p>';
// //         return;
// //       }

// //       grid.innerHTML = data.products.map(cardTemplate).join('');
// //       attachEnquireHandlers();
// //     } catch (err) {
// //       grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--rose);">Couldn\'t load the collection right now. Please refresh.</p>';
// //       console.error(err);
// //     } finally {
// //       grid.removeAttribute('aria-busy');
// //     }
// //   }

// //   function attachEnquireHandlers() {
// //     grid.querySelectorAll('.enquire').forEach((btn) => {
// //       btn.addEventListener('click', () => openModal(btn.dataset.id, btn.dataset.name));
// //     });
// //   }

// //   function openModal(productId, productName) {
// //     if (!modal) return;
// //     modalProductName.textContent = productName;
// //     modalProductId.value = productId;
// //     modalForm.reset();
// //     modalProductId.value = productId; // reset() clears hidden fields too, restore it
// //     modalStatus.textContent = '';
// //     modalStatus.className = 'form-note';
// //     modal.classList.add('open');
// //     document.body.style.overflow = 'hidden';
// //     const firstField = modalForm.querySelector('input');
// //     if (firstField) firstField.focus();
// //   }

// //   function closeModal() {
// //     if (!modal) return;
// //     modal.classList.remove('open');
// //     document.body.style.overflow = '';
// //   }

// //   if (modal) {
// //     modal.addEventListener('click', (e) => {
// //       if (e.target.matches('[data-close-modal]')) closeModal();
// //     });
// //     document.addEventListener('keydown', (e) => {
// //       if (e.key === 'Escape') closeModal();
// //     });
// //   }

// //   if (modalForm) {
// //     modalForm.addEventListener('submit', async (e) => {
// //       e.preventDefault();
// //       const payload = {
// //         productId: modalProductId.value,
// //         productName: modalProductName.textContent,
// //         name: modalForm.querySelector('[name="name"]').value,
// //         phone: modalForm.querySelector('[name="phone"]').value
// //       };

// //       modalStatus.textContent = 'Sending…';
// //       modalStatus.className = 'form-note';

// //       try {
// //         // const res = await fetch('/api/enquire', {
// //         const res = await fetch('https://labelbymansha.onrender.com/api/enquire', {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(payload)
// //         });
// //         const data = await res.json();

// //         if (!res.ok) {
// //           modalStatus.textContent = data.error || 'Something went wrong. Please try again.';
// //           modalStatus.className = 'form-note error';
// //           return;
// //         }

// //         modalStatus.textContent = data.message;
// //         modalStatus.className = 'form-note success';
// //         modalForm.reset();
// //         setTimeout(closeModal, 1800);
// //       } catch (err) {
// //         modalStatus.textContent = 'Network error — please check your connection and try again.';
// //         modalStatus.className = 'form-note error';
// //         console.error(err);
// //       }
// //     });
// //   }

// //   if (filterRow) {
// //     filterRow.addEventListener('click', (e) => {
// //       const btn = e.target.closest('.filter-btn');
// //       if (!btn) return;
// //       filterRow.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
// //       btn.classList.add('active');
// //       currentFilter = btn.dataset.filter;
// //       loadProducts(currentFilter);
// //     });
// //   }

// //   // Honour a category in the URL hash on load, e.g. collections.html#kurtis
// //   const hash = window.location.hash.replace('#', '');
// //   if (hash && filterRow) {
// //     const target = filterRow.querySelector(`.filter-btn[data-filter="${hash}"]`);
// //     if (target) {
// //       target.classList.add('active');
// //       filterRow.querySelectorAll('.filter-btn').forEach((b) => { if (b !== target) b.classList.remove('active'); });
// //       currentFilter = hash;
// //     }
// //   }

// //   loadProducts(currentFilter);
// // })();
// // Collections page — pulls products from the Express API instead of
// // hardcoding them into the HTML, and posts quick enquiries back to the API.
// (function () {
//   const API_BASE = "https://labelbymansha.onrender.com";
//   const grid = document.getElementById('product-grid');
//   const filterRow = document.querySelector('.filter-row');
//   if (!grid) return; // not on the collections page

//   const modal = document.getElementById('enquire-modal');
//   const modalForm = document.getElementById('enquire-form');
//   const modalProductName = document.getElementById('enquire-product-name');
//   const modalProductId = document.getElementById('enquire-product-id');
//   const modalStatus = document.getElementById('enquire-status');

//   let currentFilter = 'all';

//   function money(amount) {
//     return '₹' + Number(amount).toLocaleString('en-IN');
//   }

//   function cardTemplate(p) {
//     const [from, to] = p.gradient || ['#EE7B4D', '#D6357E'];
//     const badge = p.badge ? `<span class="badge">${p.badge}</span>` : '';
//     const productImage = p.image ? `<img src="${p.image}" alt="${p.name}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">` : '';
//     return `
//       <div class="product-card" data-cat="${p.category}">
//         <div class="product-media" style="--card-bg: linear-gradient(160deg, ${from}, ${to});">
//           ${productImage}
//           <img class="pattern" src="images/floral-pattern.svg" alt="" style="position: relative; z-index: 1;">
//           ${badge}
//           <span class="monogram" style="position: relative; z-index: 1;">M</span>
//         </div>
//         <div class="product-info">
//           <span class="cat">${p.categoryLabel}</span>
//           <h3>${p.name}</h3>
//           <p class="fabric">${p.fabric}</p>
//           <div class="price-row">
//             <span class="price">${money(p.price)}</span>
//             <button type="button" class="enquire" data-id="${p.id}" data-name="${p.name}">Enquire →</button>
//           </div>
//         </div>
//       </div>
//     `;
//   }

//   async function loadProducts(category) {
//     grid.setAttribute('aria-busy', 'true');
//     grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft);">Loading pieces…</p>';
//     try {
//       const url = category && category !== 'all'
//         ? `${API_BASE}/api/products?category=${encodeURIComponent(category)}`
//         : `${API_BASE}/api/products`;
      
//       const res = await fetch(url);
//       const data = await res.json();

//       if (!data.products || !data.products.length) {
//         grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft);">Nothing in this edit yet — check back soon.</p>';
//         return;
//       }

//       grid.innerHTML = data.products.map(cardTemplate).join('');
//       attachEnquireHandlers();
//     } catch (err) {
//       grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--rose);">Couldn\'t load the collection right now. Please refresh.</p>';
//       console.error(err);
//     } finally {
//       grid.removeAttribute('aria-busy');
//     }
//   }

//   function attachEnquireHandlers() {
//     grid.querySelectorAll('.enquire').forEach((btn) => {
//       btn.addEventListener('click', () => openModal(btn.dataset.id, btn.dataset.name));
//     });
//   }

//   function openModal(productId, productName) {
//     if (!modal) return;
//     modalProductName.textContent = productName;
//     modalProductId.value = productId;
//     modalForm.reset();
//     modalProductId.value = productId; // reset() clears hidden fields too, restore it
//     modalStatus.textContent = '';
//     modalStatus.className = 'form-note';
//     modal.classList.add('open');
//     document.body.style.overflow = 'hidden';
//     const firstField = modalForm.querySelector('input');
//     if (firstField) firstField.focus();
//   }

//   function closeModal() {
//     if (!modal) return;
//     modal.classList.remove('open');
//     document.body.style.overflow = '';
//   }

//   if (modal) {
//     modal.addEventListener('click', (e) => {
//       if (e.target.matches('[data-close-modal]')) closeModal();
//     });
//     document.addEventListener('keydown', (e) => {
//       if (e.key === 'Escape') closeModal();
//     });
//   }

//   if (modalForm) {
//     modalForm.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       const payload = {
//         productId: modalProductId.value,
//         productName: modalProductName.textContent,
//         name: modalForm.querySelector('[name="name"]').value,
//         phone: modalForm.querySelector('[name="phone"]').value
//       };

//       modalStatus.textContent = 'Sending…';
//       modalStatus.className = 'form-note';

//       try {
//         const res = await fetch(`${API_BASE}/api/enquire`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         });
//         const data = await res.json();

//         if (!res.ok) {
//           modalStatus.textContent = data.error || 'Something went wrong. Please try again.';
//           modalStatus.className = 'form-note error';
//           return;
//         }

//         modalStatus.textContent = data.message;
//         modalStatus.className = 'form-note success';
//         modalForm.reset();
//         setTimeout(closeModal, 1800);
//       } catch (err) {
//         modalStatus.textContent = 'Network error — please check your connection and try again.';
//         modalStatus.className = 'form-note error';
//         console.error(err);
//       }
//     });
//   }

//   if (filterRow) {
//     filterRow.addEventListener('click', (e) => {
//       const btn = e.target.closest('.filter-btn');
//       if (!btn) return;
//       filterRow.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
//       btn.classList.add('active');
//       currentFilter = btn.dataset.filter;
//       loadProducts(currentFilter);
//     });
//   }

//   // Honour a category in the URL hash on load, e.g. collections.html#kurtis
//   const hash = window.location.hash.replace('#', '');
//   if (hash && filterRow) {
//     const target = filterRow.querySelector(`.filter-btn[data-filter="${hash}"]`);
//     if (target) {
//       target.classList.add('active');
//       filterRow.querySelectorAll('.filter-btn').forEach((b) => { if (b !== target) b.classList.remove('active'); });
//       currentFilter = hash;
//     }
//   }

//   loadProducts(currentFilter);
// })();
(function () {
  const SUPABASE_URL = "https://aogdavvqqujqxqydempu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aOHNT2OAE6wSngMP_nVvrQ_SUnybrhf";
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  // Initialize Supabase Client
  const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

 function galleryCardTemplate(imageUrl, index) {
    // Includes the direct image URL on a new line so WhatsApp builds a visual preview!
    const messageText = `Hi! I would like to inquire about this piece from your lookbook:\n\n${imageUrl}`;
    const waUrl = `https://wa.me/916005418597?text=${encodeURIComponent(messageText)}`;

    return `
      <a href="${waUrl}" target="_blank" rel="noopener" class="product-card" style="display: block; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-decoration: none; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;">
        <div class="product-media" style="position: relative; padding-top: 133%; background: #f7f5f2;">
          <img src="${imageUrl}" alt="Label by Mansha Lookbook Design" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;" loading="lazy">
        </div>
      </a>
    `;
  }

  async function loadSupabaseGallery() {
    grid.setAttribute('aria-busy', 'true');
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft); padding: 40px 0;">Loading collection gallery…</p>';

    if (!supabaseClient) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--rose);">Configuration error. Supabase library not loaded.</p>';
      return;
    }

    try {
      // Fetch files directly from the 'gallery' bucket
      const { data: files, error } = await supabaseClient
        .storage
        .from('gallery')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const validFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder');

      if (!validFiles || validFiles.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft); padding: 40px 0;">No photos uploaded yet — check back soon!</p>';
        return;
      }

      const cardsHtml = validFiles.map((file, idx) => {
        const { data } = supabaseClient
          .storage
          .from('gallery')
          .getPublicUrl(file.name);
        return galleryCardTemplate(data.publicUrl, idx);
      }).join('');

      grid.innerHTML = cardsHtml;
    } catch (err) {
      console.error('Gallery loading error:', err);
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--rose); padding: 40px 0;">Couldn\'t load the collection right now. Please refresh.</p>';
    } finally {
      grid.removeAttribute('aria-busy');
    }
  }

  loadSupabaseGallery();
})();