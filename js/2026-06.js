/* ==========================================================================
   JavaScript：スクロールフェード ＆ 儚いネオン花火演出（分離版）
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. スクロールトリガー（IntersectionObserver）
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".story, .card, .end, footer").forEach((el) => {
        el.classList.add("reveal");
        observer.observe(el);
    });


    // 2. インタラクティブ・ネオン花火エンジン
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let fireworkTimers = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class Particle {
        constructor(x, y, color, angle, speed) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = Math.random() * 2 + 1;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.008; // 儚く消える速度
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.04; // 涼しげにサラサラ落ちる重力
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            // ネオン風の発光演出
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    function createFirework() {
        // 画面内のランダムな位置（少し低めから中層）
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.1);
        
        // 「涼しい」を連想させる浅葱色（水色）、ミントグリーン、淡い紫のネオンカラー
        const colors = ["#00f0ff", "#00ffcc", "#b967ff", "#7fffd4"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const count = 45; // 派手すぎず儚い粒子数
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.5 - 0.25);
            const speed = Math.random() * 3 + 1.5;
            particles.push(new Particle(x, y, color, angle, speed));
        }
    }

    function animate() {
        // 残像を残して夏夜の空気感を演出
        ctx.fillStyle = "rgba(2, 4, 10, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();
            if (p.alpha <= 0) {
                particles.splice(index, 1);
            }
        });

        // 定期的に夜空に花火を打ち上げる
        fireworkTimers++;
        if (fireworkTimers % 75 === 0) {
            createFirework();
        }

        requestAnimationFrame(animate);
    }

    // 初期起動
    createFirework();
    animate();
});