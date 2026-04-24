document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    const dropdownContent = document.getElementById('dynamic-dropdown-content');

    // 1. Fetch and Render Navigation Dropdown
    fetch('navigation.json')
        .then(res => res.json())
        .then(data => {
            renderDropdown(data.sections);
        })
        .catch(err => console.error("Nav load failed:", err));

    // 2. Fetch and Render Products
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            renderProducts(data.items);
        })
        .catch(err => {
            console.error("Products load failed:", err);
            mainContent.innerHTML = '<p style="text-align:center; padding: 50px;">No products found. Add some in the admin panel!</p>';
        });

    function renderDropdown(sections) {
        if (!dropdownContent) return;
        dropdownContent.innerHTML = sections.map(section => `
            <div class="dropdown-col">
                <h4>${section.name}</h4>
                ${section.links.map(link => `<a href="${link.url}">${link.label}</a>`).join('')}
            </div>
        `).join('');
    }

    function renderProducts(items) {
        if (!items || items.length === 0) return;

        // Group products by category
        const categories = [...new Set(items.map(item => item.category))];
        
        mainContent.innerHTML = categories.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            const displayTitle = cat.charAt(0).toUpperCase() + cat.slice(1);
            
            return `
                <section id="${cat}" style="padding: 60px 0;">
                    <div class="container">
                        <h2 style="text-align: center; margin-bottom: 40px;">Best ${displayTitle} Deals</h2>
                        <div class="product-grid">
                            ${catItems.map(item => `
                                <div class="product-card">
                                    <div class="product-image-wrap">
                                        <img src="${item.image}" alt="${item.title}">
                                    </div>
                                    <div class="product-content">
                                        <h3 class="product-title">${item.title}</h3>
                                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">${item.desc}</p>
                                        <div class="product-price">${item.price}</div>
                                        <div class="cta-group" style="margin-top: 20px;">
                                            <a href="${item.amazon}" target="_blank" class="btn btn-amazon">Buy on Amazon</a>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            `;
        }).join('');
    }

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
