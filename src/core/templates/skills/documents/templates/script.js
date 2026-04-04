document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const navLinks = document.querySelectorAll('.sidebar ul li a');

    // Toggle Sidebar
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Smooth Scroll and Active Link Highlight
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Update URL hash
                history.pushState(null, null, `#${targetId}`);
                
                // Close sidebar on mobile after click
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });

    // Simple Scroll Spy
    window.addEventListener('scroll', () => {
        let current = "";
        const sections = document.querySelectorAll("section[id]");
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop - 60) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.parentElement.classList.remove("active");
            if (link.getAttribute("href").substring(1) === current) {
                link.parentElement.classList.add("active");
            }
        });
    });
});
