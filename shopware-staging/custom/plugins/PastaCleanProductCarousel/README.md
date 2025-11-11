# PastaCleanCarousel - Shopware 6 Plugin

Amazon-style product image carousel plugin for Shopware 6.

Installation:
1. Place the folder `PastaCleanCarousel` into `custom/plugins/`.
2. From project root run:
   - `bin/console plugin:refresh`
   - `bin/console plugin:install --activate PastaCleanCarousel`
   - `bin/console theme:compile`
   - `bin/console cache:clear`


// ==========================================================
// 🆕 SPONSORED BUNDLE SECTION (appears ABOVE bundle)
// ==========================================================
async function initSponsoredBundle() {
    console.log('[Sponsored] 🚀 Initializing Sponsored Bundle Section...');

    const basePath = window.location.pathname.startsWith('/stage/') ? '/stage' : '';
    const API_URL = `${basePath}/store-api/pastaclean-sponsored-bundles`;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'sw-access-key': 'SWSCRQ-ZTD7R2IQ0V-DFPMXI8G', 
                'sw-context-token': localStorage.getItem('sw-context-token') || ''
            }
        });

        if (!res.ok) {
            console.warn('[Sponsored] ❌ Failed to load sponsored products:', res.status);
            return;
        }

        const data = await res.json();
        if (!data?.elements?.length) {
            console.log('[Sponsored] No sponsored products configured.');
            return;
        }

        // Build container
        const sponsored = document.createElement('section');
        sponsored.className = 'pastaclean-sponsored-section';
        sponsored.innerHTML = `
            <div class="container">
                <h2 class="sponsored-title">🌟 Sponsored Products</h2>
                <div class="sponsored-grid"></div>
            </div>
        `;

        const grid = sponsored.querySelector('.sponsored-grid');

        data.elements.forEach(prod => {
            const card = document.createElement('a');
            card.href = prod.seoUrls?.[0]?.seoPathInfo ? `/${prod.seoUrls[0].seoPathInfo}` : '#';
            card.className = 'sponsored-card';
            card.innerHTML = `
                <img src="${prod.cover?.media?.url ?? ''}" alt="${prod.translated?.name ?? prod.name}">
                <div class="sponsored-info">
                    <h3>${prod.translated?.name ?? prod.name}</h3>
                    <p class="price">${prod.calculatedPrice?.unitPrice.toFixed(2)} €</p>
                </div>
            `;
            grid.appendChild(card);
        });

        // Insert above bundle section
        const bundle = document.querySelector('.pastaclean-bundle-container');
        if (bundle && bundle.parentNode) {
            bundle.parentNode.insertBefore(sponsored, bundle);
            console.log('[Sponsored] ✅ Inserted sponsored section above bundle.');
        } else {
            document.querySelector('.product-detail-content')?.prepend(sponsored);
            console.log('[Sponsored] ⚠️ Bundle not found — sponsored added at top.');
        }
    } catch (err) {
        console.error('[Sponsored] 💥 Error loading sponsored bundle:', err);
    }
}


