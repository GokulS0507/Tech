/**
 * TechDeals India - Robust Single Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const dropdownContent = document.getElementById('dynamic-dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');

    // Comprehensive Fallback Data
    const fallbackCategories = [
        { name: "Audio", links: [{ label: "TWS Earbuds", url: "#earbuds" }, { label: "Neckbands", url: "#" }, { label: "Headphones", url: "#" }, { label: "Speakers", url: "#" }] },
        { name: "Wearables", links: [{ label: "Smartwatches", url: "#smartwatch" }, { label: "Fitness Bands", url: "#" }, { label: "VR Headsets", url: "#" }] },
        { name: "Fashion", links: [{ label: "Dresses", url: "#dresses" }, { label: "Men's Wear", url: "#" }, { label: "Shoes", url: "#" }, { label: "Watches", url: "#" }] },
        { name: "Sports", links: [{ label: "Cricket Gear", url: "#sports" }, { label: "Gym Equipment", url: "#sports" }, { label: "Yoga Mats", url: "#sports" }, { label: "Cycling", url: "#" }] },
        { name: "Computing", links: [{ label: "Laptops", url: "#" }, { label: "Monitors", url: "#" }, { label: "Tablets", url: "#" }, { label: "Printers", url: "#" }] },
        { name: "Mobile Acc.", links: [{ label: "Power Banks", url: "#powerbank" }, { label: "Fast Chargers", url: "#" }, { label: "Cables", url: "#" }, { label: "Cases", url: "#" }] },
        { name: "Home & Kitchen", links: [{ label: "Smart TVs", url: "#" }, { label: "Kitchen Appliances", url: "#" }, { label: "Security Cams", url: "#" }, { label: "Smart Bulbs", url: "#" }] },
        { name: "Gaming", links: [{ label: "Consoles", url: "#" }, { label: "Gaming Mice", url: "#" }, { label: "PC Parts", url: "#" }] }
    ];

    async function initCategories() {
        try {
            // Attempt to fetch fresh data
            const response = await fetch(`navigation.json?cb=${Date.now()}`);
            if (!response.ok) throw new Error("Fetch failed");
            const data = await response.json();
            
            if (data && data.sections) {
                renderDropdown(data.sections);
            } else {
                renderDropdown(fallbackCategories);
            }
        } catch (err) {
            console.warn("Loading fallback categories:", err);
            renderDropdown(fallbackCategories);
        }
    }

    function renderDropdown(sections) {
        if (!dropdownContent) return;
        
        const gridHtml = sections.map(sec => `
            <div class="dropdown-col">
                <h4>${sec.name}</h4>
                ${sec.links.map(link => `<a href="${link.url}">${link.label}</a>`).join('')}
            </div>
        `).join('');

        dropdownContent.innerHTML = `<div class="dropdown-grid">${gridHtml}</div>`;
        attachScrollListeners();
    }

    function attachScrollListeners() {
        const navLinks = document.querySelectorAll('.nav-links a, .logo, .dropdown-content a');

        navLinks.forEach(link => {
            link.onclick = (e) => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 70,
                            behavior: 'smooth'
                        });
                        // Close dropdown on mobile after click
                        if (dropdown) dropdown.classList.remove('active');
                    }
                }
            };
        });
    }

    // Toggle dropdown on mobile click
    if (dropbtn && dropdown) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    initCategories();

    // Scroll Observer for active states
    const sections = document.querySelectorAll('section[id]');
    window.onscroll = () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a, .dropdown-content a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });

        // Toggle header background on scroll
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
});
