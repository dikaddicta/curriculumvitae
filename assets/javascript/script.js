
/*--------------------------- Page Loader --------------------------------*/
$(function () {
    setTimeout(() => {
        $('.page-loader').fadeOut('slow');
    }, 500);
});

/*----------------------------- Typing Text Js --------------------*/
$(document).on('DOMContentLoaded', function () {
    window.ityped.init(document.querySelector('.ityped'), {
        strings: ['Project Management', 'Business Development', 'IT Support', 'IT Engineer'],
        loop: true
    });
});

/*----------------------------- Dark/ Light Mode Toggle --------------------*/
function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");

    var sunIcon = document.getElementById("sunIcon");
    var moonIcon = document.getElementById("moonIcon");

    if (element.classList.contains("dark-mode")) {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
        localStorage.setItem("mode", "dark");
    } else {
        moonIcon.classList.add("hidden");
        sunIcon.classList.remove("hidden");
        localStorage.setItem("mode", "light");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const storedMode = localStorage.getItem("mode");
    if (storedMode === "dark") {
        document.body.classList.add("dark-mode");
        var sunIcon = document.getElementById("sunIcon");
        var moonIcon = document.getElementById("moonIcon");
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
    }
});

/*----------------------- Whole Page Scrolling Animation -----------------------------*/
const observer3 = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
        target.classList.toggle('show', isIntersecting);
    });
});

const hiddenElements = document.querySelectorAll('.fade_up, .fade_down, .zoom_in, .zoom_out, .fade_right, .fade_left, .flip_left, .flip_right, .flip_up, .flip_down');

document.addEventListener('DOMContentLoaded', () => {
    hiddenElements.forEach((el) => observer3.observe(el));
});



/*----------------------- Side Menu Toggle Responsive -----------------------------*/
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar-menu-main');
const overlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-list-ul a');
const sections = document.querySelectorAll('.panel[id]');

/* ---------- MENU OPEN / CLOSE ---------- */
function closeMenu() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
}

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
});

overlay.addEventListener('click', closeMenu);

/* ---------- CLOSE MENU ON LINK CLICK ---------- */
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        closeMenu();
    });
});

/* ---------- ACTIVE MENU ON SCROLL (NO % LOGIC) ---------- */
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                menuLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    },
    {
        root: null,
        rootMargin: "-100px 0px -60% 0px" 
    }
);

sections.forEach(section => observer.observe(section));




// ------------------ Testimonials Slider with Client Image Sync ---------------
const swiper = new Swiper(".testimonials-slider", {
    loop: true,
    speed: 1000,
    autoplay: {
        delay: 5000,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    on: {
        slideChangeTransitionEnd() {
            syncClientImages(this);
        }
    }
});

/* ---------- INITIAL SYNC ---------- */
syncClientImages(swiper);

/* ---------- SYNC ACTIVE CLIENT IMAGE ---------- */
function syncClientImages(swiperInstance) {
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    if (!activeSlide) return;

    const activeImg = activeSlide.querySelector('.feedbackPersonImg');
    if (!activeImg) return;

    const activeSrc = activeImg.getAttribute('src');

    document
        .querySelectorAll('.client-images-gp img')
        .forEach(img => {
            img.classList.toggle(
                'active',
                img.getAttribute('src') === activeSrc
            );
        });
}

/* ---------- THUMB CLICK (EVENT DELEGATION) ---------- */
const clientImagesWrapper = document.querySelector('.client-images-gp');

clientImagesWrapper.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;

    const index = [...clientImagesWrapper.children].indexOf(img);
    if (index === -1) return;

    swiper.slideToLoop(index);
});


/*------------------------------------- Skill Bar -------------------------------------*/
const skillSection = document.getElementById('skills');
let activated = false;

const observer2 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !activated) {
            activated = true;

            document.querySelectorAll('.progresbar-counter').forEach(item => {
                const percent = item.dataset.percent;
                item.style.setProperty('--percent', percent + '%');
                item.classList.add('active');

                const count = item.querySelector('.count');
                let current = 0;
                const interval = setInterval(() => {
                    current++;
                    count.innerText = current;
                    if (current >= percent) clearInterval(interval);
                }, 20);
            });
        }
    });
}, { threshold: 0.4 });

observer2.observe(skillSection);

/*------------------------------------- Dots Skill Bar -------------------------------------*/
document.addEventListener('DOMContentLoaded', initSkills);

function initSkills() {
    const skills = document.querySelectorAll('.skill');
    if (!skills.length) return;

    const DOTS_COUNT = 10;

    skills.forEach(skill => createDots(skill, DOTS_COUNT));

    if (!('IntersectionObserver' in window)) {
        skills.forEach(skill => animateSkill(skill, DOTS_COUNT));
        return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
        threshold: 0.6
    });

    skills.forEach(skill => observer.observe(skill));

    function handleIntersect(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            animateSkill(entry.target, DOTS_COUNT);
            observer.unobserve(entry.target);
        });
    }
}

function createDots(skill, count) {
    const dotsContainer = skill.querySelector('.dots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }
}

function animateSkill(skill, dotsCount) {
    const percent = Number(skill.dataset.percent);
    if (isNaN(percent)) return;

    const dots = skill.querySelectorAll('.dot');
    const countSpan = skill.querySelector('.count');
    if (!countSpan || !dots.length) return;

    const activeDots = Math.round((percent / 100) * dotsCount);

    dots.forEach((dot, index) => {
        setTimeout(() => {
            dot.classList.toggle('active', index < activeDots);
        }, index * 100);
    });

    animateCounter(countSpan, percent);
}

function animateCounter(el, target) {
    let current = 0;

    const interval = setInterval(() => {
        current++;
        el.textContent = `${current}%`;

        if (current >= target) clearInterval(interval);
    }, 15);
}

/*------------------------------------- Skill Bar Circular -------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    const progressItems = document.querySelectorAll(".progress-item");
    const colors = ['#bce70c', '#ff759c', '#00cc97', '#ffdb59', '#6f39fd'];

    progressItems.forEach((item, index) => {
        const skillName = item.getAttribute("data-skill");
        const skillLabel = document.createElement("div");
        skillLabel.className = "skill-label";
        skillLabel.textContent = skillName;

        item.appendChild(skillLabel);

        const color = colors[index % colors.length];
        item.style.background = `conic-gradient(${color} 0%, #EDF0F4 0%)`;
    });

    const progressSection = document.querySelector("#progress");
    const observerOptions = { threshold: 0.3 };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                progressItems.forEach((item, index) => {
                    const skillValue = parseInt(item.getAttribute("data-value"));
                    const color = colors[index % colors.length];
                    let count = 0;
                    const interval = setInterval(() => {
                        if (count >= skillValue) {
                            clearInterval(interval);
                        } else {
                            count++;
                            item.style.background = `conic-gradient(${color} ${count}%, #EDF0F4 ${count}%)`;
                            item.setAttribute("data-value", count);
                        }
                    }, 20);
                });
                observer.unobserve(progressSection);
            }
        });
    }, observerOptions);
    observer.observe(progressSection);
});