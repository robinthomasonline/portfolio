// Typing Effect
const texts = [
    "Enterprenuer",
    "GRC Consultant",
    "Infrastructure Consultant",
    "IT Specialist",
    "Business Consultant",
    "Security Specialist",
    "Software Developer",
    "Network Administrator",
    "System Administrator",
    "Cloud Engineer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;
let erasingDelay = 100;
let newTextDelay = 2000;

function isVowel(char) {
    return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
}

function updateStaticText(word) {
    const staticText = document.querySelector('.static-text');
    if (word && isVowel(word[0])) {
        staticText.textContent = 'I am an';
    } else {
        staticText.textContent = 'I am a';
    }
}

function typeEffect() {
    const currentRole = texts[roleIndex];
    const typingText = document.getElementById('typing-text');
    
    if (isDeleting) {
        // Remove characters
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = erasingDelay;
    } else {
        // Add characters
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 200;
    }

    // Update static text based on the current word
    updateStaticText(currentRole);

    // If word is complete
    if (!isDeleting && charIndex === currentRole.length) {
        // Make pause at end
        typingDelay = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        // Move to next word
        roleIndex = (roleIndex + 1) % texts.length;
        typingDelay = 500;
    }

    setTimeout(typeEffect, typingDelay);
}

// Start the typing effect
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with the first word
    updateStaticText(texts[0]);
    setTimeout(typeEffect, newTextDelay);
});

// Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const closeIcon = document.querySelector('.close-icon');
const socialIcons = document.querySelector('.social-icons');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('open');
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = 'var(--nav-height)';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.padding = '1rem';
        navLinks.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        navLinks.style.backdropFilter = 'blur(10px)';
        if (socialIcons) {
            socialIcons.style.display = 'flex';
            socialIcons.style.justifyContent = 'center';
            socialIcons.style.padding = '1rem';
            socialIcons.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            socialIcons.style.backdropFilter = 'blur(10px)';
        }
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        navLinks.style.display = 'none';
        if (socialIcons) {
            socialIcons.style.display = 'none';
        }
        menuOpen = false;
    }
});

// Close menu when close icon is clicked
if (closeIcon) {
    closeIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menuOpen) {
            menuBtn.classList.remove('open');
            navLinks.style.display = 'none';
            menuOpen = false;
        }
    });
}

// Close menu when a nav link is clicked (mobile only)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && menuOpen) {
            menuBtn.classList.remove('open');
            navLinks.style.display = 'none';
            menuOpen = false;
        }
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (menuOpen) {
                menuBtn.click();
            }
        }
    });
});

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    } else {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }
});

// Experience Section - View More
document.addEventListener('DOMContentLoaded', function() {
    const viewMoreBtn = document.querySelector('.view-more-btn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function() {
            const timeline = document.querySelector('.timeline');
            
            // Create and append additional experience items
            const additionalExperience = [
                {
                    title: 'Internal System/Server Administrator',
                    company: 'Poornam Info Vision Pvt Ltd',
                    duration: 'May 2017 – Nov 2019',
                    responsibilities: [
                        'Secured servers and network infrastructure',
                        'Conducted vulnerability and risk assessments',
                        'Managed server access control and monitoring',
                        'Performed security testing and audits',
                        'Implemented high-availability solutions'
                    ]
                },
                {
                    title: 'Server Administrator',
                    company: 'Aforeserve.com Ltd',
                    duration: 'Oct 2015 – May 2017',
                    responsibilities: [
                        'Managed Linux and Windows servers',
                        'Implemented backup and recovery solutions',
                        'Conducted system monitoring and optimization',
                        'Provided technical support and documentation',
                        'Maintained security measures and compliance'
                    ]
                },
                {
                    title: 'Technical Support Engineer',
                    company: 'Team Computers Pvt Ltd',
                    duration: 'Mar 2015 – Oct 2015',
                    responsibilities: [
                        'Configured workstations and software',
                        'Provided technical support to end-users',
                        'Managed user accounts and permissions',
                        'Conducted system maintenance and updates',
                        'Documented technical procedures'
                    ]
                }
            ];

            additionalExperience.forEach(exp => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.style.opacity = '0';
                timelineItem.style.transform = 'translateY(20px)';

                timelineItem.innerHTML = `
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h3>${exp.title}</h3>
                            <span class="company">${exp.company}</span>
                            <span class="duration">${exp.duration}</span>
                        </div>
                        <ul class="responsibilities">
                            ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                `;

                timeline.appendChild(timelineItem);

                // Animate the new item
                setTimeout(() => {
                    timelineItem.style.transition = 'all 0.5s ease';
                    timelineItem.style.opacity = '1';
                    timelineItem.style.transform = 'translateY(0)';
                }, 100);
            });

            // Hide the button after showing all experience
            viewMoreBtn.style.display = 'none';
        });
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        // Disable submit button and show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        // Here you would typically send the data to your backend
        // For now, we'll simulate a submission
        setTimeout(() => {
            // Reset form
            e.target.reset();
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    });
}

// Add smooth scrolling for contact links
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Don't prevent default for actual links (email, phone, etc.)
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Cursor Effect
const cursor = document.querySelector('.cursor-effect');
const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .business-card, .expertise-card, .contact-link, input, textarea');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
});

document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
});

// Disable cursor effect on mobile devices
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// Hide scroll indicator when scrolling starts
const scrollIndicator = document.querySelector('.scroll-indicator');
let scrollTimeout;

window.addEventListener('scroll', () => {
    // Hide the scroll indicator immediately when scrolling starts
    scrollIndicator.style.opacity = '0';
    
    // Clear the previous timeout
    clearTimeout(scrollTimeout);
    
    // Show the scroll indicator again after scrolling stops for 2 seconds
    scrollTimeout = setTimeout(() => {
        scrollIndicator.style.opacity = '0.8';
    }, 2000);
}); 