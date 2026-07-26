const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =========================
// Mouse
// =========================

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// =========================
// Stars
// =========================

const STAR_COUNT = 250;
const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {

    stars.push({

        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,

        radius: Math.random() * 2 + 0.3,

        speed: Math.random() * 0.3 + 0.05,

        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.01 + Math.random() * 0.02

    });

}

// =========================
// Shooting Stars
// =========================

const meteors = [];

function spawnMeteor() {

    // Pick a random edge to spawn from
    const side = Math.floor(Math.random() * 3);

    let x, y;

    if (side === 0) {
        // Top edge
        x = Math.random() * canvas.width;
        y = -50;
    }
    else if (side === 1) {
        // Left edge
        x = -50;
        y = Math.random() * canvas.height * 0.4;
    }
    else {
        // Top-left corner region
        x = Math.random() * canvas.width * 0.3;
        y = Math.random() * 150;
    }

    meteors.push({

        x: x,
        y: y,

        vx: 10 + Math.random() * 8,
        vy: 4 + Math.random() * 5,

        length: 150 + Math.random() * 120

    });

    setTimeout(
        spawnMeteor,
        4000 + Math.random() * 10000
    );

}
spawnMeteor();

// =========================
// Animation
// =========================

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // -----------------
    // Normal stars
    // -----------------

    stars.forEach(star => {

        star.twinkle += star.twinkleSpeed;

        const alpha =
            0.3 +
            Math.abs(Math.sin(star.twinkle)) * 0.7;

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(220,235,255,${alpha})`;

        ctx.shadowBlur = 10;
        ctx.shadowColor = "#8DB8FF";

        ctx.fill();

        ctx.shadowBlur = 0;

        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {

            const force =
                (250 - distance) / 250;

            star.x -= dx * force * 0.015;
            star.y -= dy * force * 0.015;

        }

        star.y += star.speed;

        if (star.y > canvas.height) {

            star.y = 0;
            star.x = Math.random() * canvas.width;

        }

    });

    // -----------------
    // Meteors
    // -----------------

    meteors.forEach((meteor, index) => {

        const gradient =
            ctx.createLinearGradient(

                meteor.x,
                meteor.y,

                meteor.x - meteor.length,
                meteor.y - meteor.length * 0.35

            );

        gradient.addColorStop(
            0,
            "rgba(255,255,255,1)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        ctx.beginPath();

        ctx.strokeStyle = gradient;

        ctx.lineWidth = 3;

        ctx.moveTo(
            meteor.x,
            meteor.y
        );

        ctx.lineTo(

            meteor.x - meteor.length,
            meteor.y - meteor.length * 0.35

        );

        ctx.stroke();

        // Glowing head

        ctx.beginPath();

        ctx.arc(
            meteor.x,
            meteor.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "white";

        ctx.shadowBlur = 30;

        ctx.shadowColor = "white";

        ctx.fill();

        ctx.shadowBlur = 0;

        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        if (

            meteor.x > canvas.width + 300 ||
            meteor.y > canvas.height + 300

        ) {

            meteors.splice(index, 1);

        }

    });

    requestAnimationFrame(animate);

}

animate();

// =========================
// Scroll Reveal
// =========================

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

cards.forEach(card=>{

    observer.observe(card);

});

// =========================
// Typewriter
// =========================

const text = `I question things.

Not because I reject answers.

But because good questions are more valuable than easy answers.

Science.
Mathematics.
Programming.
Philosophy.

Welcome to my corner of the universe.`;

const typing = document.getElementById("typing");

if (typing) {

    let i = 0;

    function typeWriter(){

        if(i < text.length){

            typing.innerHTML =
                text.substring(0,i+1) +
                '<span class="cursor"></span>';

            i++;

            setTimeout(typeWriter,35);

        }else{

            typing.innerHTML =
                text +
                '<span class="cursor"></span>';

        }

    }

    const aboutSection = document.querySelector(".about");

    if (aboutSection) {

        const aboutObserver = new IntersectionObserver((entries)=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    typeWriter();

                    aboutObserver.disconnect();

                }

            });

        });

        aboutObserver.observe(aboutSection);

    }

}

// =========================
// Card Tilt Effect
// =========================

const articleCards = document.querySelectorAll(".card");

articleCards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 6;
        const rotateX = -((y / rect.height) - 0.5) * 6;

       card.style.transition = "transform 0.3s ease";

card.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(1000px) rotateX(0) rotateY(0) scale(1)";

    });

}); 



/*
document.querySelectorAll(".article-link").forEach(link=>{

    link.addEventListener("click",function(e){

        e.preventDefault();

        document.body.classList.add("fade-out");

        const url=this.href;

        setTimeout(()=>{

            window.location=url;

        },400);

    });

});
*/