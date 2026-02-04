/* ============================================
   Thank You Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // --- INITIALIZE BACKGROUND ANIMATIONS ---
    initBackgrounds(false); // No mouse interaction for thank you page

    // --- CONFETTI ANIMATION ---
    function triggerConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.animationDuration = `${Math.random() * 3 + 3}s`;
            confetti.style.backgroundColor = `hsl(0, 0%, ${Math.random() * 20 + 80}%)`;
            container.appendChild(confetti);

            // Remove confetti after animation ends
            confetti.addEventListener('animationend', () => confetti.remove());
        }
    }

    triggerConfetti();

});
