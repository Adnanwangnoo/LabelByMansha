/* ==========================================================================
   LABEL BY MANSHA — CLIENT-SIDE GALLERY, FILTERING & SEARCH CONTROLS
   ========================================================================== */

const SUPABASE_URL = "https://aogdavvqqujqxqydempu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aOHNT2OAE6wSngMP_nVvrQ_SUnybrhf";

// Initialize Supabase Client
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Store all fetched gallery files in memory for instant category switching
let allGalleryFiles = [];

/* --- 1. WHATSAPP CARD TEMPLATE --- */
function galleryCardTemplate(imageUrl, index) {
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

/* --- 2. FETCH PHOTOS FROM SUPABASE --- */
async function loadSupabaseGallery() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft); padding: 40px 0;">Loading collection gallery…</p>';

  if (!supabaseClient) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--rose);">Configuration error. Supabase library not loaded.</p>';
    return;
  }

  try {
    const { data: files, error } = await supabaseClient
      .storage
      .from('gallery')
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;

    allGalleryFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder');

    if (!allGalleryFiles || allGalleryFiles.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--plum-soft); padding: 40px 0;">No photos uploaded yet — check back soon!</p>';
      return;
    }

    // Determine initial category to display (from URL Hash or Search Query)
    const initialCategory = getInitialCategory();
    filterGallery(initialCategory);

  } catch (err) {
    console.error('Gallery loading error:', err);
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--rose); padding: 40px 0;">Couldn\'t load the collection right now. Please refresh.</p>';
  } finally {
    grid.removeAttribute('aria-busy');
  }
}

/* --- 3. CATEGORY FILTERING LOGIC --- */
function filterGallery(selectedCategory) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  // Update button active styling on UI tabs
  document.querySelectorAll('.tab-btn, .cat-btn').forEach(btn => {
    btn.classList.remove('active');
    const btnText = btn.textContent.toLowerCase();
    const btnOnClick = btn.getAttribute('onclick') || '';
    
    if (btnOnClick.includes(selectedCategory) || (selectedCategory === 'all' && btnText.includes('all'))) {
      btn.classList.add('active');
    }
  });

  // Filter photos based on category tag in file name
  const filteredFiles = allGalleryFiles.filter(file => {
    if (selectedCategory === 'all') return true;

    if (file.name.includes('___')) {
      const fileCat = file.name.split('___')[0];
      return fileCat === selectedCategory;
    } else {
      // SMART TRICK: If an existing photo has no category prefix, treat it as 'kashmiri-tilla'
      return selectedCategory === 'kashmiri-tilla';
    }
  });

  if (filteredFiles.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: #888; padding: 60px 0; font-family: 'Georgia', serif; font-size: 1.1rem;">No lookbook designs in this edit yet. More pieces coming soon!</p>`;
    return;
  }

  // Render filtered cards
  const cardsHtml = filteredFiles.map((file, idx) => {
    const { data } = supabaseClient
      .storage
      .from('gallery')
      .getPublicUrl(file.name);
    return galleryCardTemplate(data.publicUrl, idx);
  }).join('');

  grid.innerHTML = cardsHtml;
}

// Global helper for inline button clicks (e.g. onclick="filterCategory('wedding', this)")
window.filterCategory = function(category, element) {
  if (element) {
    document.querySelectorAll('.tab-btn, .cat-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }
  
  if (category === 'all') {
    window.history.pushState("", document.title, window.location.pathname);
  } else {
    window.location.hash = '#' + category;
  }
  
  filterGallery(category);
};

/* --- 4. CHECK URL ON LOAD (FOR HOMEPAGE CLICKS & SEARCH BAR) --- */
function getInitialCategory() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');

  // Handle search bar inputs
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    if (query.includes('tilla')) return 'kashmiri-tilla';
    if (query.includes('wedding') || query.includes('bridal') || query.includes('lehenga') || query.includes('pashmina')) return 'wedding';
    if (query.includes('dabka')) return 'dabka-work';
    if (query.includes('best') || query.includes('selling') || query.includes('loved')) return 'bestselling';
  }

  // Handle URL hash from homepage category clicks (e.g., collections.html#wedding)
  const hash = window.location.hash.replace('#', '').trim();
  if (['bestselling', 'wedding', 'kashmiri-tilla', 'dabka-work'].includes(hash)) {
    return hash;
  }

  return 'all';
}

/* --- 5. LUXURY SEARCH OVERLAY CONTROLS --- */
function openSearch() {
  const overlay = document.getElementById('search-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }, 100);
  }
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.style.display = 'none';
}

function selectKeyword(keyword) {
  const input = document.getElementById('search-input');
  if (input) {
    input.value = keyword;
    executeSearch();
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    executeSearch();
  }
}

function executeSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  const query = input.value.trim();
  if (!query) return;
  
  window.location.href = `collections.html?search=${encodeURIComponent(query)}`;
}

// Listen for hash changes if user uses browser Back/Forward buttons
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '').trim() || 'all';
  filterGallery(hash);
});

// Initialize Gallery when DOM is ready
window.addEventListener('DOMContentLoaded', loadSupabaseGallery);