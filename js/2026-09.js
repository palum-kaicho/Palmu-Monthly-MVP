document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. スクロールフェード
       ========================================================= */

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    document
        .querySelectorAll(".story, .moon-quote, .identity-call, .end, footer")
        .forEach((el) => {
            el.classList.add("reveal");
            observer.observe(el);
        });


    /* =========================================================
       2. 月明かり Canvas
       ========================================================= */

    const canvas = document.getElementById("moon-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let particles = [];
    let glimmers = [];


    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        initParticles();
    }

    window.addEventListener("resize", resize);


    /* =========================================================
       3. 月明かりの粒子（サイズと不透明度を視認しやすく調整）
       ========================================================= */

    function initParticles() {

        particles = [];

        const count = Math.min(
            85,
            Math.floor(
                (canvas.width * canvas.height) / 16000
            )
        );

        for (let i = 0; i < count; i++) {

            particles.push({

                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,

                // 半径を少し拡大（見やすくするため）
                radius: Math.random() * 2.0 + 1.0,

                // 不透明度をアップ
                alpha: Math.random() * 0.45 + 0.15,

                speedY: Math.random() * 0.18 + 0.04,

                speedX: (Math.random() - 0.5) * 0.08,

                pulse: Math.random() * 0.006 + 0.002,

                direction: Math.random() > 0.5 ? 1 : -1

            });

        }
    }


    /* =========================================================
       4. ときどき輝く月光
       ========================================================= */

    class Glimmer {

        constructor() {
            this.reset();
        }

        reset() {

            this.x = Math.random() * canvas.width;

            this.y = Math.random() * canvas.height;

            this.radius = Math.random() * 2.2 + 1.0;

            this.alpha = 0;

            this.maxAlpha = Math.random() * 0.45 + 0.25;

            this.life = 0;

            this.maxLife = Math.random() * 100 + 100;

            this.active = true;

        }


        update() {

            this.life++;

            const progress = this.life / this.maxLife;


            if (progress < 0.5) {

                this.alpha = this.maxAlpha * (progress / 0.5);

            } else {

                this.alpha = this.maxAlpha * ((1 - progress) / 0.5);

            }


            if (this.life >= this.maxLife) {
                this.active = false;
            }

        }


        draw() {

            ctx.save();

            ctx.globalAlpha = this.alpha;


            const gradient = ctx.createRadialGradient(
                this.x,
                this.y,
                0,
                this.x,
                this.y,
                this.radius * 8
            );


            gradient.addColorStop(
                0,
                "rgba(255, 248, 220, 1)"
            );

            gradient.addColorStop(
                0.3,
                "rgba(235, 211, 145, 0.8)"
            );

            gradient.addColorStop(
                1,
                "rgba(235, 211, 145, 0)"
            );


            ctx.fillStyle = gradient;

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.radius * 8,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();

        }

    }


    /* =========================================================
       5. 粒子描画
       ========================================================= */

    function drawParticles() {

        particles.forEach((particle) => {

            particle.y -= particle.speedY;

            particle.x += particle.speedX;


            if (particle.y < -20) {

                particle.y = canvas.height + 20;

                particle.x = Math.random() * canvas.width;

            }


            if (particle.x < -20) {

                particle.x = canvas.width + 20;

            }


            if (particle.x > canvas.width + 20) {

                particle.x = -20;

            }


            /* 明滅の更新 */

            particle.alpha += particle.pulse * particle.direction;


            if (particle.alpha > 0.60 || particle.alpha < 0.10) {

                particle.direction *= -1;

            }


            ctx.save();

            ctx.globalAlpha = particle.alpha;


            const gradient = ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                particle.radius * 5
            );


            gradient.addColorStop(
                0,
                "rgba(255, 250, 225, 1)"
            );

            gradient.addColorStop(
                0.4,
                "rgba(232, 198, 106, 0.7)"
            );

            gradient.addColorStop(
                1,
                "rgba(232, 198, 106, 0)"
            );


            ctx.fillStyle = gradient;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius * 5,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();

        });

    }


    /* =========================================================
       6. 月光をランダム生成
       ========================================================= */

    setInterval(() => {

        if (Math.random() < 0.60) {

            glimmers.push(
                new Glimmer()
            );

        }

    }, 1000);


    /* =========================================================
       7. スクロールによる月の微移動
       ========================================================= */

    const moon = document.querySelector(".moon");


    function moveMoon() {

        if (!moon) return;

        const scrollY = window.scrollY;

        const offset = Math.min(
            scrollY * 0.035,
            55
        );

        moon.style.transform = `translateY(${offset}px)`;

    }


    window.addEventListener(
        "scroll",
        moveMoon,
        {
            passive: true
        }
    );


    /* =========================================================
       8. メインアニメーション
       ========================================================= */

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        drawParticles();


        glimmers.forEach(
            (glimmer, index) => {

                if (glimmer.active) {

                    glimmer.update();
                    glimmer.draw();

                } else {

                    glimmers.splice(
                        index,
                        1
                    );

                }

            }
        );


        requestAnimationFrame(
            animate
        );

    }


    /* =========================================================
       START
       ========================================================= */

    resize();

    initParticles();

    moveMoon();

    animate();

});