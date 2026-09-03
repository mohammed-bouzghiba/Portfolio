document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // LANGUAGE TOGGLE & INITIALIZATION
    // ----------------------------------------------------
    const langBtn = document.getElementById('lang-toggle');
    const savedLang = localStorage.getItem('lang') || 'en';

    // Set initial lang attribute
    document.documentElement.setAttribute('lang', savedLang);

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const activeLang = document.documentElement.getAttribute('lang') || 'en';
            const newLang = activeLang === 'en' ? 'fr' : 'en';

            document.documentElement.setAttribute('lang', newLang);
            localStorage.setItem('lang', newLang);

            // Optional: reset typewriter indices to avoid truncation glitches during language switch
            charIndex = 0;
            isDeleting = false;
            roleIndex = 0;
        });
    }

    // ----------------------------------------------------
    // TYPEWRITER EFFECT
    // ----------------------------------------------------
    const typeTarget = document.getElementById('typewriter-text');
    const rolesEN = ["Industrial Engineering Student", "Maintenance Tech", "SRM-RSK Intern", "Motatawi3 Volunteer 2026", "Python & IoT Developer", "Hult Prize Competitor 2026", "GIM @ EST Fes"];
    const rolesFR = ["Etudiant en Genie Industriel", "Technicien de Maintenance", "Stagiaire SRM-RSK", "Benevole Motatawi3 2026", "Developpeur Python & IoT", "Competiteur Hult Prize 2026", "GIM @ EST Fes"];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const roles = currentLang === 'fr' ? rolesFR : rolesEN;
        const currentRole = roles[roleIndex % roles.length];

        if (isDeleting) {
            typeTarget.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deleting
        } else {
            typeTarget.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // standard typing
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing, pause
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // pause before typing next
        }

        setTimeout(type, typingSpeed);
    }

    if (typeTarget) {
        setTimeout(type, 1000);
    }

    // ----------------------------------------------------
    // THEME TOGGLE (DARK / LIGHT)
    // ----------------------------------------------------
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply the saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeBtn.addEventListener('click', () => {
        themeBtn.classList.add('theme-rotating');
        setTimeout(() => themeBtn.classList.remove('theme-rotating'), 600);

        const activeTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const iconPath = themeBtn.querySelector('path');
        if (theme === 'light') {
            // Moon icon (to switch to dark)
            iconPath.setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
        } else {
            // Sun icon (to switch to light)
            iconPath.setAttribute('d', 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M2 12h2 M20 12h2 M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12 M20 12 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41');
        }
    }

    // ----------------------------------------------------
    // MOBILE NAVIGATION (HAMBURGER)
    // ----------------------------------------------------
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-links-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ----------------------------------------------------
    // SCROLL SPY (ACTIVE NAVIGATION LINKS)
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');

    const options = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle third of screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ----------------------------------------------------
    // CONTACT FORM VALIDATION & MOCK SUBMIT
    // ----------------------------------------------------
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();
            const lang = document.documentElement.getAttribute('lang') || 'en';

            if (!name || !email || !subject || !message) {
                const errMsg = lang === 'fr' ? 'Erreur : Tous les champs sont requis.' : 'Error: All fields are required.';
                showFormStatus(errMsg, 'error');
                return;
            }

            if (!validateEmail(email)) {
                const errMsg = lang === 'fr' ? 'Erreur : Veuillez entrer une adresse email valide.' : 'Error: Please enter a valid email address.';
                showFormStatus(errMsg, 'error');
                return;
            }

            // Real Form Submission to Mohammed's Inbox via FormSubmit API
            const infoMsg = lang === 'fr' ? 'Envoi du message vers la boîte mail...' : 'Sending message to inbox...';
            showFormStatus(infoMsg, 'info');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            const btnTextEn = submitBtn.querySelector('.lang-en');
            const btnTextFr = submitBtn.querySelector('.lang-fr');

            if (btnTextEn && btnTextFr) {
                btnTextEn.textContent = 'SENDING...';
                btnTextFr.textContent = 'ENVOI EN COURS...';
            } else {
                submitBtn.textContent = lang === 'fr' ? 'ENVOI EN COURS...' : 'SENDING...';
            }

            const payload = {
                name: name,
                email: email,
                _subject: `[Portfolio Mohammed] ${subject} - De : ${name}`,
                message: message,
                _template: 'table',
                _captcha: 'false'
            };

            fetch('https://formsubmit.co/ajax/mohammedbouzghibaa@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error on email dispatch');
                }
                return response.json();
            })
            .then(data => {
                const successMsg = lang === 'fr'
                    ? 'Message envoyé avec succès directement à Mohammed ! Merci, je vous répondrai très prochainement.'
                    : 'Message sent successfully to Mohammed\'s inbox! Thank you, I will get back to you soon.';
                showFormStatus(successMsg, 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.warn('AJAX submit issue, submitting via standard POST fallback:', error);
                // Fallback: If adblocker blocks AJAX, standard POST ensures delivery
                contactForm.submit();
            })
            .finally(() => {
                submitBtn.disabled = false;
                if (btnTextEn && btnTextFr) {
                    btnTextEn.textContent = 'Send Message';
                    btnTextFr.textContent = 'Envoyer le Message';
                } else {
                    submitBtn.textContent = lang === 'fr' ? 'Envoyer le Message' : 'Send Message';
                }
            });
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showFormStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = 'form-status-msg'; // reset classes

        if (type === 'success') {
            formStatus.classList.add('success');
            formStatus.style.borderColor = 'var(--success)';
            formStatus.style.color = 'var(--success)';
            formStatus.style.background = 'rgba(16, 185, 129, 0.08)';
        } else if (type === 'error') {
            formStatus.classList.add('error');
            formStatus.style.borderColor = 'var(--accent)';
            formStatus.style.color = 'var(--accent)';
            formStatus.style.background = 'rgba(249, 115, 22, 0.08)';
        } else {
            formStatus.classList.add('info');
            formStatus.style.borderColor = 'var(--cyan-accent)';
            formStatus.style.color = 'var(--cyan-accent)';
            formStatus.style.background = 'rgba(56, 189, 248, 0.08)';
        }

        formStatus.style.display = 'block';
    }
});

