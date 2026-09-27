/**
 * MARCA LÁSER CZ - INTERACCIONES & SIMULADOR DE ALTA CONVERSIÓN
 * Desarrollado con JavaScript nativo para máximo rendimiento.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initLaserSimulator();
  initStatsObserver();
});

/* ===================================================================
   1. NAVBAR & MENÚ RESPONSIVO
   =================================================================== */
function initNavbar() {
  const header = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Sticky header background shift on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 6px 20px rgba(0,0,0,0.7)';
      header.style.padding = '4px 0';
    } else {
      header.style.boxShadow = 'none';
      header.style.padding = '0';
    }
  });

  // Mobile toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      header.classList.toggle('nav-open');
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
    });
  });
}

/* ===================================================================
   2. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cierra todos los items para comportamiento de un solo acordeón abierto
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Si no estaba activo, lo abre
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ===================================================================
   3. SIMULADOR VIRTUAL DE MARCACIÓN LÁSER & CANVAS DE CHISPAS
   =================================================================== */
function initLaserSimulator() {
  const simInput = document.getElementById('simInputText');
  const simPartSelect = document.getElementById('simPartSelect');
  const simSerialLabel = document.getElementById('simSerialLabel');
  const simPartBadge = document.getElementById('simPartBadge');
  const fireBtn = document.getElementById('fireLaserBtn');
  const metalSurface = document.getElementById('metalSurface');
  const laserBeam = document.getElementById('laserBeam');
  const statusText = document.getElementById('simStatusText');
  const dynamicWhatsapp = document.getElementById('simDynamicWhatsapp');
  const canvas = document.getElementById('laserCanvas');

  if (!canvas || !simInput || !fireBtn) return;

  const ctx = canvas.getContext('2d');
  let sparks = [];
  let isFiring = false;
  let animId = null;

  // Actualizar texto en tiempo real
  function updateText() {
    const rawVal = simInput.value.trim() || 'PLACA: ABC-12D';
    simSerialLabel.textContent = rawVal.toUpperCase();
    updateWhatsappLink();
  }

  // Actualizar material simulado
  function updatePart() {
    const partNames = {
      exhaust: 'MOFLE DE TITANIO',
      lever: 'MANETA DE FRENO CNC',
      clutch: 'TAPA DE EMBRAGUE',
      tumbler: 'TERMO NEGRO MATE'
    };

    const selected = simPartSelect.value;
    simPartBadge.textContent = partNames[selected] || 'PIEZA METÁLICA';

    // Ajustar color o textura de superficie
    if (selected === 'tumbler') {
      metalSurface.style.background = 'linear-gradient(135deg, #111 0%, #1a1a1a 60%, #0d0d0d 100%)';
      metalSurface.style.borderColor = '#292929';
    } else if (selected === 'lever') {
      metalSurface.style.background = 'linear-gradient(135deg, #161821 0%, #202433 50%, #12141a 100%)';
      metalSurface.style.borderColor = '#434d66';
    } else {
      metalSurface.style.background = 'linear-gradient(135deg, #1b202a 0%, #2b3344 50%, #151820 100%)';
      metalSurface.style.borderColor = '#3c465b';
    }

    updateWhatsappLink();
  }

  // Generar link de WhatsApp dinámico (sin doble codificación)
  function updateWhatsappLink() {
    const textVal = simSerialLabel.textContent.trim();
    
    const readableParts = {
      exhaust: 'Mofle / Puntera de Escape',
      lever: 'Maneta de Freno',
      clutch: 'Tapa de Motor / Embrague',
      tumbler: 'Termo Metálico'
    };
    
    const selectedPart = readableParts[simPartSelect.value] || 'Pieza de Moto';
    const phone = '573229021925';
    
    // Mensaje limpio con formato nativo de WhatsApp (negritas y saltos de línea)
    const message = `¡Hola Marca Láser CZ! 🏍️⚡\n\nProbé el simulador en su página web y quiero cotizar la marcación de mi *${selectedPart}*.\n\n📌 *Grabado deseado:* "${textVal}"\n📍 *Ubicación:* Medellín\n\n¿Qué precio tiene este trabajo y cuándo podría pasar por el taller?`;
    
    // Se codifica una ÚNICA vez al armar la URL para evitar que aparezca %20 en el chat
    dynamicWhatsapp.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  simInput.addEventListener('input', updateText);
  simPartSelect.addEventListener('change', updatePart);

  // Inicializar link
  updateText();
  updatePart();

  // Partículas de chispas
  class Spark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1.5; // Flotan un poco hacia arriba
      this.life = 1;
      this.decay = Math.random() * 0.04 + 0.02;
      this.color = Math.random() > 0.3 ? '#ff6600' : '#ffea00';
      this.size = Math.random() * 2.5 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.15; // Gravedad
      this.life -= this.decay;
    }

    draw(context) {
      context.save();
      context.globalAlpha = Math.max(0, this.life);
      context.fillStyle = this.color;
      context.shadowColor = '#ff5500';
      context.shadowBlur = 6;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  // Ciclo de animación de chispas
  function animateSparks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].draw(ctx);
      if (sparks[i].life <= 0) {
        sparks.splice(i, 1);
      }
    }

    if (isFiring || sparks.length > 0) {
      animId = requestAnimationFrame(animateSparks);
    }
  }

  // Disparo del haz láser
  fireBtn.addEventListener('click', () => {
    if (isFiring) return;
    isFiring = true;
    fireBtn.disabled = true;
    statusText.textContent = 'Estado: 🔥 GRABANDO A FUEGO (LÁSER DE FIBRA ACTIVO)';
    statusText.style.color = '#ff5500';

    simSerialLabel.classList.add('hot-laser');
    laserBeam.style.opacity = '1';

    // Medidas para simular barrido
    const rect = metalSurface.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let scanProgress = 0;
    const scanInterval = setInterval(() => {
      scanProgress += 0.05;

      // Calcular posición del cabezal láser horizontal
      const currentX = (centerX - 140) + scanProgress * 280;
      laserBeam.style.left = `${((currentX / canvas.width) * 100)}%`;

      // Generar ráfaga de chispas
      for (let s = 0; s < 12; s++) {
        sparks.push(new Spark(currentX, centerY + (Math.random() * 20 - 10)));
      }

      if (scanProgress >= 1) {
        clearInterval(scanInterval);
        setTimeout(() => {
          isFiring = false;
          fireBtn.disabled = false;
          laserBeam.style.opacity = '0';
          statusText.textContent = 'Estado: ✅ Grabado molecular finalizado con éxito';
          statusText.style.color = '#25d366';
          
          setTimeout(() => {
            simSerialLabel.classList.remove('hot-laser');
            statusText.textContent = 'Estado: Listo para calibración';
            statusText.style.color = '#9aa5b8';
          }, 3500);
        }, 300);
      }
    }, 45);

    animateSparks();
  });
}

/* ===================================================================
   4. ANIMACIÓN DE NÚMEROS / CONTADORES
   =================================================================== */
function initStatsObserver() {
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = Math.ceil(target / 40);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = `+${target.toLocaleString('es-CO')}`;
            clearInterval(timer);
          } else {
            el.textContent = `+${current.toLocaleString('es-CO')}`;
          }
        }, 30);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}
