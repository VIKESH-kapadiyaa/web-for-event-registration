/* ============================================
   Main Page JavaScript (index.html)
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // --- SUPABASE INITIALIZATION ---
    const SUPABASE_URL = 'https://xrzoroeucxflfokoijkm.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyem9yb2V1Y3hmbGZva29pamttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTg3OTYsImV4cCI6MjA3MzE5NDc5Nn0.PY9Py2WPob7twUTnV8j-x2Z107dPWIY0B2ku9XKyTwA';
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- INITIALIZE BACKGROUND ANIMATIONS ---
    initBackgrounds(true); // Enable mouse interaction for main page

    // --- HEADLINE LETTER ANIMATION ---
    function animateHeadline() {
        const headline = document.getElementById('main-headline');
        if (!headline) return;

        const text = headline.textContent;
        headline.innerHTML = '';

        text.split('').forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.animationDelay = `${index * 0.04}s`;
            headline.appendChild(span);
        });
    }
    animateHeadline();

    // --- COUNTDOWN TIMER ---
    const eventDate = new Date("Feb 7, 2026 11:00:00").getTime();
    const countdownTimer = document.getElementById('countdown-timer');
    const countdownSection = document.getElementById('countdown-section');

    if (countdownTimer) {
        const timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(timerInterval);
                countdownSection.innerHTML = '<div class="text-center text-lg font-bold text-white">The event has started!</div>';
                return;
            }

            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            countdownTimer.innerHTML = `
                <div><span class="text-2xl sm:text-3xl md:text-4xl font-bold">${String(d).padStart(2, '0')}</span><p class="text-xs text-neutral-400">Days</p></div>
                <div class="text-xl sm:text-2xl font-bold text-neutral-500">:</div>
                <div><span class="text-2xl sm:text-3xl md:text-4xl font-bold">${String(h).padStart(2, '0')}</span><p class="text-xs text-neutral-400">Hours</p></div>
                <div class="text-xl sm:text-2xl font-bold text-neutral-500">:</div>
                <div><span class="text-2xl sm:text-3xl md:text-4xl font-bold">${String(m).padStart(2, '0')}</span><p class="text-xs text-neutral-400">Minutes</p></div>
                <div class="text-xl sm:text-2xl font-bold text-neutral-500">:</div>
                <div><span class="text-2xl sm:text-3xl md:text-4xl font-bold">${String(s).padStart(2, '0')}</span><p class="text-xs text-neutral-400">Seconds</p></div>
            `;
        }, 1000);
    }

    // --- FORM SUBMISSION ---
    const form = document.getElementById('signup-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Email validation
            const emailInput = form.querySelector('#email');
            const email = emailInput.value;
            const emailDomain = '@iilm.edu';
            const formContainer = document.getElementById('form-container');

            if (!email.toLowerCase().endsWith(emailDomain)) {
                showError(formContainer, 'Please use a valid IILM email address (ending in @iilm.edu).');
                return;
            }

            // Clear any previous error messages
            clearError();

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                </span>`;

            // Prepare form data
            const formData = new FormData(form);
            const registrationData = {
                full_name: formData.get('fullName'),
                email: formData.get('email'),
                student_id: formData.get('studentId'),
                year_branch: formData.get('yearBranch'),
                phone_number: formData.get('phoneNumber'),
                excited_to_learn: formData.get('excitedToLearn')
            };

            try {
                const { data, error } = await supabaseClient
                    .from('registrations')
                    .insert([registrationData]);

                if (error) throw error;

                // Redirect to thank you page
                fetch('./thankyou.html', { method: 'HEAD' })
                    .then(res => {
                        if (res.ok) {
                            window.location.href = './thankyou.html';
                        } else {
                            showSuccessMessage(formContainer);
                        }
                    })
                    .catch(() => {
                        showSuccessMessage(formContainer);
                    });

            } catch (error) {
                console.error('Error submitting form:', error.message);

                let errorMessage = `An error occurred: ${error.message}. Please try again.`;
                if (error.message.includes('duplicate key value violates unique constraint "registrations_email_key"')) {
                    errorMessage = 'This email address has already been registered.';
                }

                showError(formContainer, errorMessage);
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // --- HELPER FUNCTIONS ---
    function showError(container, message) {
        let errorDiv = document.getElementById('form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'form-error';
            errorDiv.className = 'mt-4 p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg';
            const formDescription = container.querySelector('p');
            if (formDescription) {
                formDescription.insertAdjacentElement('afterend', errorDiv);
            } else {
                container.prepend(errorDiv);
            }
        }
        errorDiv.textContent = message;
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearError() {
        const errorDiv = document.getElementById('form-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function showSuccessMessage(container) {
        container.innerHTML = `
            <h2 class="text-3xl font-bold mb-2 text-center">Thank You!</h2>
            <p class="text-neutral-300 mb-6 text-center text-lg">Your registration is confirmed. We look forward to seeing you at the workshop!</p>
            <div class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        `;
    }

    // --- SCROLL ANIMATION OBSERVER ---
    const revealElements = document.querySelectorAll('.reveal, .feature-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(elem => observer.observe(elem));

    // --- 3D CARD TILT EFFECT ---
    document.querySelectorAll('.interactive-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -14;
            const rotateY = (x / width - 0.5) * 14;
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

});