// ─────────────────────────────────────────────────────────────
// FLOATING PARTICLE CANVAS
// ─────────────────────────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 38;
    const COLORS = [
        'rgba(249, 115, 22,',   // accent orange
        'rgba(14,  165, 233,',  // cyan
        'rgba(168,  85, 247,',  // purple
        'rgba(16,  185, 129,',  // green
    ];

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.003,
    }));

    // Mouse coordinates tracker for gravity and lasers
    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    let raf;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = performance.now() * 0.001;

        // Draw connecting lines first (so they render behind the dots)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSqr = dx * dx + dy * dy;

                if (distSqr < 10000) { // 100px squared
                    const dist = Math.sqrt(distSqr);
                    const force = (100 - dist) / 100;
                    const alpha = 0.06 * force; // Very subtle network lines
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = particles[i].color + alpha + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }



        particles.forEach(p => {
            // Apply mouse gravity field
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const pull = (180 - dist) / 180;
                    p.x += (dx / dist) * pull * 0.35;
                    p.y += (dy / dist) * pull * 0.35;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -5) p.x = canvas.width + 5;
            if (p.x > canvas.width + 5) p.x = -5;
            if (p.y < -5) p.y = canvas.height + 5;
            if (p.y > canvas.height + 5) p.y = -5;

            const pulse = (Math.sin(now * p.speed * 40 + p.phase) + 1) / 2;
            const a = p.alpha * (0.4 + 0.6 * pulse);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + a + ')';
            ctx.fill();
        });

        raf = requestAnimationFrame(draw);
    }

    // Pause particles when tab is hidden to save CPU
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); }
        else { draw(); }
    });

    draw();
})();

// ─────────────────────────────────────────────────────────────
// SCROLL-REVEAL  (fade-in + slide-up on intersection)
// ─────────────────────────────────────────────────────────────
(function initScrollReveal() {
    const style = document.createElement('style');
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                        transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll(
        '.skills-category, .project-card, .timeline-item, .about-bullet-card, .achievement-card, .section-title'
    );

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate progress bars if a skills-category is revealed
                if (entry.target.classList.contains('skills-category')) {
                    const progressFills = entry.target.querySelectorAll('.skill-progress-fill');
                    progressFills.forEach(fill => {
                        const skillItem = fill.closest('.skill-item');
                        const level = skillItem ? skillItem.getAttribute('data-level') : 0;
                        fill.style.width = `${level}%`;
                    });
                }

                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => io.observe(el));
})();

