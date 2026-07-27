/* ==========================================================================
   LABEL BY MANSHA — ADMIN PORTAL INVENTORY & GALLERY MANAGEMENT
   ========================================================================== */

const SUPABASE_URL = "https://aogdavvqqujqxqydempu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aOHNT2OAE6wSngMP_nVvrQ_SUnybrhf";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

let isEditMode = false;
let currentEditId = null;

// ==========================================
// 1. CLIENT LOGIN
// ==========================================
async function handleLogin() {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const errorElement = document.getElementById('login-error');

  errorElement.textContent = '';

  if (!email || !password) {
    errorElement.textContent = 'Please enter both email and password.';
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    errorElement.textContent = 'Login failed: ' + error.message;
  } else {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    loadAdminGallery();
  }
}

// ==========================================
// 2. LOAD ACTIVE INVENTORY GRID
// ==========================================
async function loadAdminGallery() {
  const grid = document.getElementById('admin-grid');
  grid.innerHTML = '<p style="grid-column: 1/-1; color: #666;">Loading catalog from database...</p>';

  const { data: products, error } = await supabaseClient
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    grid.innerHTML = '<p style="color: red;">Error fetching products: ' + error.message + '</p>';
    return;
  }

  if (!products || products.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; color: #888;">No products currently in inventory.</p>';
    return;
  }

  grid.innerHTML = '';
  products.forEach(item => {
    const thumb = item.images && item.images.length > 0 ? item.images[0] : 'images/logo.png';

    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
      <img src="${thumb}" alt="${item.name}">
      <div class="card-details" style="padding: 12px; text-align: left;">
        <h4 style="margin: 0 0 4px 0; font-size: 1rem; color: #222;">${item.name}</h4>
        <p style="margin: 0; font-size: 0.85rem; color: #666;">${item.category || 'Collection'}</p>
        <p style="margin: 6px 0 0 0; font-weight: bold; color: #28a745;">₹${Number(item.price).toLocaleString()}</p>
      </div>
      <div class="action-row" style="display: flex; border-top: 1px solid #eee;">
        <button type="button" class="edit-btn" onclick='startEdit(${JSON.stringify(item)})' style="flex: 1; background: #007bff; color: white; border: none; padding: 10px; cursor: pointer; font-weight: bold;">Edit</button>
        <button type="button" class="delete-btn" onclick='deleteProduct("${item.id}", "${item.name}")' style="flex: 1; background: #d9534f; color: white; border: none; padding: 10px; cursor: pointer; font-weight: bold;">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==========================================
// 3. EDIT & RESET WORKFLOWS
// ==========================================
function startEdit(product) {
  isEditMode = true;
  currentEditId = product.id;

  document.getElementById('form-title').textContent = `Editing: ${product.name}`;
  document.getElementById('product-name').value = product.name;
  document.getElementById('category-select').value = product.category || 'kashmiri-tilla';
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-desc').value = product.description || '';

  // Make images optional so she doesn't need to re-upload crisp files just to change text/price
  const fileInput = document.getElementById('file-input');
  fileInput.required = false;
  const fileLabel = document.getElementById('file-label');
  if (fileLabel) fileLabel.textContent = 'Product Photos (Leave blank to keep existing photos)';

  const submitBtn = document.getElementById('upload-btn');
  submitBtn.textContent = 'Save Changes';
  submitBtn.style.backgroundColor = '#007bff';
  
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'block';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  const form = document.getElementById('product-form');
  if (form) form.reset();
  
  isEditMode = false;
  currentEditId = null;
  
  document.getElementById('form-title').textContent = 'Upload New Product';
  document.getElementById('file-input').required = true;
  
  const fileLabel = document.getElementById('file-label');
  if (fileLabel) fileLabel.textContent = 'Product Photos (Select multiple uncompressed photos)';
  
  const submitBtn = document.getElementById('upload-btn');
  submitBtn.textContent = 'Upload Product';
  submitBtn.style.backgroundColor = '';
  
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.style.display = 'none';
}

// ==========================================
// 4. DELETE PRODUCT
// ==========================================
async function deleteProduct(id, name) {
  if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

  const { error } = await supabaseClient
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Delete failed: ' + error.message);
  } else {
    alert('Product deleted successfully.');
    loadAdminGallery();
  }
}

// ==========================================
// 5. HANDLE PRODUCT SUBMIT (CREATE OR UPDATE)
// ==========================================
async function handleProductSubmit(e) {
  if (e) e.preventDefault();

  const submitBtn = document.getElementById('upload-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const statusText = document.getElementById('status-text');

  submitBtn.disabled = true;

  try {
    if (isEditMode) {
      // --- EDIT MODE: UPDATE METADATA ONLY ---
      if (statusText) statusText.textContent = 'Saving updated details...';
      if (progressContainer) progressContainer.style.display = 'block';

      const { error } = await supabaseClient
        .from('products')
        .update({
          name: document.getElementById('product-name').value,
          category: document.getElementById('category-select').value,
          price: Number(document.getElementById('product-price').value),
          description: document.getElementById('product-desc').value
        })
        .eq('id', currentEditId);

      if (error) throw error;

      alert('Product updated successfully!');
      resetForm();
      loadAdminGallery();

    } else {
      // --- CREATE MODE: UPLOAD MULTIPLE UNCOMPRESSED PHOTOS ---
      const fileInput = document.getElementById('file-input');
      const files = fileInput ? fileInput.files : [];

      if (!files || files.length === 0) {
        alert('Please select at least one image file.');
        submitBtn.disabled = false;
        return;
      }

      if (progressContainer) progressContainer.style.display = 'block';
      const uploadedUrls = [];
      const totalFiles = files.length;
      const category = document.getElementById('category-select').value || 'kashmiri-tilla';

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        if (statusText) statusText.textContent = `Uploading crisp photo ${i + 1} of ${totalFiles}...`;

        const fileExt = file.name.split('.').pop();
        const uniqueName = `${category}___${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        // Upload raw uncompressed photo directly to gallery bucket
        const { error: uploadError } = await supabaseClient
          .storage
          .from('gallery')
          .upload(uniqueName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseClient
          .storage
          .from('gallery')
          .getPublicUrl(uniqueName);

        uploadedUrls.push(publicUrlData.publicUrl);

        if (progressFill) {
          const percentage = Math.round(((i + 1) / totalFiles) * 100);
          progressFill.style.width = `${percentage}%`;
        }
      }

      if (statusText) statusText.textContent = 'Photos uploaded! Saving product details...';

      const { error: dbError } = await supabaseClient
        .from('products')
        .insert([{
          name: document.getElementById('product-name').value,
          category: category,
          price: Number(document.getElementById('product-price').value),
          description: document.getElementById('product-desc').value,
          images: uploadedUrls
        }]);

      if (dbError) throw dbError;

      alert('New product uploaded successfully with crisp quality!');
      resetForm();
      loadAdminGallery();
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('An error occurred: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    if (progressContainer) progressContainer.style.display = 'none';
    if (progressFill) progressFill.style.width = '0%';
  }
}