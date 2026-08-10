/* ==========================================================================
   JavaScript：スクロールフェード ＆ 舞い散るひまわりの花弁＆大輪物理演算
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


    // 2. ひまわりの花吹雪＆ミニひまわりアニメーション
    const canvas = document.getElementById("himawari-canvas");
    const ctx = canvas.getContext("2d");
    let items = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class HimawariItem {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : -30;
            
            // 15%の確率で「まるごと ひまわり大輪」、85%は「黄色い花びら」
            this.isFullFlower = Math.random() < 0.15;

            if (this.isFullFlower) {
                this.size = Math.random() * 12 + 14; // ひまわりの大きさ
            } else {
                this.size = Math.random() * 10 + 8;  // 花びらの長さ
            }

            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            this.oscillation = Math.random() * Math.PI;
            this.oscillationSpeed = Math.random() * 0.03 + 0.01;
            this.opacity = Math.random() * 0.4 + 0.6;
        }

        update() {
            this.y += this.speedY;
            this.oscillation += this.oscillationSpeed;
            this.x += this.speedX + Math.sin(this.oscillation) * 1.2;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 40 || this.x < -30 || this.x > canvas.width + 30) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;

            if (this.isFullFlower) {
                // ひまわりの花全体を描画
                const petalCount = 12;
                // 黄色い花びら
                ctx.fillStyle = "#ffc107";
                for (let i = 0; i < petalCount; i++) {
                    ctx.beginPath();
                    ctx.rotate((Math.PI * 2) / petalCount);
                    ctx.ellipse(0, this.size, this.size * 0.3, this.size * 0.8, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                // 中心の茶色い種部分
                ctx.fillStyle = "#5d4037";
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.55, 0, Math.PI * 2);
                ctx.fill();

            } else {
                // ひまわりの花びら（雫型・黄色〜鮮やかなオレンジ）
                ctx.fillStyle = Math.random() < 0.3 ? "#ff9800" : "#ffc107";
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(
                    -this.size * 0.4, -this.size * 0.5,
                    -this.size * 0.5, this.size * 0.8,
                    0, this.size * 1.3
                );
                ctx.bezierCurveTo(
                    this.size * 0.5, this.size * 0.8,
                    this.size * 0.4, -this.size * 0.5,
                    0, 0
                );
                ctx.fill();
            }

            ctx.restore();
        }
    }

    const itemCount = Math.floor(window.innerWidth < 768 ? 35 : 60);
    for (let i = 0; i < itemCount; i++) {
        items.push(new HimawariItem());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        items.forEach((item) => {
            item.update();
            item.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});