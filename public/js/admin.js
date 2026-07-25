const SUPABASE_URL = "https://aogdavvqqujqxqydempu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aOHNT2OAE6wSngMP_nVvrQ_SUnybrhf";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function handleLogin() {
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const errorElement = document.getElementById('login-error');

  errorElement.textContent = '';

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    errorElement.textContent = 'Login failed: ' + error.message;
  } else {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    loadAdminGallery();
  }
}

async function handleUpload() {
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const statusElement = document.getElementById('upload-status');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select an image file first.');
    return;
  }

  uploadBtn.disabled = true;
  statusElement.style.color = '#666';
  statusElement.textContent = 'Uploading...';

  const fileExt = file.name.split('.').pop();
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const { error } = await supabaseClient
    .storage
    .from('gallery')
    .upload(uniqueName, file);

  uploadBtn.disabled = false;

  if (error) {
    statusElement.style.color = 'red';
    statusElement.textContent = 'Upload failed: ' + error.message;
  } else {
    statusElement.style.color = 'green';
    statusElement.textContent = 'Photo uploaded successfully!';
    fileInput.value = '';
    loadAdminGallery();
  }
}

async function handleDelete(fileName) {
  if (!confirm('Are you sure you want to remove this photo from the website?')) return;

  const { error } = await supabaseClient
    .storage
    .from('gallery')
    .remove([fileName]);

  if (error) {
    alert('Delete failed: ' + error.message);
  } else {
    loadAdminGallery();
  }
}

async function loadAdminGallery() {
  const grid = document.getElementById('admin-grid');
  grid.innerHTML = '<p style="grid-column: 1/-1;">Loading active photos...</p>';

  const { data: files, error } = await supabaseClient
    .storage
    .from('gallery')
    .list('', { sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    grid.innerHTML = '<p style="color: red;">Error fetching photos.</p>';
    return;
  }

  const validFiles = files.filter(f => f.name !== '.emptyFolderPlaceholder');

  if (validFiles.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; color: #888;">No photos currently in the gallery bucket.</p>';
    return;
  }

  grid.innerHTML = '';
  validFiles.forEach(file => {
    const { data } = supabaseClient.storage.from('gallery').getPublicUrl(file.name);

    const div = document.createElement('div');
    div.className = 'admin-card';
    div.innerHTML = `
      <img src="${data.publicUrl}" alt="Gallery upload">
      <button class="delete-btn" onclick="handleDelete('${file.name}')">Delete 🗑️</button>
    `;
    grid.appendChild(div);
  });
}