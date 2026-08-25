import React, { useEffect, useRef } from 'react';
import styles from './HomePage.module.css';
import logo from '../assets/logo.png';

export default function HomePage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: `hsl(${Math.random() * 30 + 200}, 70%, 60%)`,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw connections
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 149, 237, ${1 - distance / 150})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    initParticles();
    drawParticles();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        <div className={styles.nav}>
          <div className={styles.logo}>
            <img src={logo} alt="Logo" className={styles.logoImage} />
          </div>
          <div className={styles.links}>
            <a href="/login">Sign in</a>
            <a className={styles.signup} href="/signup">Sign up</a>
          </div>
        </div>

        <section className={styles.hero}>
          <h1 className={styles.title}>Your gateway to quick campus assistance</h1>
          <p className={styles.subtitle}>
            From reporting issues to tracking resolutions, this system brings students and
            departments together on one transparent platform.
          </p>

          <form
            className={styles.cta}
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = '/signup';
            }}
          >
            <input
              aria-label="email"
              placeholder="Enter your email"
              className={styles.email}
              type="email"
              required
            />
            <button className={styles.primary}>Sign up for Free</button>
          </form>
        </section>

        <div className={styles.footerIllustration} aria-hidden />
      </div>
    </main>
  );
}