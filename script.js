/* ============================================
   OLLANO Landing Page - Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // 1. Countdown Timer
    // ============================================
    const initCountdown = () => {
        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');
        
        if (!hoursEl || !minutesEl || !secondsEl) return;

        // Set countdown to 6 hours from now
        let totalSeconds = 6 * 3600 + 23 * 60 + 45;

        const updateTimer = () => {
            if (totalSeconds <= 0) {
                totalSeconds = 6 * 3600 + 23 * 60 + 45; // Reset
            }
            
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');

            totalSeconds--;
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    };



    // ============================================
    // 3. Product Image Thumbnails
    // ============================================
    const initThumbnails = () => {
        const thumbs = document.querySelectorAll('.thumb');
        const heroImg = document.getElementById('hero-product-img');
        
        if (!thumbs.length || !heroImg) return;

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active from all
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                
                // Animate image change
                heroImg.style.opacity = '0';
                heroImg.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    heroImg.src = thumb.dataset.img;
                    heroImg.style.opacity = '1';
                    heroImg.style.transform = 'scale(1)';
                }, 200);
            });
        });

        // Add transition to hero image
        heroImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    };

    // ============================================
    // 4. Before/After Slider
    // ============================================
    const initBASlider = () => {
        const container = document.querySelector('.ba-container');
        const handle = document.getElementById('ba-handle');
        const before = document.querySelector('.ba-before');
        
        if (!container || !handle || !before) return;

        let isDragging = false;

        const updateSlider = (x) => {
            const rect = container.getBoundingClientRect();
            // RTL: reverse the calculation
            let percent = ((rect.right - x) / rect.width) * 100;
            percent = Math.max(5, Math.min(95, percent));
            
            before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            handle.style.right = `${percent}%`;
            handle.style.left = 'auto';
        };

        const onStart = (e) => {
            isDragging = true;
            e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
        };

        const onEnd = () => {
            isDragging = false;
        };

        handle.addEventListener('mousedown', onStart);
        handle.addEventListener('touchstart', onStart, { passive: false });
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);

        // Click anywhere in container
        container.addEventListener('click', (e) => {
            updateSlider(e.clientX);
        });
    };

    // ============================================
    // 5. Statistics Counter Animation
    // ============================================
    const initStatsCounter = () => {
        const stats = document.querySelectorAll('.stat-number');
        if (!stats.length) return;

        const animateNumber = (el) => {
            const target = parseInt(el.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    return;
                }
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            };

            update();
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateNumber(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        stats.forEach(stat => observer.observe(stat));
    };

    // ============================================
    // 6. Scroll Animations
    // ============================================
    const initScrollAnimations = () => {
        // Add animation class to sections
        const sections = document.querySelectorAll(
            '.see-action-section, .why-choose-section, .before-after-section, ' +
            '.problem-section, .journey-section, .how-works-section, ' +
            '.stats-section, .reviews-section, .faq-section, .guarantee-section'
        );

        sections.forEach(section => {
            section.classList.add('animate-on-scroll');
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    };

    // ============================================
    // 7. Accordion Enhancement
    // ============================================
    const initAccordions = () => {
        // Product accordion - close others when one opens
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    accordionItems.forEach(other => {
                        if (other !== item && other.open) {
                            other.open = false;
                        }
                    });
                }
            });
        });

        // FAQ accordion - same behavior
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    faqItems.forEach(other => {
                        if (other !== item && other.open) {
                            other.open = false;
                        }
                    });
                }
            });
        });
    };

    // ============================================
    // 8. Pricing Selection
    // ============================================
    const initPricing = () => {
        const radios = document.querySelectorAll('.pricing-radio');
        const addToCartBtn = document.getElementById('add-to-cart');
        
        if (!radios.length) return;

        const prices = {
            '1': '299 ج.م',
            '2': '549 ج.م',
            '3': '799 ج.م'
        };



        // Add to cart animation
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    const current = parseInt(cartCount.textContent) || 0;
                    cartCount.textContent = current + 1;
                    
                    // Animate
                    cartCount.style.transform = 'scale(1.5)';
                    setTimeout(() => {
                        cartCount.style.transform = 'scale(1)';
                    }, 300);
                }

                // Button feedback
                addToCartBtn.textContent = '✓ تمت الإضافة!';
                addToCartBtn.style.background = '#10B981';
                
                setTimeout(() => {
                    addToCartBtn.innerHTML = `
                        <svg fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg" style="margin-left:8px;">
                            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>أضف إلى السلة
                    `;
                    addToCartBtn.style.background = '';
                }, 2000);
            });
        }
    };

    // ============================================
    // 9. Smooth Scroll for Anchor Links
    // ============================================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80; // Header height
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    };

    // ============================================
    // 10. Header scroll effect
    // ============================================
    const initHeaderScroll = () => {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
    };

    // ============================================
    // 11. Mobile Sticky Buy Bar (mobile only)
    // ============================================
    const initMobileBuybar = () => {
        const bar = document.getElementById('mobile-buybar');
        if (!bar) return;

        const hero = document.getElementById('hero');
        const realBtn = document.getElementById('add-to-cart');
        const barBtn = document.getElementById('mobile-buybar-btn');
        const priceEl = document.getElementById('mobile-buybar-price');
        const prices = { '1': '299 ج.م', '2': '549 ج.م', '3': '799 ج.م' };

        document.body.classList.add('has-buybar');

        // Reveal the bar once the hero has scrolled out of view
        const onScroll = () => {
            const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
            bar.classList.toggle('is-visible', heroBottom < 0);
            bar.setAttribute('aria-hidden', heroBottom < 0 ? 'false' : 'true');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Keep the bar price in sync with the selected offer
        document.querySelectorAll('.pricing-radio').forEach((radio) => {
            radio.addEventListener('change', () => {
                if (radio.checked && priceEl && Object.prototype.hasOwnProperty.call(prices, radio.value)) {
                    priceEl.textContent = prices[radio.value];
                }
            });
        });

        // Trigger the real add-to-cart, with its own quick feedback
        if (barBtn && realBtn) {
            barBtn.addEventListener('click', () => {
                realBtn.click();
                const original = barBtn.innerHTML;
                barBtn.textContent = '✓ تمت الإضافة';
                barBtn.style.background = '#10B981';
                setTimeout(() => {
                    barBtn.innerHTML = original;
                    barBtn.style.background = '';
                }, 2000);
            });
        }
    };

    // ============================================
    // 12. UGC Video Reels (autoplay muted in view + tap for sound)
    // ============================================
    const initUGCVideos = () => {
        const videos = document.querySelectorAll('.see-action-section .ugc-video');
        if (!videos.length) return;

        // Always silent — no sound, no controls
        videos.forEach((v) => { v.muted = true; v.removeAttribute('controls'); });

        // Autoplay (muted) only while the card is on screen — light & reel-like
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.play().catch(() => {});
                    } else {
                        entry.target.pause();
                    }
                });
            }, { threshold: 0.5 });
            videos.forEach((v) => io.observe(v));
        } else {
            videos.forEach((v) => v.play().catch(() => {}));
        }

        // On mobile, start the carousel centered on an inner video so the
        // neighbours peek on BOTH sides (hints there's more to scroll).
        const grid = document.querySelector('.see-action-section .ugc-grid');
        if (grid && grid.children.length > 2 && 'IntersectionObserver' in window) {
            let centered = false;
            const centerObs = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !centered && window.innerWidth <= 768) {
                    centered = true;
                    const y = window.scrollY;
                    grid.children[1].scrollIntoView({ inline: 'center', block: 'nearest' });
                    window.scrollTo(0, y); // undo any vertical nudge
                    centerObs.disconnect();
                }
            }, { threshold: 0.25 });
            centerObs.observe(grid);
        }
    };

    // ============================================
    // 13. Order Quiz Modal (Cash on Delivery)
    // ============================================
    const initQuiz = () => {
        const modal = document.getElementById('quiz-modal');
        if (!modal) return;

        // 🔗 مسار استقبال الليدز — Cloud Function عبر Hosting rewrite (نفس الدومين)
        //    الكود في functions/index.js — راجع LEADS_SETUP.md
        const LEADS_ENDPOINT = '/api/lead';

        const steps = modal.querySelectorAll('.quiz-step');
        const bar = document.getElementById('quiz-progress-bar');
        const backBtn = document.getElementById('quiz-back');
        const offerBox = document.getElementById('quiz-offer');
        const form = document.getElementById('quiz-form');
        const errorEl = document.getElementById('quiz-error');
        const TOTAL = 4; // number of question/form steps (success not counted)
        const answers = {};
        let step = 1;

        const OFFERS = {
            '1': { name: 'اشترِ 1 + 1 مجاناً', qty: 'عبوتين', price: '299 ج.م', old: '650 ج.م' },
            '2': { name: 'اشترِ 2 + 2 مجاناً', qty: '4 عبوات', price: '549 ج.م', old: '1,300 ج.م' },
            '3': { name: 'اشترِ 3 + 3 مجاناً', qty: '6 عبوات', price: '799 ج.م', old: '1,950 ج.م' }
        };

        const getOffer = () => {
            const checked = document.querySelector('.pricing-radio:checked');
            const val = checked && OFFERS[checked.value] ? checked.value : '2';
            return Object.assign({ val: val }, OFFERS[val]);
        };

        const renderOffer = () => {
            if (!offerBox) return;
            const o = getOffer();
            offerBox.innerHTML =
                '<div class="quiz-offer__row">' +
                    '<span class="quiz-offer__tag">عرضك المختار</span>' +
                    '<span class="quiz-offer__price">' + o.price + ' <s>' + o.old + '</s></span>' +
                '</div>' +
                '<div class="quiz-offer__name">' + o.name + ' — ' + o.qty + '</div>' +
                '<div class="quiz-offer__cod">💵 الدفع عند الاستلام</div>';
        };

        const showStep = (n) => {
            step = n;
            steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === n));
            if (bar) bar.style.width = (Math.min(n, TOTAL) / TOTAL) * 100 + '%';
            if (backBtn) backBtn.style.display = (n > 1 && n <= TOTAL) ? 'inline-flex' : 'none';
            if (n === 4) renderOffer();
            const dialog = modal.querySelector('.quiz-modal__dialog');
            if (dialog) dialog.scrollTop = 0;
        };

        const open = () => {
            renderOffer();
            showStep(1);
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        const close = () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        window.openQuizModal = open;

        // pick an answer -> store + auto-advance
        modal.querySelectorAll('.quiz-option').forEach((btn) => {
            btn.addEventListener('click', () => {
                answers[btn.dataset.q] = btn.dataset.val;
                btn.parentElement.querySelectorAll('.quiz-option').forEach((b) => b.classList.remove('is-selected'));
                btn.classList.add('is-selected');
                setTimeout(() => showStep(step + 1), 220);
            });
        });

        if (backBtn) backBtn.addEventListener('click', () => { if (step > 1) showStep(step - 1); });

        // close handlers
        const closeEls = modal.querySelectorAll('[data-quiz-close]');
        closeEls.forEach((el) => el.addEventListener('click', close));
        const closeBtn = document.getElementById('quiz-close');
        if (closeBtn) closeBtn.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
        });

        // submit order
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = new FormData(form);
                const name = (data.get('name') || '').toString().trim();
                const phone = (data.get('phone') || '').toString().trim();
                const whatsapp = (data.get('whatsapp') || '').toString().trim();
                const address = (data.get('address') || '').toString().trim();
                const phoneOk = /^01[0-9]{9}$/.test(phone);
                const waOk = /^01[0-9]{9}$/.test(whatsapp);

                let err = '';
                if (!name) err = 'من فضلك اكتب اسمك بالكامل';
                else if (!phoneOk) err = 'رقم الهاتف لازم 11 رقم ويبدأ بـ 01';
                else if (!waOk) err = 'رقم الواتساب لازم 11 رقم ويبدأ بـ 01';
                else if (address.length < 8) err = 'من فضلك اكتب العنوان بالكامل';
                if (errorEl) errorEl.textContent = err;
                if (err) return;

                const o = getOffer();
                const order = Object.assign({}, answers, {
                    name: name, phone: phone, whatsapp: whatsapp, address: address,
                    offer: o.name, qty: o.qty, price: o.price,
                    payment: 'الدفع عند الاستلام',
                    page: location.href,
                    createdAt: new Date().toISOString()
                });

                const submitBtn = form.querySelector('.quiz-submit');
                const origText = submitBtn ? submitBtn.textContent : '';
                if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'جاري إرسال الطلب…'; }
                if (errorEl) errorEl.textContent = '';

                // نسخة احتياطية محلية حتى لا يضيع أي ليد
                try {
                    const saved = JSON.parse(localStorage.getItem('ollano_orders') || '[]');
                    saved.push(order);
                    localStorage.setItem('ollano_orders', JSON.stringify(saved));
                } catch (_) { /* ignore */ }

                const onSuccess = () => {
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
                    showStep(5);
                    if (bar) bar.style.width = '100%';
                    if (backBtn) backBtn.style.display = 'none';
                };
                const onError = () => {
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
                    if (errorEl) errorEl.textContent = 'حصل خطأ في الإرسال، حاول تاني أو كلّمنا واتساب.';
                };

                if (LEADS_ENDPOINT) {
                    fetch(LEADS_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(order)
                    })
                        .then((res) => { if (!res.ok) throw new Error('status ' + res.status); return res; })
                        .then(onSuccess)
                        .catch(onError);
                } else {
                    console.log('OLLANO order (لم يتم ضبط LEADS_ENDPOINT):', order);
                    onSuccess();
                }
            });
        }

        const doneBtn = document.getElementById('quiz-done');
        if (doneBtn) doneBtn.addEventListener('click', close);

        // open the quiz from any order trigger (and stop the old cart behaviour)
        ['add-to-cart', 'cart-btn', 'mobile-buybar-btn'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                open();
            });
        });
    };

    // ============================================
    // Initialize Everything
    // ============================================
    initQuiz();
    initCountdown();

    initThumbnails();
    initBASlider();
    initStatsCounter();
    initScrollAnimations();
    initAccordions();
    initPricing();
    initSmoothScroll();
    initHeaderScroll();
    initMobileBuybar();
    initUGCVideos();
});
