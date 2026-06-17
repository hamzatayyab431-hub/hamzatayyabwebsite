/* ----------------------------------------------------
   Creative Systems 3D Resume Controller Script
   Inspired by the creative interactions of andreasantonsson.dev
   Optimized with hardware-accelerated background video cross-fades
------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Words Pull-Up text splitting
  initializeWordsPullUp();
  
  // Variables & Selectors
  const loader = document.getElementById('cosmic-loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderProgress = document.getElementById('loader-progress');
  const sectionsContainer = document.querySelector('.sections-container');
  const sections = document.querySelectorAll('.resume-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const orbitProgressCircle = document.getElementById('orbit-progress');
  const orbitText = document.getElementById('orbit-text');
  


  // --------------------------------------------------
  // 3. Asset Preloader & Background Video Play
  // --------------------------------------------------
  function startPreloader() {
    // Start background video playbacks immediately
    const videoOthers = document.getElementById('bg-video-others');
    const monitorVideo = document.getElementById('monitor-hero-video');
    if (videoOthers) videoOthers.play().catch(() => {});
    if (monitorVideo) monitorVideo.play().catch(() => {});

    // Transition preloader out after a clean, elegant delay
    setTimeout(() => {
       if (loader) loader.classList.add('loaded');
       initialize3DTiltEffects();
    }, 1200);
  }
  
  startPreloader();

  // --------------------------------------------------
  // 4. Background Video Manager
  // --------------------------------------------------
  function updateBackgroundVideo(activeSectionId) {
    const videoOthers = document.getElementById('bg-video-others');
    if (!videoOthers) return;
    
    if (activeSectionId === 'hero') {
      videoOthers.classList.remove('active');
    } else {
      videoOthers.classList.add('active');
      if (videoOthers.paused) videoOthers.play().catch(() => {});
    }
  }

  // --------------------------------------------------
  // 5. Scroll Progress Meter
  // --------------------------------------------------
  if (sectionsContainer) {
    sectionsContainer.addEventListener('scroll', () => {
      const scrollTop = sectionsContainer.scrollTop;
      const scrollHeight = sectionsContainer.scrollHeight - sectionsContainer.clientHeight;
      const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      
      const circumference = 283;
      const offset = circumference - (scrollPercent * circumference);
      if (orbitProgressCircle) {
        orbitProgressCircle.style.strokeDashoffset = offset;
      }
    });
  }

  // --------------------------------------------------
  // 6. Snapping Section Active Reveals (Observer)
  // --------------------------------------------------
  const observerOptions = {
    root: sectionsContainer,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        sections.forEach(sec => sec.classList.remove('active-reveal'));
        entry.target.classList.add('active-reveal');
        
        // Dynamically shift background video loop
        updateBackgroundVideo(id);
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
        
        if (id.startsWith('project-') || id === 'projects') {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === '#projects') {
              link.classList.add('active');
            }
          });
        }
        
        const sectionIndex = Array.from(sections).indexOf(entry.target) + 1;
        if (orbitText) {
          orbitText.textContent = String(sectionIndex).padStart(2, '0');
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile Hamburger Toggle
  const hamburger = document.getElementById('hud-hamburger');
  const hudNav = document.querySelector('.hud-nav');
  const headerContainer = document.querySelector('.hud-header-container');
  const spectrumContainer = document.querySelector('.hud-spectrum-container');

  if (hamburger && hudNav) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      hudNav.classList.toggle('active', isActive);
      document.body.classList.toggle('nav-open', isActive);
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        hudNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // Accent Switcher relocator (relocate between desktop header and mobile menu drawer)
  function repositionSpectrum() {
    if (!spectrumContainer) return;
    if (window.innerWidth <= 1024) {
      if (hudNav && spectrumContainer.parentNode !== hudNav) {
        hudNav.appendChild(spectrumContainer);
      }
    } else {
      if (headerContainer && spectrumContainer.parentNode !== headerContainer) {
        headerContainer.insertBefore(spectrumContainer, hudNav);
      }
    }
  }

  window.addEventListener('resize', repositionSpectrum);
  repositionSpectrum();

  // --------------------------------------------------
  // 7. Cursor-Responsive 3D Hover Parallax Tilt
  // --------------------------------------------------
  function initialize3DTiltEffects() {
    // Select headers, project action buttons, and loader elements
    const tiltElements = document.querySelectorAll('.display-title, .project-action-btn, .loader-title, .hero-monitor-container');
    const maxTilt = 10; // Max tilt rotation degree

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const tiltX = -(y / (rect.height / 2)) * maxTilt;
        const tiltY = (x / (rect.width / 2)) * maxTilt;
        
        el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
        el.style.transition = 'transform 0.05s ease-out';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  // --------------------------------------------------
  // 9. Color Spectrum Accent Selector
  // --------------------------------------------------
  const spectrumBubbles = document.querySelectorAll('.spectrum-bubble');
  spectrumBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      const theme = bubble.getAttribute('data-theme');
      
      spectrumBubbles.forEach(b => b.classList.remove('active'));
      bubble.classList.add('active');
      
      document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
      if (theme !== 'gold') {
        document.body.classList.add(`theme-${theme}`);
      }
    });
  });

  // --------------------------------------------------
  // 10. Live x86 Assembly Terminal Console Simulator
  // --------------------------------------------------
  const termBody = document.getElementById('terminal-body');
  const termChips = document.querySelectorAll('.terminal-chip');
  
  // Programmatic Mechanical Synth clicks using HTML5 Web Audio API
  let audioCtx = null;
  function playTerminalSound(type = 'click') {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
      }
    } catch (e) {
      // AudioContext silent fallback
    }
  }
  
  function appendTerminalLine(text, cssClass = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${cssClass}`;
    line.textContent = text;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }
  
  function runTerminalCommand(cmd) {
    playTerminalSound('beep');
    appendTerminalLine(`C:\\>${cmd}`, 'cmd');
    
    setTimeout(() => {
      if (cmd === 'help') {
        appendTerminalLine('Available procedures:');
        appendTerminalLine('  BOOT          Boot raw 16-bit assembler racer');
        appendTerminalLine('  VIEW FONT     Render x86 ROM vector font matrices');
        appendTerminalLine('  INTERRUPTS    List direct BIOS hardware vectors');
        appendTerminalLine('  CLS           Clear console shell stream');
      } else if (cmd === 'clear' || cmd === 'cls') {
        termBody.innerHTML = '';
        appendTerminalLine('C:\\>_');
      } else if (cmd === 'boot') {
        appendTerminalLine('LOADING SYSTEM DATA...');
        appendTerminalLine('INITIALIZING DOS BOX EMULATOR CORE...');
        setTimeout(() => {
          appendTerminalLine('ROM OK. SECTOR 0 LOADED AT ADDRESS 0x7C00.');
          appendTerminalLine('EXECUTING boot.asm SPECIFICATION:', 'asm-comment');
          appendTerminalLine('  org 0x7c00        ; BIOS boot loader address', 'asm-code');
          appendTerminalLine('  mov ax, 0x0013    ; SET GRAPHICS MODE 320x200 256-color', 'asm-code');
          appendTerminalLine('  int 0x10          ; execute bios interrupt', 'asm-code');
          appendTerminalLine('  cli               ; clear interrupts flag', 'asm-code');
          appendTerminalLine('SYS STACK LOADED. RUNNING RETRO RACER... [SUCCESS]', 'asm-comment');
        }, 300);
      } else if (cmd === 'view font') {
        appendTerminalLine('RETRIEVING BIOS ROM FONT BUFFER ADDRESS 0xF000:0xFA6E...');
        setTimeout(() => {
          appendTerminalLine('GLYPH MAP FOR CHARACTER \'C\' (8x8 INT VECTOR):');
          appendTerminalLine('  [00111100] -> . . * * * * . .', 'asm-code');
          appendTerminalLine('  [01100010] -> . * * . . . * .', 'asm-code');
          appendTerminalLine('  [11000000] -> * * . . . . . .', 'asm-code');
          appendTerminalLine('  [11000000] -> * * . . . . . .', 'asm-code');
          appendTerminalLine('  [01100010] -> . * * . . . * .', 'asm-code');
          appendTerminalLine('  [00111100] -> . . * * * * . .', 'asm-code');
          appendTerminalLine('ROM RENDER YIELD COMPLETE.', 'asm-comment');
        }, 300);
      } else if (cmd === 'interrupts') {
        appendTerminalLine('BIOS HARDWARE INTERRUPT DIRECTORY:');
        appendTerminalLine('  INT 0x08 - SYSTEM TIMER (18.2 HZ METRIC BLOCK)', 'asm-code');
        appendTerminalLine('  INT 0x09 - HARDWARE KEYBOARD CONTROLLER CAPTURE', 'asm-code');
        appendTerminalLine('  INT 0x10 - VIDEO SERVICE (BIOS WRAP PIXELS)', 'asm-code');
        appendTerminalLine('  INT 0x1A - Real-time clock system services', 'asm-code');
      } else {
        appendTerminalLine(`ERR: File or command '${cmd}' not recognized.`);
      }
    }, 250);
  }
  
  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      runTerminalCommand(cmd);
    });
  });

  // --------------------------------------------------
  // 11. Skills Constellation SVG Network Graph Generator
  // --------------------------------------------------
  const svg = document.getElementById('skills-constellation');
  const overlay = document.getElementById('constellation-overlay');
  const overlayTitle = document.getElementById('constellation-title');
  const overlayDesc = document.getElementById('constellation-desc');
  
  const skillNodes = [
    // Bottom Layer (Low-Level, y = 300 to 320)
    { id: 'asm', name: 'x86 Assembly', x: 60, y: 300, level: '[██████████░░] 85%', deploy: 'Retro Car Game', desc: '16-bit register controls, keyboard interrupts, and direct video BIOS mapping.' },
    { id: 'c', name: 'C Language', x: 160, y: 300, level: '[██████████░░] 85%', deploy: 'CS50 Web Suite, System Utilities', desc: 'Systems programming, direct memory registers, pointers, and hardware buffers.' },
    { id: 'os', name: 'Operating Systems', x: 270, y: 300, level: '[██████████░░] 80%', deploy: 'HP ZBook Telemetry Core', desc: 'Memory heap buffers, active thread schedulers, and multi-core process telemetry.' },
    { id: 'linux', name: 'Linux OS', x: 380, y: 300, level: '[██████████░░] 85%', deploy: 'HP Workstation Compiler Benchmark', desc: 'Optimized compilations, kernel benchmarking, and shell utility automation.' },
    { id: 'git', name: 'Git & GitHub', x: 450, y: 310, level: '[███████████░] 90%', deploy: 'All Engineering Repositories', desc: 'Distributed version control, collaborative branch orchestration, and release pipelines.' },
    
    // Middle Layer (Core Architecture, y = 180 to 200)
    { id: 'cpp', name: 'C++', x: 70, y: 190, level: '[██████████░░] 88%', deploy: 'Space Shooter, PakistanHub, Auto Insurance Architecture', desc: 'Object-oriented patterns, template metaprogramming, and memory allocation.' },
    { id: 'dsa', name: 'DSA', x: 170, y: 190, level: '[██████████░░] 85%', deploy: 'Core Algorithms Library', desc: 'Algorithmic complexity, custom pointer structures, and self-balancing trees.' },
    { id: 'python', name: 'Python', x: 270, y: 190, level: '[███████████░] 92%', deploy: 'CrimeMind NLP Pipeline', desc: 'Scripting automation, dataset curation pipelines, and micro-API routing.' },
    { id: 'ml', name: 'Machine Learning', x: 350, y: 190, level: '[██████████░░] 83%', deploy: 'CrimeMind Deception Classifier', desc: 'Feature engineering pipelines, validation benchmarks, and model parameters.' },
    { id: 'raylib', name: 'Raylib Engine', x: 450, y: 190, level: '[██████████░░] 80%', deploy: 'Space Shooter Simulation', desc: '2D pixel rendering loops, input listeners, and graphics state buffers.' },
    
    // Top Layer (Frameworks & Specializations, y = 60 to 80)
    { id: 'sfml', name: 'SFML Library', x: 50, y: 80, level: '[██████████░░] 82%', deploy: 'PakistanHub, Space Shooter', desc: '2D hardware acceleration, window/events handling, sprite animation, and sound synthesis.' },
    { id: 'nodejs', name: 'Node.js', x: 145, y: 80, level: '[██████████░░] 85%', deploy: 'EcoTrack Platform Web Services', desc: 'Asynchronous event routing, REST API controllers, and DB client streams.' },
    { id: 'sql', name: 'SQL & DBMS', x: 245, y: 80, level: '[██████████░░] 82%', deploy: 'EcoTrack Waste Routing Database', desc: 'Normalized table relations, query index optimizations, and SQL transactions.' },
    { id: 'pytorch', name: 'PyTorch & NLP', x: 345, y: 80, level: '[██████████░░] 80%', deploy: 'CrimeMind Statement Predictor', desc: 'Transformer fine-tuning, tensor mathematical operations, and model parameters.' },
    { id: 'web', name: 'Web Architecture', x: 450, y: 80, level: '[███████████░] 90%', deploy: 'Interactive Zine Resume System', desc: 'HTML5 semantic layouts, vanilla layout engines, and dynamic animations.' }
  ];
  
  const skillLinks = [
    { source: 'c', target: 'cpp' },
    { source: 'c', target: 'asm' },
    { source: 'c', target: 'os' },
    { source: 'cpp', target: 'dsa' },
    { source: 'cpp', target: 'raylib' },
    { source: 'cpp', target: 'sfml' },
    { source: 'os', target: 'linux' },
    { source: 'linux', target: 'git' },
    { source: 'git', target: 'web' },
    { source: 'python', target: 'dsa' },
    { source: 'python', target: 'ml' },
    { source: 'nodejs', target: 'sql' },
    { source: 'nodejs', target: 'web' },
    { source: 'nodejs', target: 'git' },
    { source: 'python', target: 'pytorch' },
    { source: 'pytorch', target: 'ml' }
  ];
  
  if (svg) {
    // Mouse tracker inside SVG coordinates for physics spring snapping
    let svgMouseX = -1000;
    let svgMouseY = -1000;
    svg.addEventListener('mousemove', (e) => {
      const rect = svg.getBoundingClientRect();
      // Scale coordinates to the SVG's native 500x380 viewBox space
      svgMouseX = rect.width > 0 ? ((e.clientX - rect.left) / rect.width) * 500 : e.clientX - rect.left;
      svgMouseY = rect.height > 0 ? ((e.clientY - rect.top) / rect.height) * 380 : e.clientY - rect.top;
    });
    
    // Text Scrambler Engine for System Inspector
    class Scrambler {
      constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
      }
      scramble(newText) {
        this.queue = [];
        const oldText = this.el.innerText || '';
        const length = Math.max(oldText.length, newText.length);
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || '';
          const to = newText[i] || '';
          const start = Math.floor(Math.random() * 12);
          const end = start + Math.floor(Math.random() * 12);
          this.queue.push({ from, to, start, end, char: '' });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
      }
      update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += (to === '█') ? `<span style="color: var(--accent-color)">█</span>` : to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.3) {
              char = this.chars[Math.floor(Math.random() * this.chars.length)];
              this.queue[i].char = char;
            }
            output += `<span class="scramble-char">${char}</span>`;
          } else {
            output += (from === '█') ? `<span style="color: var(--accent-color)">█</span>` : from;
          }
        }
        this.el.innerHTML = output;
        if (complete < this.queue.length) {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
    }

    const nameScrambler = new Scrambler(document.getElementById('inspect-name'));
    const levelScrambler = new Scrambler(document.getElementById('inspect-level'));
    const deployScrambler = new Scrambler(document.getElementById('inspect-deploy'));
    const descScrambler = new Scrambler(document.getElementById('inspect-desc'));
    
    const summaryDefault = document.getElementById('skills-summary-default');
    const inspectorContent = document.getElementById('skills-inspector-content');

    // Render Links
    skillLinks.forEach((link, idx) => {
      const sNode = skillNodes.find(n => n.id === link.source);
      const tNode = skillNodes.find(n => n.id === link.target);
      if (sNode && tNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sNode.x);
        line.setAttribute('y1', sNode.y);
        line.setAttribute('x2', tNode.x);
        line.setAttribute('y2', tNode.y);
        line.setAttribute('class', 'constellation-link');
        line.setAttribute('id', `link-${link.source}-${link.target}`);
        svg.appendChild(line);
      }
    });
    
    // Render Nodes
    skillNodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'constellation-node');
      g.setAttribute('id', `node-${node.id}`);
      
      const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shadow.setAttribute('cx', node.x + 4);
      shadow.setAttribute('cy', node.y + 4);
      shadow.setAttribute('r', 8);
      shadow.setAttribute('class', 'node-shadow');
      g.appendChild(shadow);
      
      const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      core.setAttribute('cx', node.x);
      core.setAttribute('cy', node.y);
      core.setAttribute('r', 8);
      core.setAttribute('class', 'core');
      g.appendChild(core);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      const textY = node.y < 100 ? node.y + 20 : node.y - 14;
      text.setAttribute('y', textY);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = node.name;
      g.appendChild(text);
      
      svg.appendChild(g);
      
      // Interactions
      g.addEventListener('mouseenter', () => {
        playTerminalSound('click');
        svg.classList.add('pathway-active');
        g.classList.add('active-path');
        
        // Active Pathway dependency mapping
        skillLinks.forEach(link => {
          if (link.source === node.id || link.target === node.id) {
            const lEl = document.getElementById(`link-${link.source}-${link.target}`);
            if (lEl) lEl.classList.add('active');
            
            const connectedId = link.source === node.id ? link.target : link.source;
            const connectedNode = document.getElementById(`node-${connectedId}`);
            if (connectedNode) connectedNode.classList.add('active-path');
          }
        });
        
        // Trigger Scrambled System Inspector Panel
        if (summaryDefault) summaryDefault.style.display = 'none';
        if (inspectorContent) inspectorContent.style.display = 'block';
        
        nameScrambler.scramble(`SYS://${node.name.toUpperCase()}`);
        levelScrambler.scramble(node.level);
        deployScrambler.scramble(node.deploy);
        descScrambler.scramble(node.desc);
        
        if (overlay && overlayTitle && overlayDesc) {
          overlayTitle.textContent = node.name;
          overlayDesc.textContent = node.desc;
          overlay.classList.add('visible');
        }
      });
      
      g.addEventListener('mouseleave', () => {
        svg.classList.remove('pathway-active');
        g.classList.remove('active-path');
        skillLinks.forEach(link => {
          const lEl = document.getElementById(`link-${link.source}-${link.target}`);
          if (lEl) lEl.classList.remove('active');
          
          const connectedId = link.source === node.id ? link.target : link.source;
          const connectedNode = document.getElementById(`node-${connectedId}`);
          if (connectedNode) connectedNode.classList.remove('active-path');
        });
        if (overlay) overlay.classList.remove('visible');
      });
    });

    // Reset inspector when mouse leaves the entire SVG area
    svg.addEventListener('mouseleave', () => {
      svgMouseX = -1000;
      svgMouseY = -1000;
      if (summaryDefault) summaryDefault.style.display = 'block';
      if (inspectorContent) inspectorContent.style.display = 'none';
    });

    // Spring physics node floating loop
    let floatTime = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function animateFloat() {
      const isMobile = window.innerWidth <= 768;
      
      if (prefersReducedMotion.matches || isMobile) {
        // Freeze animation: draw elements static at base positions
        skillNodes.forEach(node => {
          node.currX = node.x;
          node.currY = node.y;
          
          const group = document.getElementById(`node-${node.id}`);
          if (!group) return;
          const core = group.querySelector('.core');
          const shadow = group.querySelector('.node-shadow');
          const text = group.querySelector('text');
          
          if (core) {
            core.setAttribute('cx', node.x);
            core.setAttribute('cy', node.y);
          }
          if (shadow) {
            shadow.setAttribute('cx', node.x + 4);
            shadow.setAttribute('cy', node.y + 4);
          }
          if (text) {
            text.setAttribute('x', node.x);
            const textY = node.y < 100 ? node.y + 20 : node.y - 14;
            text.setAttribute('y', textY);
          }
        });
        
        skillLinks.forEach(link => {
          const sNode = skillNodes.find(n => n.id === link.source);
          const tNode = skillNodes.find(n => n.id === link.target);
          if (sNode && tNode) {
            const line = document.getElementById(`link-${link.source}-${link.target}`);
            if (line) {
              line.setAttribute('x1', sNode.x);
              line.setAttribute('y1', sNode.y);
              line.setAttribute('x2', tNode.x);
              line.setAttribute('y2', tNode.y);
            }
          }
        });
        
        requestAnimationFrame(animateFloat);
        return;
      }

      floatTime += 0.012;
      
      skillNodes.forEach(node => {
        const group = document.getElementById(`node-${node.id}`);
        if (!group) return;
        const core = group.querySelector('.core');
        const shadow = group.querySelector('.node-shadow');
        const text = group.querySelector('text');
        
        // Calculate mouse distance
        const dx = svgMouseX - node.x;
        const dy = svgMouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Snapping factor: mouse close snaps node back to base coordinate
        let snapFactor = 0;
        if (distance < 70) {
          snapFactor = (70 - distance) / 70; // 0 to 1
        }
        
        // trigonometry sways
        const floatX = Math.sin(floatTime + node.x * 0.05) * 4 * (1 - snapFactor);
        const floatY = Math.cos(floatTime * 0.8 + node.y * 0.05) * 4 * (1 - snapFactor);
        
        const currentX = node.x + floatX;
        const currentY = node.y + floatY;
        
        node.currX = currentX;
        node.currY = currentY;
        
        if (core) {
          core.setAttribute('cx', currentX);
          core.setAttribute('cy', currentY);
        }
        if (shadow) {
          shadow.setAttribute('cx', currentX + 4);
          shadow.setAttribute('cy', currentY + 4);
        }
        if (text) {
          text.setAttribute('x', currentX);
          const textY = node.y < 100 ? currentY + 20 : currentY - 14;
          text.setAttribute('y', textY);
        }
      });
      
      skillLinks.forEach(link => {
        const sNode = skillNodes.find(n => n.id === link.source);
        const tNode = skillNodes.find(n => n.id === link.target);
        if (sNode && tNode) {
          const line = document.getElementById(`link-${link.source}-${link.target}`);
          if (line) {
            line.setAttribute('x1', sNode.currX || sNode.x);
            line.setAttribute('y1', sNode.currY || sNode.y);
            line.setAttribute('x2', tNode.currX || tNode.x);
            line.setAttribute('y2', tNode.currY || tNode.y);
          }
        }
      });
      
      requestAnimationFrame(animateFloat);
    }

    animateFloat();
  }

  // --------------------------------------------------
  // 12. HP ZBook Workstation Telemetry Simulator
  // --------------------------------------------------
  const statCompile = document.getElementById('stat-compile');
  const statTemp = document.getElementById('stat-temp');
  const statMem = document.getElementById('stat-mem');
  
  const compileProgress = document.getElementById('compile-progress');
  const tempProgress = document.getElementById('temp-progress');
  const memProgress = document.getElementById('mem-progress');
  const threadVis = document.getElementById('thread-vis');
  
  if (threadVis) {
    const threadCount = 16;
    const threadCells = [];
    for (let i = 0; i < threadCount; i++) {
      const cell = document.createElement('div');
      cell.className = 'thread-cell';
      threadVis.appendChild(cell);
      threadCells.push(cell);
    }
    
    setInterval(() => {
      const eduDrawer = document.getElementById('edu-details');
      if (!eduDrawer || !eduDrawer.classList.contains('open')) return;
      
      if (statCompile && compileProgress) {
        const valCompile = (40.5 + Math.random() * 4.7).toFixed(1);
        statCompile.textContent = valCompile;
        const compilePct = Math.min(100, Math.max(0, Math.round((valCompile / 55) * 100)));
        compileProgress.style.width = `${compilePct}%`;
      }
      
      if (statTemp && tempProgress) {
        const valTemp = Math.round(45 + Math.random() * 9);
        statTemp.textContent = valTemp;
        const tempPct = Math.min(100, Math.max(0, Math.round((valTemp / 100) * 100)));
        tempProgress.style.width = `${tempPct}%`;
      }
      
      if (statMem && memProgress) {
        const valMem = (2.85 + Math.random() * 0.75).toFixed(2);
        statMem.textContent = valMem;
        const memPct = Math.min(100, Math.max(0, Math.round((valMem / 32) * 100)));
        memProgress.style.width = `${memPct}%`;
      }
      
      threadCells.forEach(cell => {
        if (Math.random() > 0.45) {
          cell.classList.add('active');
        } else {
          cell.classList.remove('active');
        }
      });
    }, 700);
  }

  // 13. Workstation Live Monitor Console Toggle (Easter Egg)
  const monitorToggle = document.getElementById('monitor-toggle-feed');
  const monitorVideo = document.getElementById('monitor-hero-video');
  const monitorConsole = document.getElementById('monitor-console');
  const monitorConsoleOutput = document.getElementById('monitor-console-output');
  const monitorStatusText = document.querySelector('.monitor-status-text');

  const monitorDrawerConsole = document.getElementById('monitor-drawer-console');
  const monitorDrawerConsoleOutput = document.getElementById('monitor-drawer-console-output');

  const neofetchLines = [
    "hamza@fast-nuces-workstation",
    "----------------------------",
    "OS: Ubuntu 22.04 LTS / Win 11 Dual-Boot",
    "Host: HP ZBook Workstation G3",
    "Kernel: 6.5.0-generic-x64",
    "Uptime: 2 hours, 14 mins",
    "Shell: bash 5.2.15",
    "CPU: Intel Core i7-6820HQ @ 3.6GHz",
    "GPU: NVIDIA Quadro M2000M (4GB GDDR5)",
    "Memory: 3.12GB / 32GB (Active Yield)",
    "Compiler: GCC v12.2.0 (42.5 KLOC/s)"
  ];

  const drawerConsoleLines = [
    "> initializing portfolio...",
    "> loading project modules... done",
    "> welcome, visitor. system ready."
  ];

  let neofetchTimer = null;
  let drawerTypewriterTimer = null;

  if (monitorToggle && monitorVideo && monitorConsole) {
    monitorToggle.addEventListener('click', () => {
      playTerminalSound('beep');
      const isConsoleActive = monitorConsole.classList.toggle('active');
      monitorVideo.classList.toggle('active', !isConsoleActive);
      
      if (monitorDrawerConsole) {
        monitorDrawerConsole.classList.toggle('active', isConsoleActive);
      }
      
      if (isConsoleActive) {
        if (monitorStatusText) monitorStatusText.textContent = "SYS CONSOLE — ACTIVE";
        monitorToggle.textContent = "SHOW CAMERA FEED";
        runNeofetchAnimation();
        runDrawerTypewriterAnimation();
      } else {
        if (monitorStatusText) monitorStatusText.textContent = "LIVE FEED — ACTIVE";
        monitorToggle.textContent = "TOGGLE CONSOLE";
        if (monitorConsoleOutput) monitorConsoleOutput.innerHTML = "";
        if (monitorDrawerConsoleOutput) monitorDrawerConsoleOutput.innerHTML = "";
        clearInterval(neofetchTimer);
        clearTimeout(drawerTypewriterTimer);
      }
    });
  }

  function runNeofetchAnimation() {
    if (!monitorConsoleOutput) return;
    monitorConsoleOutput.innerHTML = "";
    clearInterval(neofetchTimer);
    
    let lineIdx = 0;
    neofetchTimer = setInterval(() => {
      if (lineIdx < neofetchLines.length) {
        const lineEl = document.createElement('div');
        lineEl.className = 'console-line';
        lineEl.textContent = neofetchLines[lineIdx];
        monitorConsoleOutput.appendChild(lineEl);
        lineIdx++;
      } else {
        clearInterval(neofetchTimer);
      }
    }, 120);
  }

  function runDrawerTypewriterAnimation() {
    if (!monitorDrawerConsoleOutput) return;
    monitorDrawerConsoleOutput.innerHTML = "";
    clearTimeout(drawerTypewriterTimer);
    
    let lineIdx = 0;
    
    function typeNextLine(el) {
      if (lineIdx < drawerConsoleLines.length) {
        const fullText = drawerConsoleLines[lineIdx];
        let lineText = "";
        let cIdx = 0;
        
        function step() {
          if (cIdx < fullText.length) {
            const char = fullText[cIdx];
            if (cIdx === 0 && char === '>') {
              lineText += `<span style="color: var(--accent-color)">&gt;</span>`;
            } else {
              lineText += char;
            }
            el.innerHTML = lineText;
            cIdx++;
            drawerTypewriterTimer = setTimeout(step, 20);
          } else {
            lineIdx++;
            if (lineIdx < drawerConsoleLines.length) {
              drawerTypewriterTimer = setTimeout(() => {
                const nextEl = document.createElement('div');
                nextEl.className = 'drawer-console-line';
                monitorDrawerConsoleOutput.appendChild(nextEl);
                typeNextLine(nextEl);
              }, 150);
            }
          }
        }
        step();
      }
    }
    
    const firstLineEl = document.createElement('div');
    firstLineEl.className = 'drawer-console-line';
    monitorDrawerConsoleOutput.appendChild(firstLineEl);
    typeNextLine(firstLineEl);
  }

  // 14. Turn Text Highlights into Quick Navigation Filters
  const filterTriggers = document.querySelectorAll('.filter-trigger');
  filterTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      playTerminalSound('beep');
      const targetId = trigger.getAttribute('data-target');
      const filterType = trigger.getAttribute('data-filter');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        // Stagger highlight slightly to wait for scroll animation
        setTimeout(() => {
          if (filterType === 'systems') {
            const systemNodeIds = ['node-c', 'node-asm', 'node-os'];
            systemNodeIds.forEach(id => {
              const node = document.getElementById(id);
              if (node) {
                node.classList.add('pulse-highlight');
                setTimeout(() => node.classList.remove('pulse-highlight'), 3000);
              }
            });
          } else if (filterType === 'ml') {
            const cards = document.querySelectorAll('.project-deck-card');
            cards.forEach(card => {
              const title = card.querySelector('.card-title');
              if (title && title.textContent.includes('NLP')) {
                card.classList.add('pulse-highlight');
                setTimeout(() => card.classList.remove('pulse-highlight'), 3000);
              }
            });
          } else if (filterType === 'graphics') {
            const cards = document.querySelectorAll('.project-deck-card');
            cards.forEach(card => {
              const title = card.querySelector('.card-title');
              if (title && (title.textContent.includes('Retro') || title.textContent.includes('Shooter') || title.textContent.includes('PakistanHub'))) {
                card.classList.add('pulse-highlight');
                setTimeout(() => card.classList.remove('pulse-highlight'), 3000);
              }
            });
          }
        }, 650);
      }
    });
  });

});

// --------------------------------------------------
// 8. Sliding Drawer Dialog Control Actions
// --------------------------------------------------
function openDetails(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (drawer) {
    drawer.classList.add('open');
    document.body.classList.add('modal-open');
  }
}

function closeDetails() {
  const drawers = document.querySelectorAll('.detail-drawer');
  drawers.forEach(drawer => drawer.classList.remove('open'));
  document.body.classList.remove('modal-open');
}

// Expose functions to the window object so inline HTML onclick attributes can resolve them under type="module"
window.openDetails = openDetails;
window.closeDetails = closeDetails;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetails();
  }
});

// Helper function to split display titles into individual animating words
function initializeWordsPullUp() {
  const displayTitles = document.querySelectorAll('.display-title');
  displayTitles.forEach(title => {
    const text = title.textContent.trim();
    const words = text.split(/\s+/);
    const hasAsterisk = title.getAttribute('data-asterisk') === 'true';
    
    title.innerHTML = words.map((word, index) => {
      const isLastWord = index === words.length - 1;
      let wordContent = word;
      if (isLastWord && hasAsterisk) {
        wordContent += '<sup class="hud-asterisk">*</sup>';
      }
      
      const delay = index * 0.08;
      return `<span class="pull-up-word-wrapper"><span class="pull-up-word" style="transition-delay: ${delay}s">${wordContent}</span></span>`;
    }).join(' ');
  });
}
