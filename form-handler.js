/* ============================================
   CONTACT FORM HANDLER
   Submits to Google Apps Script
   ============================================ */

// Google Apps Script Web App URL - UPDATE THIS
const FORM_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Add timestamp
        data.timestamp = new Date().toISOString();

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch(FORM_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Show success message
            showMessage('success', 'Thank you! Your message has been sent successfully.');
            contactForm.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});

function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
    font-weight: 500;
    ${type === 'success'
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'}
  `;

    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(messageDiv, form);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone);
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            if (this.value && !validateEmail(this.value)) {
                this.setCustomValidity('Please enter a valid email address');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('blur', function () {
            if (this.value && !validatePhone(this.value)) {
                this.setCustomValidity('Please enter a valid phone number');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
