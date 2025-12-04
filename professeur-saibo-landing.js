/* ============================================
   PROFESSEUR SAIBO - VOYANT MARABOUT
   Landing Page JavaScript
   ============================================ */

// ============================================
// INITIALISATION AU CHARGEMENT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialiser toutes les fonctionnalités
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initScrollToTop();
    initFormValidation();
    initFAQAccordion();
    initWhatsAppTracking();
    
    console.log('✅ Landing page Professeur Saibo initialisée');
});

// ============================================
// MENU MOBILE
// ============================================
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuToggle || !navLinks) return;
    
    // Toggle menu mobile
    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Animation des barres du hamburger
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Fermer le menu au clic sur un lien
    const menuLinks = navLinks.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Fermer le menu au clic en dehors
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ============================================
// SMOOTH SCROLL POUR LES ANCRES
// ============================================
function initSmoothScroll() {
    // Sélectionner tous les liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens vides
            if (href === '#' || href === '#top') {
                if (href === '#top') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculer la position en tenant compte du header fixe
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// ANIMATIONS AU SCROLL (FADE IN)
// ============================================
function initScrollAnimations() {
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Éléments à animer
    const animatedElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .zone-card, .process-step, .faq-item, ' +
        '.about-image, .hero-image, .retour-amour-bloc, .stat-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Afficher/masquer le bouton selon la position de scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Action au clic
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// VALIDATION DU FORMULAIRE DE CONTACT
// ============================================
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const formData = {
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom').value.trim(),
            email: document.getElementById('email').value.trim(),
            telephone: document.getElementById('telephone').value.trim(),
            motif: document.getElementById('motif').value,
            description: document.getElementById('description').value.trim(),
            preference: document.querySelector('input[name="preference"]:checked')?.value,
            paysVille: document.getElementById('pays-ville').value.trim(),
            disponibilites: document.getElementById('disponibilites').value.trim(),
            consent: document.querySelector('input[name="consent"]').checked
        };
        
        // Validation
        let errors = [];
        
        if (!formData.nom) errors.push('Le nom est requis');
        if (!formData.prenom) errors.push('Le prénom est requis');
        if (!formData.email || !isValidEmail(formData.email)) errors.push('Email invalide');
        if (!formData.telephone) errors.push('Le téléphone est requis');
        if (!formData.motif) errors.push('Veuillez sélectionner un motif');
        if (!formData.description || formData.description.length < 20) {
            errors.push('La description doit contenir au moins 20 caractères');
        }
        if (!formData.preference) errors.push('Veuillez sélectionner une préférence de consultation');
        if (!formData.paysVille) errors.push('Le pays/ville est requis');
        if (!formData.consent) errors.push('Vous devez accepter la politique de confidentialité');
        
        // Afficher les erreurs ou soumettre
        if (errors.length > 0) {
            alert('Erreurs dans le formulaire :\n\n' + errors.join('\n'));
            return;
        }
        
        // // Simulation d'envoi (à remplacer par votre logique d'envoi réelle)
        // console.log('📧 Formulaire soumis :', formData);
        
        // // Message de confirmation
        // const confirmationMessage = document.createElement('div');
        // confirmationMessage.className = 'form-confirmation';
        // confirmationMessage.innerHTML = `
        //     <div style="background: linear-gradient(135deg, #28A745, #20803A); color: white; padding: 2rem; border-radius: 10px; text-align: center; margin-top: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.2);">
        //         <h3 style="color: white; margin-bottom: 1rem;">✅ Demande envoyée avec succès !</h3>
        //         <p style="margin-bottom: 1rem;">Merci ${formData.prenom} pour votre demande de consultation.</p>
        //         <p style="margin-bottom: 1rem;">Le Professeur Saibo vous contactera dans les plus brefs délais au <strong>${formData.telephone}</strong>.</p>
        //         <p style="font-size: 0.9rem; opacity: 0.9;">Vous pouvez également le contacter directement :</p>
        //         <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        //             <a href="tel:+33758074616" style="background: white; color: #28A745; padding: 0.75rem 1.5rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">📞 07 58 07 46 16</a>
        //             <a href="https://wa.me/33758074616" target="_blank" style="background: #25D366; color: white; padding: 0.75rem 1.5rem; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block;">💬 WhatsApp</a>
        //         </div>
        //     </div>
        // `;
        
        // // Insérer le message et masquer le formulaire
        // contactForm.style.display = 'none';
        // contactForm.parentElement.insertBefore(confirmationMessage, contactForm.nextSibling);
        
        // // Scroll vers le message de confirmation
        // confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // ============================================
        // ENVOI VIA MAILTO (CLIENT MAIL DU VISITEUR)
        // ============================================

        // Construire le corps de l'email
        const emailBody = `
        NOUVELLE DEMANDE DE CONSULTATION - Professeur Saibo
        ═══════════════════════════════════════════════

        INFORMATIONS DU CONSULTANT :
        ────────────────────────────
        Nom : ${formData.nom}
        Prénom : ${formData.prenom}
        Email : ${formData.email}
        Téléphone : ${formData.telephone}

        DEMANDE :
        ─────────
        Motif de consultation : ${formData.motif}
        Préférence de contact : ${formData.preference || 'Non spécifié'}

        DESCRIPTION DÉTAILLÉE :
        ───────────────────────
        ${formData.description}

        LOCALISATION & DISPONIBILITÉS :
        ────────────────────────────────
        Pays / Ville : ${formData.paysVille}
        Disponibilités : ${formData.disponibilites || 'Non spécifié'}

        ═══════════════════════════════════════════════
        Message envoyé depuis www.professeur-saibo.fr`.trim();

        // Créer le sujet de l'email
        const emailSubject = `Nouvelle consultation : ${formData.motif} - ${formData.nom} ${formData.prenom}`;

        // Encoder pour URL
        const mailtoLink = `mailto:professeursaibo@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        // Ouvrir le client mail
        window.location.href = mailtoLink;

        // Message d'information (car le client mail va s'ouvrir)
        alert(`✅ Votre client mail va s'ouvrir avec votre demande pré-remplie.\n\nVérifiez les informations et cliquez sur "Envoyer" dans votre logiciel de messagerie.\n\nSi le client mail ne s'ouvre pas, contactez directement :\n📞 07 58 07 46 16\n💬 WhatsApp disponible`);





        
        // Tracking (optionnel - Google Analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Contact',
                event_label: formData.motif
            });
        }
    });
}

// Fonction helper pour valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// FAQ ACCORDÉON (déjà géré par HTML details/summary)
// ============================================
function initFAQAccordion() {
    // Les éléments <details> gèrent déjà l'accordéon nativement
    // On peut ajouter un comportement personnalisé si nécessaire
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('toggle', function() {
            if (this.open) {
                // Fermer les autres items (accordéon exclusif)
                faqItems.forEach(otherItem => {
                    if (otherItem !== this && otherItem.open) {
                        otherItem.open = false;
                    }
                });
                
                // PAS de scroll automatique pour éviter les conflits
                // L'utilisateur reste où il est
            }
        });
    });
}

// ============================================
// TRACKING WHATSAPP (optionnel)
// ============================================
function initWhatsAppTracking() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('📱 Clic WhatsApp détecté');
            
            // Tracking Google Analytics (si disponible)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    event_category: 'Contact',
                    event_label: 'WhatsApp'
                });
            }
        });
    });
}

// ============================================
// PARALLAX LÉGER SUR LE HERO (optionnel)
// ============================================
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        // Appliquer l'effet parallax
        heroSection.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    });
}

// ============================================
// GESTION DES LIENS TÉLÉPHONE (tracking)
// ============================================
function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('📞 Clic téléphone détecté');
            
            // Tracking Google Analytics (si disponible)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    event_category: 'Contact',
                    event_label: 'Téléphone'
                });
            }
        });
    });
}

// Initialiser le tracking des liens téléphone
document.addEventListener('DOMContentLoaded', function() {
    initPhoneTracking();
});

// ============================================
// GESTION DU HEADER STICKY (changement d'opacité au scroll)
// ============================================
function initStickyHeader() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        }
    });
}

// Initialiser le header sticky
document.addEventListener('DOMContentLoaded', function() {
    initStickyHeader();
});

// ============================================
// LAZY LOADING DES IMAGES (si pas de support natif)
// ============================================
function initLazyLoading() {
    // Vérifier si le navigateur supporte le lazy loading natif
    if ('loading' in HTMLImageElement.prototype) {
        // Support natif, rien à faire
        return;
    }
    
    // Polyfill pour les navigateurs anciens
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialiser le lazy loading
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
});

// ============================================
// DÉTECTION DE LA GÉOLOCALISATION (optionnel)
// ============================================
function detectUserLocation() {
    // Cette fonction peut être utilisée pour pré-remplir le champ pays/ville
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('📍 Position détectée:', position.coords.latitude, position.coords.longitude);
                // Ici, vous pourriez utiliser une API de géocodage inverse
                // pour obtenir le nom de la ville
            },
            function(error) {
                console.log('❌ Géolocalisation refusée ou indisponible');
            }
        );
    }
}

// ============================================
// ANIMATION DU SCROLL INDICATOR
// ============================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (!scrollIndicator) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
    });
}

// Initialiser le scroll indicator
document.addEventListener('DOMContentLoaded', function() {
    initScrollIndicator();
});

// ============================================
// COPIE DU NUMÉRO DE TÉLÉPHONE AU CLIC
// ============================================
function initPhoneCopy() {
    const phoneNumbers = document.querySelectorAll('.method-number, .number-value, .footer-phone');
    
    phoneNumbers.forEach(element => {
        element.style.cursor = 'pointer';
        element.title = 'Cliquez pour copier le numéro';
        
        element.addEventListener('click', function() {
            const phone = this.textContent.trim();
            
            // Copier dans le presse-papier
            if (navigator.clipboard) {
                navigator.clipboard.writeText(phone).then(function() {
                    // Feedback visuel
                    const originalText = element.textContent;
                    element.textContent = '✅ Copié !';
                    element.style.color = '#28A745';
                    
                    setTimeout(function() {
                        element.textContent = originalText;
                        element.style.color = '';
                    }, 2000);
                }).catch(function(err) {
                    console.error('Erreur de copie:', err);
                });
            }
        });
    });
}

// Initialiser la copie du téléphone
document.addEventListener('DOMContentLoaded', function() {
    initPhoneCopy();
});

// ============================================
// GESTION DES ERREURS GLOBALES
// ============================================
window.addEventListener('error', function(e) {
    console.error('❌ Erreur JavaScript:', e.message);
    // Ne pas afficher d'erreur à l'utilisateur en production
});

// ============================================
// CONSOLE LOG STYLISÉ (désactiver en production)
// ============================================
console.log(
    '%c🔮 Professeur Saibo - Voyant Marabout',
    'color: #D4AF37; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);'
);
console.log(
    '%c📞 Téléphone & WhatsApp : 07 58 07 46 16',
    'color: #25D366; font-size: 14px; font-weight: bold;'
);

// ============================================
// EXPORT POUR UTILISATION EXTERNE (si nécessaire)
// ============================================
window.ProfesseurSaibo = {
    version: '1.0',
    initMobileMenu,
    initSmoothScroll,
    initScrollAnimations,
    initScrollToTop,
    initFormValidation
};
