/* ==========================================================================
   JavaScript：スクロールフェード ＆ 流星（Shooting Star）エンジン (js/2026-08.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. スクロールトリガー
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".story, .end, footer").forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
    });


    // 2. 流星＆星屑Canvasエンジン
    const canvas = document.getElementById("star-canvas");
    const ctx = canvas.getContext("2d");
    let stars = [];
    let shootingStars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars();
    }
    window.addEventListener("resize", resize);

    // 静止星屑の初期化
    function initStars() {
        stars = [];
        for (let i = 0; i < 70; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.01 + 0.005
            });
        }
    }

    // 流星クラス
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width * 1.2;
            this.y = -50;
            this.length = Math.random() * 80 + 40;
            this.speed = Math.random() * 6 + 4;
            this.size = Math.random() * 1.5 + 1;
            this.alpha = 1;
            this.active = true;
        }

        update() {
            this.x -= this.speed;
            this.y += this.speed * 0.6;
            this.alpha -= 0.01;

            if (this.y > canvas.height + 100 || this.x < -100 || this.alpha <= 0) {
                this.active = false;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            
            // 彗星の尾（グラデーション）
            const grad = ctx.createLinearGradient(
                this.x, this.y, 
                this.x + this.length, this.y - this.length * 0.6
            );
            grad.addColorStop(0, "rgba(56, 189, 248, 1)");
            grad.addColorStop(1, "rgba(56, 189, 248, 0)");

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = this.size;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length, this.y - this.length * 0.6);
            ctx.stroke();

            ctx.restore();
        }
    }

    resize();

    // 定期的にながれ星を生成
    setInterval(() => {
        if (Math.random() < 0.6) {
            shootingStars.push(new ShootingStar());
        }
    }, 1500);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 星屑の瞬き描画
        stars.forEach((star) => {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.2) {
                star.speed = -star.speed;
            }
            ctx.save();
            ctx.globalAlpha = star.alpha;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // 流星の描画と更新
        shootingStars.forEach((star, index) => {
            if (star.active) {
                star.update();
                star.draw();
            } else {
                shootingStars.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
});