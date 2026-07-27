/* ==========================================================================
   LABEL BY MANSHA — CLIENT-SIDE GALLERY, FILTERING & BRANDED EDITORIAL CARDS
   ========================================================================== */

const SUPABASE_URL = "https://aogdavvqqujqxqydempu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aOHNT2OAE6wSngMP_nVvrQ_SUnybrhf";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Store all fetched products in memory for instant category switching & search
let allProducts = [];

/* --- 0. INJECT BRAND-MATCHED EDITORIAL CSS (OPTIMIZED FOR DARK THEME) --- */
function injectEditorialStyles() {
  if (document.getElementById('editorial-card-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'editorial-card-styles';
  style.innerHTML = `
    /* Clean Editorial Card Container */
    .editorial-card {
      background: transparent;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .editorial-card:hover {
      transform: translateY(-3px);
    }
    
    /* Media Container (4:5 Luxury Aspect Ratio) */
    .editorial-media {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 5;
      background: #1a1a1a;
      overflow: hidden;
      border-radius: 6px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    .editorial-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .editorial-card:hover .editorial-media img {
      transform: scale(1.03);
    }

    /* Swiper Override Styles */
    .swiper { width: 100%; height: 100%; }
    .swiper-button-next, .swiper-button-prev {
      color: #ffffff !important;
      transform: scale(0.65);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .editorial-media:hover .swiper-button-next,
    .editorial-media:hover .swiper-button-prev {
      opacity: 1;
    }
    .swiper-pagination-bullet {
      background: rgba(255, 255, 255, 0.8) !important;
      opacity: 1 !important;
      width: 5px !important;
      height: 5px !important;
      transition: all 0.3s ease !important;
    }
    .swiper-pagination-bullet-active {
      background: #df9b52 !important; /* Label by Mansha Sunset Gold */
      transform: scale(1.4);
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }

    /* Top-Right Heart Badge (Frosted Blush Glass) */
    .badge-heart {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(252, 248, 245, 0.88);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .badge-heart:hover { 
      transform: scale(1.1); 
      background: #ffffff; 
      box-shadow: 0 6px 14px rgba(223, 155, 82, 0.25);
    }
    .badge-heart svg { width: 18px; height: 18px; stroke: #2a2426; fill: none; transition: fill 0.2s, stroke 0.2s; }
    .badge-heart.active svg { fill: #cb436b; stroke: #cb436b; }

    /* Bottom-Right Plus Badge (Blooms into Brand Sunset Gradient on Hover) */
    .badge-plus {
      position: absolute;
      bottom: 14px;
      right: 14px;
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      background: rgba(252, 248, 245, 0.88);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      color: #2a2426;
      font-family: 'Georgia', serif;
      font-size: 1.4rem;
      line-height: 1;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .badge-plus:hover { 
      transform: scale(1.08) rotate(90deg); 
      background: linear-gradient(135deg, #df9b52 0%, #cb436b 100%); 
      color: #ffffff; 
      border-color: transparent;
      box-shadow: 0 6px 16px rgba(203, 67, 107, 0.35);
    }

    /* Centered Typography — TITLE -> DESC -> PRICE HIERARCHY */
    .editorial-details {
      padding: 16px 8px 12px 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .editorial-title {
      font-family: 'Cormorant Garamond', 'Georgia', serif;
      font-size: 1.15rem;
      font-weight: 600;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #ffffff !important; /* Crisp White for Dark Backgrounds */
      margin: 0;
      line-height: 1.3;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    .editorial-desc {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 0.85rem;
      color: #cccccc !important; /* Soft Readable Cream/Grey */
      margin: 2px 0 4px 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Limits description to 2 lines for symmetry */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .editorial-price {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 0.95rem;
      color: #df9b52 !important; /* Brand Sunset Gold */
      font-weight: 600;
      margin: 2px 0 0 0;
      letter-spacing: 0.5px;
    }
  `;
  document.head.appendChild(style);
}

/* --- 1. PRODUCT CARD TEMPLATE (UPDATED ORDER: TITLE -> DESC -> PRICE) --- */
function productCardTemplate(product) {
  // Format price with decimals (e.g., ₹34,000.00)
  const formattedPrice = Number(product.price).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const waText = `Hi Label by Mansha! I would like to inquire about this piece from your lookbook:\n\n*${product.name}* (₹${formattedPrice})\n\nReference: ${product.images && product.images.length > 0 ? product.images[0] : ''}`;
  const waUrl = `https://wa.me/916005418597?text=${encodeURIComponent(waText)}`;

  let mediaSectionHtml = '';

  // CONDITIONAL SLIDER: Check if product has multiple photos
  if (product.images && product.images.length > 1) {
    let slidesHtml = '';
    product.images.forEach(imgUrl => {
      slidesHtml += `
        <div class="swiper-slide">
          <img src="${imgUrl}" alt="${product.name}" loading="lazy" decoding="async">
        </div>`;
    });

    mediaSectionHtml = `
      <div class="swiper mySwiper-${product.id}">
        <div class="swiper-wrapper">${slidesHtml}</div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>`;
  } else {
    // Single Photo fallback
    const thumb = product.images && product.images.length > 0 ? product.images[0] : 'images/logo.png';
    mediaSectionHtml = `<img src="${thumb}" alt="${product.name}" loading="lazy" decoding="async">`;
  }

  // Display description conditionally if it exists in the database
  const descriptionHtml = product.description 
    ? `<p class="editorial-desc" title="${product.description}">${product.description}</p>` 
    : '';

  return `
    <div class="editorial-card">
      <div class="editorial-media">
        ${mediaSectionHtml}
        
        <!-- Top Right Wishlist Heart -->
        <button type="button" class="badge-heart" onclick="toggleHeart(this)" aria-label="Save to Wishlist" title="Save to Wishlist">
          <svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <!-- Bottom Right Plus Button (Blooms to Brand Gradient & Opens WhatsApp) -->
        <a href="${waUrl}" target="_blank" rel="noopener" class="badge-plus" aria-label="Quick Inquire on WhatsApp" title="Quick Inquire on WhatsApp">+</a>
      </div>

      <!-- UPDATED ORDER: Title -> Sub-Description -> Price -->
      <div class="editorial-details">
        <h3 class="editorial-title">${product.name}</h3>
        ${descriptionHtml}
        <div class="editorial-price">₹${formattedPrice}</div>
      </div>
    </div>
  `;
}

// Helper: Toggle Heart Color on Click
window.toggleHeart = function(btn) {
  btn.classList.toggle('active');
};

/* --- 2. FETCH PRODUCTS FROM SUPABASE DATABASE --- */
async function loadSupabaseGallery() {
  injectEditorialStyles(); // Inject custom brand styles
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #cccccc; font-family: \'Georgia\', serif; padding: 40px 0;">Loading lookbook…</p>';

  if (!supabaseClient) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #cb436b;">Configuration error. Supabase library not loaded.</p>';
    return;
  }

  try {
    const { data: products, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allProducts = products || [];

    if (allProducts.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #cccccc; font-family: \'Georgia\', serif; padding: 40px 0;">No products uploaded yet — check back soon!</p>';
      return;
    }

    const initialCategory = getInitialCategory();
    filterGallery(initialCategory);

  } catch (err) {
    console.error('Gallery loading error:', err);
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: #cb436b; padding: 40px 0;">Couldn\'t load the collection right now. Please refresh.</p>';
  } finally {
    grid.removeAttribute('aria-busy');
  }
}

/* --- 3. CATEGORY FILTERING LOGIC --- */
function filterGallery(selectedCategory) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  document.querySelectorAll('.tab-btn, .cat-btn').forEach(btn => {
    btn.classList.remove('active');
    const btnText = btn.textContent.toLowerCase();
    const btnOnClick = btn.getAttribute('onclick') || '';
    
    if (btnOnClick.includes(selectedCategory) || (selectedCategory === 'all' && btnText.includes('all'))) {
      btn.classList.add('active');
    }
  });

  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  if (filteredProducts.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: #cccccc; padding: 60px 0; font-family: 'Cormorant Garamond', 'Georgia', serif; font-size: 1.2rem;">No lookbook designs in this edit yet. More pieces coming soon!</p>`;
    return;
  }

  grid.innerHTML = filteredProducts.map(product => productCardTemplate(product)).join('');

  // INITIALIZE SWIPER CAROUSELS
  filteredProducts.forEach(product => {
    if (product.images && product.images.length > 1 && window.Swiper) {
      new Swiper(`.mySwiper-${product.id}`, {
        pagination: { 
          el: '.swiper-pagination', 
          clickable: true,
          dynamicBullets: true 
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        grabCursor: true,
        nested: true
      });
    }
  });
}

// Global helper for inline button clicks
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

/* --- 4. CHECK URL ON LOAD --- */
function getInitialCategory() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    if (query.includes('tilla')) return 'kashmiri-tilla';
    if (query.includes('wedding') || query.includes('bridal') || query.includes('lehenga') || query.includes('pashmina')) return 'wedding';
    if (query.includes('dabka')) return 'dabka-work';
    if (query.includes('best') || query.includes('selling') || query.includes('loved')) return 'bestselling';
  }

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
  const query = input.value.trim().toLowerCase();
  if (!query) return;
  
  closeSearch();

  if (window.location.pathname.includes('collections') || window.location.pathname.endsWith('/')) {
    const matchedProducts = allProducts.filter(p => 
      (p.name && p.name.toLowerCase().includes(query)) || 
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query))
    );

    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (matchedProducts.length === 0) {
      grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: #cccccc; padding: 60px 0; font-family: 'Cormorant Garamond', 'Georgia', serif; font-size: 1.2rem;">No designs matched your search for "${query}".</p>`;
      return;
    }

    grid.innerHTML = matchedProducts.map(product => productCardTemplate(product)).join('');

    matchedProducts.forEach(product => {
      if (product.images && product.images.length > 1 && window.Swiper) {
        new Swiper(`.mySwiper-${product.id}`, {
          pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
          grabCursor: true,
          nested: true
        });
      }
    });
  } else {
    window.location.href = `collections.html?search=${encodeURIComponent(query)}`;
  }
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '').trim() || 'all';
  filterGallery(hash);
});

window.addEventListener('DOMContentLoaded', loadSupabaseGallery);