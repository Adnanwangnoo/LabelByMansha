// Contact page — submits the form to the Express API instead of faking it.
(function () {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      topic: form.topic.value,
      message: form.message.value
    };

    success.style.display = 'none';
    success.className = 'form-success';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        success.textContent = data.error || 'Something went wrong — please check your details and try again.';
        success.className = 'form-success error';
        success.style.display = 'block';
        return;
      }

      success.textContent = data.message;
      success.className = 'form-success success';
      success.style.display = 'block';
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      success.textContent = 'Network error — please check your connection and try again.';
      success.className = 'form-success error';
      success.style.display = 'block';
      console.error(err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
    }
  });
})();
