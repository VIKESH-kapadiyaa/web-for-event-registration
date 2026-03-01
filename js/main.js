/* ============================================
   NextGenX AI — Elite 50 Batch
   Main Page JavaScript
   ============================================ */

// ── GOOGLE FORM LINK ─────────────────────────────────────────
// Replace this URL with your actual Google Form link
const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_LINK_HERE';

document.addEventListener('DOMContentLoaded', function () {

    // --- INITIALIZE BACKGROUND ANIMATIONS ---
    initBackgrounds(true);

    // ─────────────────────────────────────────────
    // HEADLINE LETTER ANIMATION
    // ─────────────────────────────────────────────
    function animateHeadline() {
        const headline = document.getElementById('main-headline');
        if (!headline) return;

        // Disable text split animation to preserve precise custom HTML spacing/formatting
        // const text = headline.textContent;
        // headline.innerHTML = '';
        // text.split('').forEach((letter, index) => {
        //     const span = document.createElement('span');
        //     span.textContent = letter === ' ' ? '\u00A0' : letter;
        //     span.style.animationDelay = `${index * 0.035}s`;
        //     headline.appendChild(span);
        // });

        // Instead, just apply a simple fade-in safely
        headline.style.opacity = '1';
    }
    animateHeadline();

    // ─────────────────────────────────────────────
    // ANIMATED COUNTER (stats bar)
    // ─────────────────────────────────────────────
    function animateCounter(el, target, duration = 1200) {
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = start;
            }
        }, 16);
    }

    // ─────────────────────────────────────────────
    // SCROLL REVEAL OBSERVER
    // ─────────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-shock, .feature-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger counter animation for stat numbers when stats bar becomes visible
                if (entry.target.closest && entry.target.closest('section') &&
                    entry.target.querySelector && entry.target.querySelector('[data-count]')) {
                    entry.target.querySelectorAll('[data-count]').forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'), 10);
                        animateCounter(counter, target);
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealElements.forEach(elem => observer.observe(elem));

    // Trigger counter for stats bar separately on reveal
    const statsSection = document.querySelector('section.reveal [data-count]');
    if (statsSection) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('[data-count]').forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'), 10);
                        animateCounter(counter, target);
                    });
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statObserver.observe(statsSection);
    }

    // ─────────────────────────────────────────────
    // 3D CARD TILT EFFECT
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // TIMELINE INTERACTIVE STEPS
    // ─────────────────────────────────────────────
    const timelineSteps = document.querySelectorAll('.timeline-step');
    timelineSteps.forEach(step => {
        step.addEventListener('click', () => {
            // Toggle: if already active, collapse; otherwise activate
            const isActive = step.classList.contains('active');
            timelineSteps.forEach(s => s.classList.remove('active'));
            if (!isActive) {
                step.classList.add('active');
            }
        });
    });

    // ─────────────────────────────────────────────
    // MULTI-STEP FORM
    // ─────────────────────────────────────────────
    const steps = ['step-1', 'step-2', 'step-3'];
    let currentStep = 0;

    const progressBar = document.getElementById('form-progress');
    const stepIndicator = document.getElementById('step-indicator');
    const errorMsg = document.getElementById('form-error-msg');

    function showStep(index) {
        steps.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('active', i === index);
        });
        const progress = ((index + 1) / steps.length) * 100;
        if (progressBar) progressBar.style.width = progress + '%';
        if (stepIndicator) stepIndicator.textContent = `Step ${index + 1} of ${steps.length}`;
        hideError();
    }

    function showError(message) {
        if (!errorMsg) return;
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideError() {
        if (errorMsg) errorMsg.classList.add('hidden');
    }

    // --- Next: Step 1 → Step 2 ---
    const next1 = document.getElementById('next-1');
    if (next1) {
        next1.addEventListener('click', () => {
            const nameInput = document.getElementById('fullName');
            if (!nameInput || nameInput.value.trim().length < 2) {
                showError('Please enter your full name (at least 2 characters).');
                return;
            }
            currentStep = 1;
            showStep(currentStep);
        });
    }

    // --- Back: Step 2 → Step 1 ---
    const back2 = document.getElementById('back-2');
    if (back2) {
        back2.addEventListener('click', () => {
            currentStep = 0;
            showStep(currentStep);
        });
    }

    // --- Next: Step 2 → Step 3 ---
    const next2 = document.getElementById('next-2');
    if (next2) {
        next2.addEventListener('click', () => {
            const emailInput = document.getElementById('email');
            if (!emailInput) return;
            const emailVal = emailInput.value.toLowerCase().trim();
            if (!emailVal) {
                showError('Please enter your email address.');
                return;
            }
            if (!emailVal.endsWith('@iilm.edu')) {
                showError('Only IILM college emails are accepted (e.g. yourname@iilm.edu).');
                emailInput.focus();
                return;
            }
            currentStep = 2;
            showStep(currentStep);
        });
    }

    // --- Back: Step 3 → Step 2 ---
    const back3 = document.getElementById('back-3');
    if (back3) {
        back3.addEventListener('click', () => {
            currentStep = 1;
            showStep(currentStep);
        });
    }

    // --- Accept Challenge Checkbox: unlock submit button ---
    const acceptCheckbox = document.getElementById('accept-challenge');
    const submitBtn = document.getElementById('submit-btn');

    if (acceptCheckbox && submitBtn) {
        acceptCheckbox.addEventListener('change', () => {
            if (acceptCheckbox.checked) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                submitBtn.classList.add('unlocked');
            } else {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
                submitBtn.classList.remove('unlocked');
            }
        });
    }

    // ─────────────────────────────────────────────
    // FORM SUBMISSION → Supabase Integration
    // ─────────────────────────────────────────────
    const form = document.getElementById('signup-form');

    // Supabase Credentials (Mildly obfuscated to deter casual scrapers)
    const SUPABASE_URL = ['https://', 'lcpsalqmwyl', 'ncidrwreh', '.supabase', '.co'].join('');
    const SUPABASE_KEY = ['sb_', 'publishable', '_-0wokPPf8C', 'k5efR_PmOoz', 'w_9CdyNIrI'].join('');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phoneNumber');

            // Final validation
            if (!phoneInput || phoneInput.value.trim().length < 10) {
                showError('Please enter a valid 10-digit WhatsApp number.');
                return;
            }
            if (!/^[0-9]{10}$/.test(phoneInput.value.trim())) {
                showError('Phone number must be exactly 10 digits (no spaces or dashes).');
                return;
            }
            if (!acceptCheckbox || !acceptCheckbox.checked) {
                showError('Please accept the challenge before submitting.');
                return;
            }

            // Show loading state on button
            submitBtn.innerHTML = `
                <span style="display:flex;align-items:center;justify-content:center;gap:0.5rem;">
                    <svg style="width:18px;height:18px;animation:spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style="opacity:0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path style="opacity:0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                </span>`;
            submitBtn.disabled = true;

            const applicationData = {
                full_name: nameInput.value.trim(),
                email: emailInput.value.trim().toLowerCase(),
                phone_number: phoneInput.value.trim()
            };

            try {
                // Submit to Supabase REST API (assuming table name is 'applications')
                const response = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(applicationData)
                });

                if (!response.ok) {
                    const errorObj = await response.json();
                    throw new Error(errorObj.message || 'Failed to submit application to the database.');
                }

                // Show success state on page
                const formContainer = document.getElementById('form-container');
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div style="text-align:center;padding:2rem 0;animation: reveal-zoom 0.6s ease forwards;">
                            <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
                            <h2 style="font-size:1.75rem;font-weight:900;margin-bottom:0.75rem;">Application Accepted!</h2>
                            <p style="color:#d4d4d4;max-width:380px;margin:0 auto 1.5rem;line-height:1.6;">
                                Your registration has been securely saved. Keep an eye on your WhatsApp and Email for the <strong style="color:#fff;">Elite 50 Batch</strong> next steps.
                            </p>
                            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:0.875rem;padding:1rem;margin-bottom:1.5rem;font-size:0.85rem;color:#a3a3a3;">
                                <strong style="color:#fff;">You may now safely close this tab.</strong>
                            </div>
                        </div>
                    `;
                }

            } catch (error) {
                console.error('Supabase Error:', error);
                showError(error.message || 'A network error occurred while submitting.');

                // Reset button so they can try again
                submitBtn.innerHTML = '🚀 Submit Application';
                submitBtn.disabled = false;
            }
        });
    }

    // ─────────────────────────────────────────────
    // CSS SPINNER KEYFRAME (injected)
    // ─────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

});
