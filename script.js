document.addEventListener('DOMContentLoaded', () => {
    console.log('NovaTech Solutions website loaded.');

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('h1, h2, h3, p, .btn, .service-card, .feature-item, .project-card, .team-card, .contact-container, .hero-visual');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((el, index) => {
        el.classList.add('reveal-hidden');
        // Add staggered delay based on index or position
        el.style.transitionDelay = `${(index % 5) * 0.1}s`;
        revealObserver.observe(el);
    });

    // --- Beams Background (Canvas) ---
    const canvas = document.createElement('canvas');
    canvas.id = 'beams-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.filter = 'blur(35px)';
    canvas.style.opacity = '0.6'; // Adjust for subtlety
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let beams = [];
    const MINIMUM_BEAMS = 20;
    const intensity = 'strong'; // subtle, medium, strong

    const opacityMap = {
        subtle: 0.7,
        medium: 0.85,
        strong: 1,
    };

    function createBeam(width, height) {
        const angle = -35 + Math.random() * 10;
        return {
            x: Math.random() * width * 1.5 - width * 0.25,
            y: Math.random() * height * 1.5 - height * 0.25,
            width: 30 + Math.random() * 60,
            length: height * 2.5,
            angle: angle,
            speed: 0.6 + Math.random() * 1.2,
            opacity: 0.12 + Math.random() * 0.16,
            hue: 190 + Math.random() * 70, // Blue/Cyan range
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
        };
    }

    function resetBeam(beam, index, totalBeams, width, height) {
        const column = index % 3;
        const spacing = width / 3;

        beam.y = height + 100;
        beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
        beam.width = 100 + Math.random() * 100;
        beam.speed = 0.5 + Math.random() * 0.4;
        beam.hue = 190 + (index * 70) / totalBeams;
        beam.opacity = 0.2 + Math.random() * 0.1;
        return beam;
    }

    function drawBeam(ctx, beam) {
        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate((beam.angle * Math.PI) / 180);

        const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];
        const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

        gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
        gradient.addColorStop(0.1, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
        gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
        gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`);
        gradient.addColorStop(0.9, `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
        ctx.restore();
    }

    function updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        const totalBeams = MINIMUM_BEAMS * 1.5;
        beams = Array.from({ length: totalBeams }, () => createBeam(canvas.width, canvas.height));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Optional: Add a subtle background fill if needed, but CSS handles the main bg
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        const totalBeams = beams.length;
        beams.forEach((beam, index) => {
            beam.y -= beam.speed;
            beam.pulse += beam.pulseSpeed;

            if (beam.y + beam.length < -100) {
                resetBeam(beam, index, totalBeams, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
            }

            drawBeam(ctx, beam);
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    animate();
});