// ─────────────────────────────────────────────────────────────
// INTERACTIVE MOUSE SPOTLIGHT CARDS
// ─────────────────────────────────────────────────────────────
(function initMouseSpotlights() {
    const cards = document.querySelectorAll(
        '.skills-category, .project-card, .achievement-card, .timeline-node, .contact-form, .hero-profile-card'
    );

    cards.forEach(card => {
        let rect = null;

        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });

        card.addEventListener('mousemove', (e) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Reset highlight position when mouse leaves so it vanishes smoothly
        card.addEventListener('mouseleave', () => {
            rect = null;
            card.style.setProperty('--mouse-x', `-999px`);
            card.style.setProperty('--mouse-y', `-999px`);
        });
    });

    // Tactile 3D tilt on Hero profile card
    const profileCard = document.querySelector('.hero-profile-card');
    const profileInner = document.querySelector('.profile-card-inner');
    if (profileCard && profileInner) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotX = -(y / (rect.height / 2)) * 8;
            const rotY = (x / (rect.width / 2)) * 8;
            profileInner.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px)`;
        });
        profileCard.addEventListener('mouseleave', () => {
            profileInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    }
})();

// ─────────────────────────────────────────────────────────────
// SLICK SCROLL PROGRESS INDICATOR
// ─────────────────────────────────────────────────────────────
(function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

                progressBar.style.width = `${scrolled}%`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// ─────────────────────────────────────────────────────────────
// TECHNICAL DIAGNOSTICS CONSOLE LOGIC
// ─────────────────────────────────────────────────────────────
(function initTerminal() {
    const btnScan = document.getElementById('btn-terminal-scan');
    const btnClear = document.getElementById('btn-terminal-clear');
    const logOutput = document.getElementById('terminal-log-output');

    if (!btnScan || !logOutput) return;

    let isScanning = false;
    let scanTimeoutIds = [];

    const scanStepsEN = [
        { text: "[SYS] Initializing full technical audit sequence...", type: "info", delay: 200 },
        { text: "[SENSORS] Checking temperature gauges... OK (24.3°C)", type: "success", delay: 500 },
        { text: "[THERMAL] Validating Air Conditioning & Heat Transfer matrices... 100% nominal", type: "success", delay: 900 },
        { text: "[ELECTRICAL] Inspecting Electrotechnics schemas... direct starters functional", type: "success", delay: 1300 },
        { text: "[CONTROL] Verifying feedback loops & regulatory loops... response lag = 12ms", type: "info", delay: 1700 },
        { text: "[COMPUTERS] Scanning GMAO/CMMS asset-registry databases...", type: "info", delay: 2100 },
        { text: "[COMPUTERS] GMAO check complete: 0 overdue preventative tasks detected", type: "success", delay: 2400 },
        { text: "[CODE] Testing Python & IoT data pipelines (MQTT / Modbus telemetry)...", type: "info", delay: 2800 },
        { text: "[CODE] warning: simulated latency spike detected (48ms) but recovery successful", type: "warn", delay: 3200 },
        { text: "[TEAM] Accessing Hult Prize 2026 entrepreneurship credentials... UM6P confirmed", type: "success", delay: 3600 },
        { text: "[SYS] All systems verified. Mohammed Bouzghib profile is fully functional.", type: "success", delay: 4000 }
    ];

    const scanStepsFR = [
        { text: "[SYS] Initialisation de la séquence d'audit technique complet...", type: "info", delay: 200 },
        { text: "[CAPTEURS] Vérification des capteurs de température... OK (24.3°C)", type: "success", delay: 500 },
        { text: "[THERMIQUE] Validation des matrices de climatisation & transfert thermique... 100% nominal", type: "success", delay: 900 },
        { text: "[ELECTRICITE] Inspection des schémas d'électrotechnique... démarreurs directs fonctionnels", type: "success", delay: 1300 },
        { text: "[REGULATION] Vérification des boucles de rétroaction... retard de réponse = 12ms", type: "info", delay: 1700 },
        { text: "[INFORMATIQUE] Balayage des bases de données GMAO...", type: "info", delay: 2100 },
        { text: "[INFORMATIQUE] GMAO vérifiée : 0 tâche préventive en retard détectée", type: "success", delay: 2400 },
        { text: "[CODE] Test des pipelines de données Python & IoT (télémétrie MQTT / Modbus)...", type: "info", delay: 2800 },
        { text: "[CODE] attention: pic de latence simulé détecté (48ms) mais récupération réussie", type: "warn", delay: 3200 },
        { text: "[EQUIPE] Accès aux informations Hult Prize 2026... UM6P confirmé", type: "success", delay: 3600 },
        { text: "[SYS] Systèmes vérifiés. Le profil de Mohammed Bouzghib est opérationnel.", type: "success", delay: 4000 }
    ];

    btnScan.addEventListener('click', () => {
        if (isScanning) return;
        isScanning = true;
        btnScan.disabled = true;
        btnScan.style.opacity = '0.5';

        // Clear previous lines
        logOutput.innerHTML = '';

        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const steps = currentLang === 'fr' ? scanStepsFR : scanStepsEN;

        steps.forEach(step => {
            const timeoutId = setTimeout(() => {
                const line = document.createElement('div');
                line.className = `terminal-line log-${step.type}`;
                line.textContent = step.text;
                logOutput.appendChild(line);

                // Auto-scroll to bottom of terminal body
                const terminalBody = logOutput.closest('.terminal-body');
                if (terminalBody) {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }

                if (step === steps[steps.length - 1]) {
                    isScanning = false;
                    btnScan.disabled = false;
                    btnScan.style.opacity = '1';
                }
            }, step.delay);
            scanTimeoutIds.push(timeoutId);
        });
    });

    btnClear.addEventListener('click', () => {
        // Cancel all running timeouts
        scanTimeoutIds.forEach(id => clearTimeout(id));
        scanTimeoutIds = [];

        logOutput.innerHTML = '';
        isScanning = false;
        btnScan.disabled = false;
        btnScan.style.opacity = '1';
    });
})();

// ─────────────────────────────────────────────────────────────
// HERO TELEMETRY FLUCTUATION LOOP
// ─────────────────────────────────────────────────────────────
(function initTelemetryFluctuation() {
    const tempVal = document.getElementById('telemetry-temp');
    const latencyVal = document.getElementById('telemetry-latency');
    const loadVal = document.getElementById('telemetry-load');
    const pktsVal = document.getElementById('telemetry-pkts');

    if (!tempVal && !latencyVal && !loadVal && !pktsVal) return;

    let pktsCount = 12480;

    setInterval(() => {
        // Temp fluctuates between 23.8 and 24.8
        if (tempVal) {
            const temp = (23.8 + Math.random() * 1.0).toFixed(1);
            tempVal.textContent = `${temp}°C`;
        }

        // Latency fluctuates between 35ms and 55ms
        if (latencyVal) {
            const latency = Math.floor(35 + Math.random() * 20);
            latencyVal.textContent = `${latency}ms`;
        }

        // IoT load fluctuates between 12.0% and 18.0%
        if (loadVal) {
            const load = (12.0 + Math.random() * 6.0).toFixed(1);
            loadVal.textContent = `${load}%`;
        }

        // Modbus packets increment by 1 to 5 packets
        if (pktsVal) {
            pktsCount += Math.floor(1 + Math.random() * 5);
            pktsVal.textContent = pktsCount;
        }
    }, 1500);
})();

// ─────────────────────────────────────────────────────────────
// CUSTOM TRAILING CURSOR OVERLAY
// ─────────────────────────────────────────────────────────────
(function initCustomCursor() {
    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    const ambientGlow = document.querySelector('.ambient-glow');

    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isMoving = false;

    let currentDotScale = 1.0;
    let currentRingScale = 1.0;

    // Position coordinates
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isMoving) {
            dot.style.opacity = '1';
            ring.style.opacity = '1';
            isMoving = true;
        }
    });

    // Mouse leave viewport
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        isMoving = false;
    });

    // Springs / transform updates using requestAnimationFrame (bypassing left/top layout thrashing)
    function animateCursor() {
        const isHovered = document.body.classList.contains('cursor-hovering');
        const targetDotScale = isHovered ? 1.5 : 1.0;
        const targetRingScale = isHovered ? 1.3 : 1.0;

        // JS-interpolated scale transitions to prevent CSS transition conflicts
        currentDotScale += (targetDotScale - currentDotScale) * 0.25;
        currentRingScale += (targetRingScale - currentRingScale) * 0.25;

        // Dot follows cursor coordinates directly
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0) scale(${currentDotScale})`;

        // Ring trails with ease (lerp)
        const lerpFactor = 0.15;
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0) scale(${currentRingScale})`;

        // Ambient parallax glow drift (combined here to avoid separate window mousemove listener)
        if (ambientGlow) {
            const halfWidth = window.innerWidth / 2;
            const halfHeight = window.innerHeight / 2;
            const offsetX = (mouseX - halfWidth) / halfWidth;
            const offsetY = (mouseY - halfHeight) / halfHeight;
            const moveX = offsetX * 25; // up to 25px
            const moveY = offsetY * 25; // up to 25px
            ambientGlow.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hovering detection
    const hoverTargets = document.querySelectorAll(
        'a, button, .skills-category, .project-card, .achievement-card, .timeline-node, .social-link, input, textarea'
    );

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hovering');
        });
        target.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hovering');
        });
    });
})();

// ─────────────────────────────────────────────────────────────
// DIAGNOSTICS CONSOLE TELEMETRY & LEDS ANIMATION
// ─────────────────────────────────────────────────────────────
(function animateTerminalStats() {
    const cpuFill = document.getElementById('gauge-cpu-fill');
    const cpuVal = document.getElementById('gauge-cpu-val');
    const ramFill = document.getElementById('gauge-ram-fill');
    const ramVal = document.getElementById('gauge-ram-val');
    const ledDisk = document.getElementById('led-disk');
    const ledNetwork = document.getElementById('led-network');

    if (!cpuFill && !cpuVal && !ramFill && !ramVal && !ledDisk && !ledNetwork) return;

    // Telemetry updates
    setInterval(() => {
        // CPU fluctuates dynamically
        const cpu = Math.floor(15 + Math.random() * 55); // 15% to 70%
        if (cpuFill) cpuFill.style.width = `${cpu}%`;
        if (cpuVal) cpuVal.textContent = `${cpu}%`;

        // RAM fluctuates slowly
        const ram = Math.floor(40 + Math.random() * 15); // 40% to 55%
        if (ramFill) ramFill.style.width = `${ram}%`;
        if (ramVal) ramVal.textContent = `${ram}%`;
    }, 2000);

    // High frequency LED flashes
    setInterval(() => {
        if (ledDisk) {
            if (Math.random() > 0.4) {
                ledDisk.classList.add('active');
                setTimeout(() => ledDisk.classList.remove('active'), 100);
            }
        }
    }, 300);

    setInterval(() => {
        if (ledNetwork) {
            if (Math.random() > 0.3) {
                ledNetwork.classList.add('active');
                setTimeout(() => ledNetwork.classList.remove('active'), 80);
            }
        }
    }, 250);
})();

// ─────────────────────────────────────────────────────────────
// PARALLAX AMBIENT GLOW DRIFT
// ─────────────────────────────────────────────────────────────
// Consolidated parallax glow drift into animateCursor() above to avoid redundant window mousemove listener.

// ─────────────────────────────────────────────────────────────
// REAL-TIME VIBRATION DIAGNOSTICS OSCILLOSCOPE ANIMATION
// ─────────────────────────────────────────────────────────────
(function initOscilloscope() {
    const trace = document.getElementById('oscilloscope-trace');
    const freqVal = document.getElementById('scope-freq');
    const ampVal = document.getElementById('scope-amp');

    if (!trace) return;

    let time = 0;
    const width = 500;
    const height = 80;
    const centerY = height / 2;

    function drawWave() {
        // Base frequency fluctuates slightly over time
        const baseFreq = 49.5 + Math.sin(time * 0.05) * 1.5 + (Math.random() - 0.5) * 0.2;
        // Amplitude fluctuates between 0.6G and 0.95G
        const baseAmp = 0.75 + Math.sin(time * 0.02) * 0.15 + (Math.random() - 0.5) * 0.03;

        if (freqVal && Math.random() > 0.85) {
            freqVal.textContent = baseFreq.toFixed(1);
        }
        if (ampVal && Math.random() > 0.85) {
            ampVal.textContent = baseAmp.toFixed(2);
        }

        let path = '';
        const points = 100;
        const dx = width / points;

        for (let i = 0; i <= points; i++) {
            const x = i * dx;

            // Calculate a wave composed of a fundamental sine wave, a 2nd harmonic, and some noise
            const phase = time * 0.25;
            const term1 = Math.sin((i / points) * Math.PI * 6 - phase); // Fundamental
            const term2 = 0.25 * Math.sin((i / points) * Math.PI * 18 + phase * 2); // Harmonic
            const noise = 0.08 * (Math.sin(x * 1.5 + time * 3) * Math.cos(x * 0.7 - time)); // High frequency noise

            // Apply scale by amplitude and center on viewport
            const ampScale = baseAmp * 25; // max vertical displacement
            const y = centerY + (term1 + term2 + noise) * ampScale;

            if (i === 0) {
                path += `M ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        }

        trace.setAttribute('d', path);
        time++;
        requestAnimationFrame(drawWave);
    }

    drawWave();
})();

