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
      const count = Math.floor((canvas.width * canvas.height) / 6000);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          color: `hsl(${Math.random() * 40 + 210}, 80%, 65%)`,
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
        ctx.globalAlpha = 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connections
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            const alpha = 1 - distance / 120;
            ctx.strokeStyle = `rgba(108, 140, 255, ${alpha * 0.4})`;
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
      
      {/* Nav */}
      <header className={styles.nav}>
        <div className={styles.wrap}>
          <div className={styles.navInner}>
            <a href="/" className={styles.brand}>
              <span className={styles.brandMark} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </span>
              <span className={styles.brandText}>HELPDESK</span>
            </a>
            <nav className={styles.navLinks} aria-label="Primary">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
            </nav>
            <div className={styles.navCta}>
              <a href="/login" className={styles.btnGhost}>Sign In</a>
              <button className={styles.btnGold} onClick={() => window.location.href = '/signup'}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true"></div>
        <div className={styles.wrap}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Campus support · Simplified</span>
              <h1>Your gateway to <br /><em>quick</em> campus assistance</h1>
              <p className={styles.lede}>
                From reporting issues to tracking resolutions, this system brings students 
                and departments together on one transparent platform.
              </p>
              <div className={styles.heroActions}>
                <button className={styles.btnGoldLg} onClick={() => window.location.href = '/signup'}>
                  Get Started Free
                </button>
                <button className={styles.btnGhostLg} onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Learn More
                </button>
              </div>
              <ul className={styles.heroStats}>
                <li><strong className={styles.tnum}>99.9%</strong><span>Uptime</span></li>
                <li><strong className={styles.tnum}>5,000+</strong><span>Issues Resolved</span></li>
                <li><strong className={styles.tnum}>4.8★</strong><span>User Rating</span></li>
              </ul>
            </div>

            <aside className={styles.quoteRail}>
              <p className={styles.railKicker}>Start Here</p>
              <h2 className={styles.railTitle}>Get help in seconds</h2>
              <form className={styles.railForm} onSubmit={(e) => {
                e.preventDefault();
                window.location.href = '/signup';
              }}>
                <label>
                  Report an Issue
                  <input type="text" placeholder="Brief description..." required />
                </label>
                <label>
                  Category
                  <select required>
                    <option value="">Select category</option>
                    <option value="academic">Academic</option>
                    <option value="facility">Facility</option>
                    <option value="it">IT Support</option>
                    <option value="administrative">Administrative</option>
                  </select>
                </label>
                <label>
                  Location
                  <input type="text" placeholder="Building, room, or campus area" required />
                </label>
                <button className={`${styles.btnGold} ${styles.full}`} type="submit">
                  Submit Request
                </button>
              </form>
              <p className={styles.railFine}>Average response time: &lt; 2 hours</p>
            </aside>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className={styles.strip}>
        <div className={styles.wrap}>
          <div className={styles.stripInner}>
            <span>🏛️ 24/7 Support</span>
            <i></i>
            <span>⚡ Quick Resolution</span>
            <i></i>
            <span>🔒 Secure & Private</span>
            <i></i>
            <span>📱 Mobile Friendly</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.section} id="features">
        <div className={styles.wrap}>
          <header className={styles.secHead}>
            <span className={styles.secKicker}>Features</span>
            <h2>Everything you need</h2>
            <p>Streamline campus issue reporting and resolution with our comprehensive platform.</p>
          </header>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>📝</span>
              <h3>Easy Reporting</h3>
              <p>Submit issues in seconds with our intuitive form. Add photos, location, and priority level.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🔍</span>
              <h3>Real-time Tracking</h3>
              <p>Monitor your ticket status from submission to resolution with live updates.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🤝</span>
              <h3>Department Connect</h3>
              <p>Direct communication with relevant campus departments for faster resolution.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>📊</span>
              <h3>Analytics Dashboard</h3>
              <p>Insightful reports on common issues, response times, and department performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`${styles.section} ${styles.sectionDark}`} id="how-it-works">
        <div className={styles.wrap}>
          <header className={styles.secHead}>
            <span className={`${styles.secKicker} ${styles.gold}`}>Simple Process</span>
            <h2>How it works</h2>
            <p>Four easy steps to get your campus issues resolved quickly and efficiently.</p>
          </header>
          <ol className={styles.steps}>
            <li>
              <span className={styles.stepNo}>01</span>
              <h3>Submit Issue</h3>
              <p>Describe your issue, add details, and select the appropriate department.</p>
            </li>
            <li>
              <span className={styles.stepNo}>02</span>
              <h3>Ticket Created</h3>
              <p>Receive a ticket number and confirmation email with estimated response time.</p>
            </li>
            <li>
              <span className={styles.stepNo}>03</span>
              <h3>Department Review</h3>
              <p>Relevant team reviews and assigns the issue to the right specialist.</p>
            </li>
            <li>
              <span className={styles.stepNo}>04</span>
              <h3>Resolution & Feedback</h3>
              <p>Get notified when resolved and provide feedback to improve the system.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${styles.section} ${styles.sectionSoft}`} id="testimonials">
        <div className={styles.wrap}>
          <header className={styles.secHead}>
            <span className={styles.secKicker}>Testimonials</span>
            <h2>What students say</h2>
            <p>Hear from students who have used our platform to resolve campus issues.</p>
          </header>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonial}>
              <blockquote>"The helpdesk system made reporting a faulty projector so easy. It was fixed within hours!"</blockquote>
              <figcaption>
                <strong>Sarah Johnson</strong>
                <span>Computer Science, Junior</span>
              </figcaption>
            </div>
            <div className={`${styles.testimonial} ${styles.testimonialFeatured}`}>
              <blockquote>"I love tracking my requests in real-time. No more wondering if anyone saw my email."</blockquote>
              <figcaption>
                <strong>Michael Chen</strong>
                <span>Business Administration, Senior</span>
              </figcaption>
            </div>
            <div className={styles.testimonial}>
              <blockquote>"The transparency between students and departments has improved campus life significantly."</blockquote>
              <figcaption>
                <strong>Emily Rodriguez</strong>
                <span>Biology, Graduate Student</span>
              </figcaption>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.wrap}>
          <div className={styles.ctaContent}>
            <h2>Ready to get started?</h2>
            <p>Join thousands of students already using our campus helpdesk system.</p>
            <button className={styles.btnGoldLg} onClick={() => window.location.href = '/signup'}>
              Sign Up Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <div className={styles.footGrid}>
            <div className={styles.footBrand}>
              <span className={styles.brandText}>HELPDESK</span>
              <p>Streamlining campus issue reporting and resolution for students and departments.</p>
            </div>
            <nav>
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
            </nav>
            <nav>
              <h4>Support</h4>
              <a href="/help">Help Center</a>
              <a href="/faq">FAQ</a>
              <a href="/contact">Contact</a>
            </nav>
            <nav>
              <h4>Legal</h4>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/cookies">Cookies</a>
            </nav>
          </div>
          <div className={styles.footBase}>
            <span>© 2026 Campus Helpdesk · Fictional brand for demonstration</span>
            <span className={styles.footLegal}>All rights reserved</span>
          </div>
        </div>
      </footer>
    </main>
  );
}