'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  // 1. Header Scrolled State
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Scroll Reveal Observer
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  // 3. Supabase Order Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [orderName, setOrderName] = useState('');
  const [orderItem, setOrderItem] = useState('Classic Masala Dosa');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const dosaOptions = [
    'Classic Masala Dosa',
    'Sourdough Rava Dosa',
    'Charcoal Ragi Dosa',
    'Aloo Podi Special',
    'Gunpowder Ghee Feast',
    'Cheese Chilli Delicacy',
    'Crispy Casual Combo',
    'Batter Boss Daily Pack',
  ];

  const openModal = (defaultItem = 'Classic Masala Dosa') => {
    setOrderItem(defaultItem);
    setModalOpen(true);
    setOrderSuccess(false);
    setOrderError('');
  };

  const closeModal = () => {
    setModalOpen(false);
    setOrderName('');
    setOrderAddress('');
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderName || !orderItem || !orderAddress) {
      setOrderError('Please complete all form fields.');
      return;
    }

    setOrderLoading(true);
    setOrderError('');

    try {
      const { data, error } = await supabase.from('orders').insert([
        {
          user_name: orderName,
          item_name: orderItem,
          address: orderAddress,
        },
      ]);

      if (error) throw error;

      setOrderSuccess(true);
      setOrderName('');
      setOrderAddress('');
    } catch (err) {
      console.error('Error submitting order to Supabase:', err);
      setOrderError(err.message || 'Failed to register your order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  // 4. Interactive Dosa Dispatcher Simulator State
  const [dispatcherShell, setDispatcherShell] = useState('Classic Masala');
  const [dispatcherFilling, setDispatcherFilling] = useState('Aloo Podi');
  const [dispatcherAltitude, setDispatcherAltitude] = useState('120m (Fast Lane)');

  const [simLaunching, setSimLaunching] = useState(false);
  const [simStatusText, setSimStatusText] = useState('SYSTEM: STANDBY');
  const [simStatusActive, setSimStatusActive] = useState(false);
  const [simLogText, setSimLogText] = useState('Awaiting launch clearance code...');
  const [simLogColor, setSimLogColor] = useState('var(--accent-green)');

  // Telemetry readouts
  const [teleAltitude, setTeleAltitude] = useState('0m');
  const [teleSpeed, setTeleSpeed] = useState('0 km/h');
  const [teleTemp, setTeleTemp] = useState('180°C');
  const [teleTilt, setTeleTilt] = useState('0.00°');

  // Simulated drone CSS properties
  const [simDroneLeft, setSimDroneLeft] = useState('10%');
  const [simDroneBottom, setSimDroneBottom] = useState('20px');

  const handleDispatcherLaunch = () => {
    if (simLaunching) return;
    setSimLaunching(true);

    // Initial launch logs
    setSimStatusActive(true);
    setSimStatusText('STATUS: EN ROUTE');
    setSimLogText(`Preparing ${dispatcherShell} shell with ${dispatcherFilling} stuffing...`);
    setSimLogColor('var(--accent-gold)');

    setTimeout(() => {
      setSimLogText('Motors Spun. Thrust Optimized. Launching drone cargo core!');
      setSimLogColor('var(--accent-saffron)');

      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;

        // Position changes
        setSimDroneLeft(`${10 + progress * 0.66}%`);

        // Altitude curve simulation
        let currentAlt = 0;
        if (progress < 50) {
          currentAlt = Math.round((progress / 50) * 120);
        } else {
          currentAlt = Math.round(120 - ((progress - 50) / 50) * 120);
        }
        if (currentAlt < 0) currentAlt = 0;

        setSimDroneBottom(`${20 + currentAlt * 0.4}px`);

        // Telemetry value updates
        setTeleAltitude(`${currentAlt}m`);
        setTeleSpeed(progress < 90 ? `${Math.round(45 + Math.random() * 35)} km/h` : '0 km/h');
        setTeleTemp(`${Math.round(180 - progress * 0.05)}°C`);
        setTeleTilt(progress < 95 ? `${(Math.random() * 2 - 1).toFixed(2)}°` : '0.00°');

        // Stage logs
        if (progress === 20) {
          setSimLogText(`Entering Sky Corridor at altitude of ${dispatcherAltitude}. Auto-gimbal online.`);
          setSimLogColor('var(--text-primary)');
        }
        if (progress === 50) {
          setSimLogText('Mid-flight coordinate check. Sambar fluid level: 100%.');
        }
        if (progress === 80) {
          setSimLogText('Initiating descent toward landing zone. Balancing retro-thrusters.');
          setSimLogColor('var(--accent-gold)');
        }

        if (progress >= 100) {
          clearInterval(interval);

          // Flight completed/Delivered
          setSimDroneBottom('20px');
          setSimDroneLeft('76%');

          setSimStatusActive(false);
          setSimStatusText('STATUS: DELIVERED');

          setTeleAltitude('0m');
          setTeleSpeed('0 km/h');
          setTeleTilt('0.00°');

          setSimLogText('CRITICAL SUCCESS: Fresh Dosa delivered securely. Enjoy the crisp!');
          setSimLogColor('var(--accent-green)');

          // Reset loop
          setTimeout(() => {
            setSimLaunching(false);
            setSimStatusText('SYSTEM: STANDBY');
            setSimDroneLeft('10%');
            setSimDroneBottom('20px');
            setSimLogText('Awaiting launch clearance code...');
            setSimLogColor('var(--accent-green)');
          }, 5000);
        }
      }, 150);
    }, 1200);
  };

  return (
    <>
      {/* Background Glows */}
      <div className="glow-bg glow-1"></div>
      <div className="glow-bg glow-2"></div>
      <div className="glow-bg glow-3"></div>

      {/* Navigation Header */}
      <header id="header" className={scrolled ? 'scrolled' : ''}>
        <div className="container nav-container">
          <a href="#" className="logo">
            <svg className="logo-drone" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="20" r="12" stroke="url(#logo-grad)" stroke-width="2.5" />
              <circle cx="50" cy="80" r="12" stroke="url(#logo-grad)" stroke-width="2.5" />
              <circle cx="20" cy="50" r="12" stroke="url(#logo-grad)" stroke-width="2.5" />
              <circle cx="80" cy="50" r="12" stroke="url(#logo-grad)" stroke-width="2.5" />
              
              <line x1="50" y1="32" x2="50" y2="68" stroke="url(#logo-grad)" stroke-width="3" />
              <line x1="32" y1="50" x2="68" y2="50" stroke="url(#logo-grad)" stroke-width="3" />
              
              <circle cx="50" cy="50" r="10" fill="var(--accent-saffron)" />
              <circle cx="50" cy="50" r="6" fill="var(--accent-gold)" />
              
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stop-color="var(--accent-saffron)" />
                  <stop offset="100%" stop-color="var(--accent-gold)" />
                </linearGradient>
              </defs>
            </svg>
            <span>AirDosa</span>
          </a>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#dispatcher">Dosa Dispatcher</a></li>
            <li><a href="#pricing">Pricing Plans</a></li>
          </ul>

          <div className="nav-cta">
            <div className="badge badge-green" style={{ marginBottom: 0 }}>
              <span className="dot"></span>
              Drone Fleet Live
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', borderRadius: '8px' }} onClick={() => openModal('Classic Masala Dosa')}>
              Order Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="container hero-grid">
          <div className="hero-content reveal">
            <div className="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style={{ marginRight: '0.25rem' }}>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              AI-Powered Drone Delivery
            </div>
            <h1 className="hero-title">
              Crispy Dosas.
              <span>Delivered by Drones.</span>
              Driven by AI.
            </h1>
            <p className="hero-tagline">
              Piping hot, golden-brown dosas flying straight from our telemetry-controlled batter stations to your balcony in under 5 minutes. Real-time fermentation tracking ensures perfect crispiness every single flight.
            </p>

            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => openModal('Classic Masala Dosa')}>
                Launch Order
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginLeft: '6px' }}>
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
              <a href="#features" className="btn btn-secondary">Explore Tech</a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">4m 32s</span>
                <span className="stat-label">Avg Delivery Time</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">180°C</span>
                <span className="stat-label">Batter Temp</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.8%</span>
                <span className="stat-label">Sambar Stabilized</span>
              </div>
            </div>
          </div>

          {/* Hero Showcase Drone SVG */}
          <div className="hero-showcase reveal delay-1">
            <div className="radar-background">
              <div className="radar-sweep"></div>
              <div className="radar-blip blip-1"></div>
              <div className="radar-blip blip-2"></div>
            </div>

            <div className="steam-container">
              <div className="steam-line steam-1"></div>
              <div className="steam-line steam-2"></div>
              <div className="steam-line steam-3"></div>
            </div>

            <div className="drone-container">
              <svg className="dosa-drone-svg" viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 120 L300 230" stroke="#2a2535" stroke-width="12" stroke-linecap="round" />
                <path d="M300 120 L100 230" stroke="#2a2535" stroke-width="12" stroke-linecap="round" />
                <path d="M100 120 L300 230" stroke="url(#metallic)" stroke-width="6" stroke-linecap="round" />
                <path d="M300 120 L100 230" stroke="url(#metallic)" stroke-width="6" stroke-linecap="round" />
                
                <rect x="80" y="100" width="40" height="20" rx="4" fill="#181520" />
                <ellipse cx="100" cy="95" rx="50" ry="8" fill="rgba(255, 182, 39, 0.2)" stroke="var(--accent-gold)" stroke-width="1.5" />
                
                <rect x="280" y="100" width="40" height="20" rx="4" fill="#181520" />
                <ellipse cx="300" cy="95" rx="50" ry="8" fill="rgba(255, 182, 39, 0.2)" stroke="var(--accent-gold)" stroke-width="1.5" />
                
                <rect x="80" y="230" width="40" height="20" rx="4" fill="#181520" />
                <ellipse cx="100" cy="255" rx="50" ry="8" fill="rgba(255, 182, 39, 0.2)" stroke="var(--accent-gold)" stroke-width="1.5" />
                
                <rect x="280" y="230" width="40" height="20" rx="4" fill="#181520" />
                <ellipse cx="300" cy="255" rx="50" ry="8" fill="rgba(255, 182, 39, 0.2)" stroke="var(--accent-gold)" stroke-width="1.5" />
                
                <circle cx="200" cy="175" r="55" fill="url(#central-body-grad)" stroke="#1a1722" stroke-width="6" />
                <circle cx="200" cy="175" r="45" fill="none" stroke="var(--accent-saffron)" stroke-dasharray="8 6" stroke-width="2" />
                
                <path d="M160 215 C160 255, 240 255, 240 215 Z" fill="url(#dosa-pod-grad)" stroke="#201c2b" stroke-width="4" />
                
                <path d="M172 232 Q200 242 228 232" stroke="var(--accent-saffron)" stroke-dasharray="3 3" stroke-width="2.5" />
                
                <circle cx="200" cy="175" r="14" fill="#ff6b35" filter="url(#glow-filter)" />
                <circle cx="200" cy="175" r="6" fill="#fff" />
                
                <path d="M170 248 L150 280 L130 280" stroke="#181520" stroke-width="6" stroke-linecap="round" />
                <path d="M230 248 L250 280 L270 280" stroke="#181520" stroke-width="6" stroke-linecap="round" />
                
                <defs>
                  <linearGradient id="metallic" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#4a4258" />
                    <stop offset="50%" stop-color="#1f1b26" />
                    <stop offset="100%" stop-color="#4a4258" />
                  </linearGradient>
                  <linearGradient id="central-body-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2a2438" />
                    <stop offset="100%" stop-color="#14111c" />
                  </linearGradient>
                  <linearGradient id="dosa-pod-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3c1b10" />
                    <stop offset="50%" stop-color="#ff6b35" />
                    <stop offset="100%" stop-color="#b83807" />
                  </linearGradient>
                  <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header reveal">
            <span className="badge badge-green">Pioneering Tech</span>
            <h2 className="section-title">Designed for Ultimate Crispiness</h2>
            <p className="section-subtitle">We engineered a fully autonomous, thermoregulated flight system that redefines instant breakfast.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card reveal delay-1">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M12 2v9M8 5h8M3 11v-3a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3" />
                </svg>
              </div>
              <h3 className="feature-title">AI-Fermented Batter</h3>
              <p class="feature-desc">Our intelligent fermentation chambers optimize temperature, yeast balance, and humidity in real-time, predicting batter aging using micro-sensors for a golden ratio consistency.</p>
            </div>

            <div className="feature-card reveal delay-2">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M8.5 5.5l7 7M15.5 5.5l-7 7M12 6a6 6 0 0 1 6 6v3a6 6 0 0 1-12 0v-3a6 6 0 0 1 6-6z" />
                </svg>
              </div>
              <h3 className="feature-title">Thermal-Shield Pod</h3>
              <p class="feature-desc">Carbon-fiber insulated food pods keep your dosa cruising at a precise 180°C. Features dynamic moisture vents to release steam, entirely preventing soggy texture during high-speed delivery.</p>
            </div>

            <div className="feature-card reveal delay-3">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
              </div>
              <h3 className="feature-title">Sambar-Safe Gimbal</h3>
              <p class="feature-desc">Equipped with a triple-axis gyroscopic stabilization cradle that counteracts wind shear and rapid flight turns, keeping your piping hot sambar perfectly level. Zero spills guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator / Mission Dispatcher */}
      <section className="dispatcher-section" id="dispatcher">
        <div className="container">
          <div className="section-header reveal">
            <span className="badge">Simulate Mission</span>
            <h2 className="section-title">The Dosa Dispatcher</h2>
            <p className="section-subtitle">Configure your custom dosa and trace its high-altitude flight trajectory via real-time dashboard logs.</p>
          </div>

          <div className="dispatcher-grid reveal">
            {/* Config side */}
            <div className="dispatcher-config">
              <h3 className="config-title">Mission Parameters</h3>

              <div className="config-group">
                <span className="config-label">1. Choose Dosa Shell</span>
                <div className="config-options">
                  {['Classic Masala', 'Sourdough Rava', 'Charcoal Ragi'].map((val) => (
                    <button
                      key={val}
                      className={`config-btn ${dispatcherShell === val ? 'selected' : ''}`}
                      onClick={() => setDispatcherShell(val)}
                      disabled={simLaunching}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">2. Core Filling</span>
                <div className="config-options">
                  {['Aloo Podi', 'Gunpowder Ghee', 'Cheese Chilli'].map((val) => (
                    <button
                      key={val}
                      className={`config-btn ${dispatcherFilling === val ? 'selected' : ''}`}
                      onClick={() => setDispatcherFilling(val)}
                      disabled={simLaunching}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="config-group">
                <span className="config-label">3. Safe Flight Corridor</span>
                <div className="config-options">
                  {['120m (Fast Lane)', '200m (High Wind)', 'Balcony Drop'].map((val) => (
                    <button
                      key={val}
                      className={`config-btn ${dispatcherAltitude === val ? 'selected' : ''}`}
                      onClick={() => setDispatcherAltitude(val)}
                      disabled={simLaunching}
                    >
                      {val.replace('120m (Fast Lane)', '120m (Eco)').replace('200m (High Wind)', '200m (Strato)')}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleDispatcherLaunch} disabled={simLaunching} style={{ marginTop: '1rem' }}>
                <span>{simLaunching ? 'Dosa Cruising...' : 'Authorize Drone Launch'}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ marginLeft: '6px' }}>
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>

            {/* Telemetry Display */}
            <div className="dispatcher-telemetry">
              <div className="telemetry-header">
                <div className="telemetry-status">
                  <span className={`telemetry-status-light ${simStatusActive ? 'active' : ''}`} style={!simStatusActive && !simLaunching ? { backgroundColor: 'var(--accent-saffron)' } : {}}></span>
                  <span>{simStatusText}</span>
                </div>
                <span className="telemetry-system-label">AIRDOSA-OS v3.5</span>
              </div>

              <div className="telemetry-screen-content">
                <div className="telemetry-animation-canvas">
                  <div className="flight-path-dotted"></div>

                  <svg
                    className={`sim-drone ${simLaunching ? 'flying' : ''}`}
                    id="sim-drone"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ left: simDroneLeft, bottom: simDroneBottom }}
                  >
                    <circle cx="25" cy="25" r="10" stroke="var(--accent-gold)" stroke-width="2" />
                    <circle cx="75" cy="25" r="10" stroke="var(--accent-gold)" stroke-width="2" />
                    <line x1="50" y1="35" x2="50" y2="65" stroke="#fff" stroke-width="4" />
                    <line x1="35" y1="50" x2="65" y2="50" stroke="#fff" stroke-width="4" />
                    <circle cx="50" cy="50" r="14" fill="var(--accent-saffron)" />
                    <rect x="42" y="55" width="16" height="18" rx="2" fill="var(--accent-gold)" />
                  </svg>

                  <div className="sim-balcony">
                    <span className="sim-target-pad"></span>
                  </div>
                </div>
              </div>

              <div className="telemetry-readout">
                <div className="readout-item">
                  <span className="readout-label">Altitude:</span>
                  <span className="readout-value">{teleAltitude}</span>
                </div>
                <div className="readout-item">
                  <span className="readout-label">Velocity:</span>
                  <span className="readout-value">{teleSpeed}</span>
                </div>
                <div className="readout-item">
                  <span className="readout-label">Dosa Core Temp:</span>
                  <span className="readout-value highlight">{teleTemp}</span>
                </div>
                <div className="readout-item">
                  <span className="readout-label">Gimbal Tilt:</span>
                  <span className="readout-value">{teleTilt}</span>
                </div>
              </div>

              <div className="launch-log" style={{ color: simLogColor }}>
                {simLogText}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="pricing" id="pricing">
        <div className="glow-bg glow-2" style={{ top: 0, left: '10%' }}></div>
        <div className="container">
          <div className="section-header reveal">
            <span className="badge">Flight Options</span>
            <h2 className="section-title">Drone Subscription Plans</h2>
            <p className="section-subtitle">Pick the airspace corridor that matches your weekly dosa velocity requirements.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card reveal delay-1">
              <div className="pricing-card-header">
                <h3 className="plan-name">Crispy Casual</h3>
                <p className="plan-desc">Perfect for weekend cravings and emergency breakfast drop-ins.</p>
                <div className="plan-price-wrapper">
                  <span className="plan-currency">₹</span>
                  <span className="plan-price">0</span>
                  <span className="plan-period">/ month (Pay per flight)</span>
                </div>
              </div>

              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Standard 8-12 Min Air Delivery
                </li>
                <li className="plan-feature-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Classic Potato Masala options
                </li>
                <li className="plan-feature-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  1 Sambar & 1 Coconut Chutney Cup
                </li>
                <li className="plan-feature-item" style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style={{ color: 'var(--text-muted)' }}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  Priority High-Altitude Lanes
                </li>
              </ul>

              <button className="btn btn-secondary" onClick={() => openModal('Crispy Casual Combo')}>
                Choose Standard
              </button>
            </div>

            <div className="pricing-card premium reveal delay-2">
              <div className="pricing-card-header">
                <h3 className="plan-name">Batter Boss</h3>
                <p className="plan-desc">For high-frequency developers, creators, and true dosa connoisseurs.</p>
                <div className="plan-price-wrapper">
                  <span className="plan-currency">₹</span>
                  <span className="plan-price">499</span>
                  <span className="plan-period">/ month</span>
                </div>
              </div>

              <ul className="plan-features-list">
                <li className="plan-feature-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority Dispatch (&lt; 4 Min Delivery)
                </li>
                <li className="plan-feature-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to Charcoal & Sourdough batters
                </li>
                <li className="plan-feature-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited Sambhar & Gunpowder drops
                </li>
                <li className="plan-feature-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Smart Balcony Landing System (GPS tag)
                </li>
              </ul>

              <button className="btn btn-primary" onClick={() => openModal('Batter Boss Daily Pack')}>
                Clear for Launch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="logo">
                <svg className="logo-drone" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="20" r="12" stroke="url(#foot-grad)" stroke-width="2.5" />
                  <circle cx="50" cy="80" r="12" stroke="url(#foot-grad)" stroke-width="2.5" />
                  <circle cx="20" cy="50" r="12" stroke="url(#foot-grad)" stroke-width="2.5" />
                  <circle cx="80" cy="50" r="12" stroke="url(#foot-grad)" stroke-width="2.5" />
                  <line x1="50" y1="32" x2="50" y2="68" stroke="url(#foot-grad)" stroke-width="3" />
                  <line x1="32" y1="50" x2="68" y2="50" stroke="url(#foot-grad)" stroke-width="3" />
                  <circle cx="50" cy="50" r="10" fill="var(--accent-saffron)" />
                  <defs>
                    <linearGradient id="foot-grad" x1="0" y1="0" x2="100" y2="100">
                      <stop offset="0%" stop-color="var(--accent-saffron)" />
                      <stop offset="100%" stop-color="var(--accent-gold)" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>AirDosa</span>
              </a>
              <p className="footer-desc">Reinventing breakfast logistics with autonomous quadcopters, gyroscopic stabilization, and AI-managed hot griddles.</p>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-links-title">Technology</h4>
              <ul className="footer-links">
                <li><a href="#features">AI Fermentation</a></li>
                <li><a href="#features">Thermoregulation</a></li>
                <li><a href="#features">Sambar Gimbal</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-links-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#">Flight Corridors</a></li>
                <li><a href="#">Safety Protocols</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Initiating direct secure line to Batter Command Control Room...'); }}>Contact Control</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4 className="footer-links-title">Customer Care</h4>
              <ul className="footer-links" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-saffron)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+91 80 4AIRDOSA</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-saffron)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>support@airdosa.ai</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-saffron)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ marginTop: '3px', flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>Batter Control Deck, Sector 4, Outer Ring Road, Bengaluru 560103</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 AirDosa Technologies Pvt Ltd. All corridors cleared.</p>
            <p className="footer-disclaimer">Disclaimer: Dosas are delivered at high velocity. Do not try to catch drones with bare hands. Enjoy responsively.</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <button className="floating-cta" style={{ border: 0 }} onClick={() => openModal('Classic Masala Dosa')} aria-label="Order Dosa Now">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </button>

      {/* Order Modal overlay */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Authorize Drone Dispatch</h3>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">&times;</button>
            </div>

            {orderSuccess ? (
              <div>
                <div className="alert-success">
                  <span>✓</span>
                  <div>
                    <strong>Drone Payload Scheduled!</strong>
                    <p style={{ marginTop: '6px', fontSize: '0.9rem', color: '#b2dfdb' }}>
                      Your hot, crispy dosa is locked in and queued for telemetry launch. Sambar-safe gimbal is powered on.
                    </p>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={closeModal}>
                  Roger That 🛸
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit}>
                {orderError && (
                  <div style={{ color: '#ff6b6b', marginBottom: '16px', fontSize: '0.9rem' }}>
                    ⚠️ {orderError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="user-name">Your Name</label>
                  <input
                    type="text"
                    id="user-name"
                    className="form-input"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    disabled={orderLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="item-select">Selected Dosa Payload</label>
                  <select
                    id="item-select"
                    className="form-select"
                    value={orderItem}
                    onChange={(e) => setOrderItem(e.target.value)}
                    required
                    disabled={orderLoading}
                  >
                    {dosaOptions.map((opt) => (
                      <option key={opt} value={opt} style={{ backgroundColor: '#110e16' }}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Delivery Balcony Address</label>
                  <textarea
                    id="address"
                    className="form-input"
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                    placeholder="Enter your full delivery address (e.g. 4th Floor, East-Facing Balcony, HSR Layout, Bengaluru)"
                    rows="3"
                    required
                    disabled={orderLoading}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary form-submit" disabled={orderLoading}>
                  {orderLoading ? 'Calibrating Gyroscopes...' : 'Confirm Launch Corridor 🚀'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
