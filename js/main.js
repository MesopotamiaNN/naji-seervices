/* ═══════════════════════ CUBE STUDIOS v2.0 - MAIN SCRIPTS ═══════════════════════ */

// ═══════════════ LOADING SCREEN ═══════════════
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
});

// ═══════════════ THEME TOGGLE ═══════════════
function toggleTheme() {
    const html = document.documentElement;
    const btn = document.querySelector('.theme-btn');
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    btn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
document.querySelector('.theme-btn').textContent = savedTheme === 'dark' ? '🌙' : '☀️';

// ═══════════════ SEARCH ═══════════════
function toggleSearch() {
    const overlay = document.getElementById('searchOverlay');
    overlay.classList.toggle('active');
    if (overlay.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

function searchSite() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.innerHTML = '';
        return;
    }
    
    const pages = [
        { title: 'الرئيسية', url: 'index.html', keywords: 'رئيسية home' },
        { title: 'الألعاب - Elyctro', url: 'games.html', keywords: 'العاب لعبة elyctro' },
        { title: 'المحاكيات', url: 'simulators.html', keywords: 'محاكيات محاكي simulator cyberbrain 8086' },
        { title: 'هاردوير - Cube OS', url: 'hardware.html', keywords: 'هاردوير cube os ethion جهاز' },
        { title: 'برمجيات - Cube Suite', url: 'software.html', keywords: 'برمجيات برامج ارشفة مالي كاشير' },
        { title: 'خدمات إبداعية - VR', url: 'creative.html', keywords: 'ابداعي 3d vr واقع افتراضي' },
        { title: 'عن الشركة', url: 'about.html', keywords: 'عن شركة mustafa' },
        { title: 'اتصل بنا', url: 'contact.html', keywords: 'اتصال تواصل هاتف ايميل' },
        { title: 'المدونة', url: 'blog.html', keywords: 'مدونة blog مقالات' },
    ];
    
    const found = pages.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.keywords.toLowerCase().includes(query)
    );
    
    if (found.length > 0) {
        results.innerHTML = found.map(p => 
            `<a href="${p.url}" style="display:block;padding:12px 20px;color:var(--text);text-decoration:none;border-bottom:1px solid var(--border);transition:all 0.3s;" 
                onmouseover="this.style.background='var(--card2)'" 
                onmouseout="this.style.background='transparent'">
                ${p.title}
            </a>`
        ).join('');
    } else {
        results.innerHTML = '<p style="padding:15px;color:var(--muted);">لا توجد نتائج</p>';
    }
}

// Close search on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('searchOverlay').classList.remove('active');
    }
});

// ═══════════════ NAVBAR SCROLL ═══════════════
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ═══════════════ MOBILE MENU ═══════════════
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('active');
        Object.assign(navLinks.style, isActive ? {
            display: 'flex', flexDirection: 'column', position: 'absolute',
            top: '75px', left: '0', width: '100%',
            background: 'var(--panel)', padding: '20px 30px',
            gap: '15px', borderBottom: '1px solid var(--border)',
            zIndex: '999'
        } : { display: 'none' });
    });
}

// ═══════════════ SMOOTH SCROLL ═══════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ═══════════════ SCROLL REVEAL ═══════════════
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ═══════════════ STATS COUNTER ═══════════════
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                if (target && !stat.classList.contains('counted')) {
                    stat.classList.add('counted');
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// ═══════════════ FORM VALIDATION ═══════════════
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[name="name"]');
        const email = this.querySelector('input[name="email"]');
        const message = this.querySelector('textarea[name="message"]');
        let isValid = true;
        
        this.querySelectorAll('.error').forEach(el => el.remove());
        this.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');
        
        if (!name.value.trim()) { showError(name, 'الرجاء إدخال الاسم'); isValid = false; }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'الرجاء إدخال إيميل صحيح'); isValid = false; }
        if (!message.value.trim()) { showError(message, 'الرجاء كتابة رسالة'); isValid = false; }
        
        if (isValid) {
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'جاري الإرسال...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = '✅ تم الإرسال!';
                btn.style.background = '#059669';
                this.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        }
    });
}

function showError(element, message) {
    element.style.borderColor = '#dc2626';
    const error = document.createElement('span');
    error.classList.add('error');
    Object.assign(error.style, { color: '#dc2626', fontSize: '12px', marginTop: '5px', display: 'block' });
    error.textContent = message;
    element.parentNode.insertBefore(error, element.nextSibling);
}

// ═══════════════ BACK TO TOP ═══════════════
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '⬆';
backToTopBtn.className = 'back-to-top';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 500);
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ═══════════════ ACTIVE NAV LINK ═══════════════
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ═══════════════ CURRENT YEAR ═══════════════
document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});

// ═══════════════ LANGUAGE SWITCHER ═══════════════
let currentLang = 'ar';
function switchLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.querySelector('.lang-btn').textContent = currentLang === 'ar' ? '🌐 AR' : '🌐 EN';
}

// ═══════════════ REGISTER SERVICE WORKER (PWA) ═══════════════
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

console.log('🧊 CUBE STUDIOS v2.0 - Ultimate Edition Ready!');
console.log('👑 Mustafa Majeed - Founder & CEO');