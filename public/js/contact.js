// // Contact page — submits the form to the Express API instead of faking it.
// (function () {
//   const form = document.getElementById('contact-form');
//   const success = document.getElementById('form-success');
//   if (!form || !success) return;

//   const submitBtn = form.querySelector('button[type="submit"]');

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const payload = {
//       name: form.name.value,
//       phone: form.phone.value,
//       email: form.email.value,
//       topic: form.topic.value,
//       message: form.message.value
//     };

//     success.style.display = 'none';
//     success.className = 'form-success';
//     if (submitBtn) {
//       submitBtn.disabled = true;
//       submitBtn.textContent = 'Sending…';
//     }

//     try {
//       const res = await fetch('/api/contact', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         success.textContent = data.error || 'Something went wrong — please check your details and try again.';
//         success.className = 'form-success error';
//         success.style.display = 'block';
//         return;
//       }

//       success.textContent = data.message;
//       success.className = 'form-success success';
//       success.style.display = 'block';
//       form.reset();
//       success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//     } catch (err) {
//       success.textContent = 'Network error — please check your connection and try again.';
//       success.className = 'form-success error';
//       success.style.display = 'block';
//       console.error(err);
//     } finally {
//       if (submitBtn) {
//         submitBtn.disabled = false;
//         submitBtn.textContent = 'Send message';
//       }
//     }
//   });
// })();
// Contact page — formats form data and opens WhatsApp with the message pre-filled.
(function () {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  // Replace with your actual WhatsApp business phone number (include country code, no '+' or spaces)
  const BUSINESS_PHONE = "919876543210";

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const topic = form.topic.value.trim();
    const message = form.message.value.trim();

    success.style.display = 'none';
    success.className = 'form-success';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Opening WhatsApp…';
    }

    try {
      const formattedText = `*New Contact Inquiry*\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*Email:* ${email}\n` +
        `*Topic:* ${topic}\n\n` +
        `*Message:*\n${message}`;

      const encodedMessage = encodeURIComponent(formattedText);
      const whatsappUrl = `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');

      success.textContent = 'WhatsApp opened! You can now hit send in your chat app.';
      success.className = 'form-success success';
      success.style.display = 'block';
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      success.textContent = 'Could not open WhatsApp — please check your browser popup blocker.';
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