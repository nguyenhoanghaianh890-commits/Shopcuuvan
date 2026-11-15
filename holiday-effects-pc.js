/**
 * Vietnamese & Seasonal Holiday Visual Effects Engine (PC Only)
 * Ultra-smooth 60fps HTML5 Canvas 3D particle system + SVG ornaments
 */
(function () {
    'use strict';

    function isDesktopPC() {
        if (window.innerWidth < 992) return false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return false;
        return true;
    }

    function detectAutoHoliday() {
        var now = new Date();
        var m = now.getMonth() + 1; // 1..12
        var d = now.getDate();

        // Valentine 14/2
        if (m === 2 && d >= 12 && d <= 15) return 'phu_nu';
        // Tet Nguyen Dan / Spring (Jan - Feb)
        if (m === 1 || m === 2) return 'tet';
        // 8/3 International Women's Day
        if (m === 3 && d >= 5 && d <= 10) return 'phu_nu';
        // Gio To Hung Vuong (April early-mid)
        if (m === 4 && d >= 1 && d <= 22) return 'gio_to';
        // 30/4 - 1/5 Reunification & Labor Day
        if ((m === 4 && d >= 25) || (m === 5 && d <= 3)) return 'quoc_khanh';
        // National Day 2/9
        if ((m === 8 && d >= 28) || (m === 9 && d <= 5)) return 'quoc_khanh';
        // Mid-Autumn Festival (Sep - early Oct)
        if (m === 9 || (m === 10 && d <= 6)) return 'trung_thu';
        // Vietnamese Women's Day 20/10
        if (m === 10 && d >= 17 && d <= 21) return 'phu_nu';
        // Halloween (late Oct - Nov 2)
        if ((m === 10 && d >= 22) || (m === 11 && d <= 2)) return 'halloween';
        // Christmas / New Year (Dec)
        if (m === 12) return 'noel';

        return 'summer';
    }

    var currentEffectInstance = null;

    function initHolidayEffects(mode) {
        if (currentEffectInstance && typeof currentEffectInstance.destroy === 'function') {
            currentEffectInstance.destroy();
            currentEffectInstance = null;
        }

        if (!mode || mode === 'off') return;
        if (!isDesktopPC()) return;

        var activeTheme = (mode === 'auto') ? detectAutoHoliday() : mode;

        // Create container
        var container = document.createElement('div');
        container.id = 'vn-holiday-effects-layer';
        container.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden;';

        var styleTag = document.createElement('style');
        styleTag.textContent = [
            '@media (max-width: 991.98px) { #vn-holiday-effects-layer { display: none !important; } }',
            '@keyframes vnSwing { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }',
            '@keyframes vnFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }',
            '@keyframes vnPulseGlow { 0%,100% { filter: drop-shadow(0 0 8px rgba(255,190,0,0.65)); } 50% { filter: drop-shadow(0 0 18px rgba(255,120,0,0.95)); } }',
            '@keyframes vnBulbBlink { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.92); } }',
            '.vn-corner-ornament { position: fixed; top: 0; pointer-events: none; z-index: 9999; transform-origin: top center; }',
            '.vn-corner-left { left: 18px; animation: vnSwing 4.5s ease-in-out infinite; }',
            '.vn-corner-right { right: 18px; animation: vnSwing 5s ease-in-out infinite reverse; }'
        ].join('\n');
        container.appendChild(styleTag);

        // Add thematic corner ornaments (PC only)
        var ornamentHtml = getCornerOrnamentHTML(activeTheme);
        if (ornamentHtml) {
            var ornamentWrap = document.createElement('div');
            ornamentWrap.innerHTML = ornamentHtml;
            container.appendChild(ornamentWrap);
        }

        var canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
        container.appendChild(canvas);
        document.body.appendChild(container);

        var ctx = canvas.getContext('2d');
        var width = canvas.width = window.innerWidth;
        var height = canvas.height = window.innerHeight;
        var mouseX = width * 0.5;
        var mouseY = height * 0.5;
        var windTarget = 0;
        var windCurrent = 0;
        var animId = null;
        var isDestroyed = false;

        function onResize() {
            if (!isDesktopPC()) {
                canvas.style.display = 'none';
                return;
            }
            canvas.style.display = 'block';
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function onMouseMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            windTarget = ((e.clientX / Math.max(1, width)) - 0.5) * 1.2;
        }

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Build particles & fireworks depending on theme
        var particles = [];
        var fireworks = [];
        var sparks = [];
        var tick = 0;

        var particleCount = getParticleCount(activeTheme);
        for (var i = 0; i < particleCount; i++) {
            particles.push(createParticle(activeTheme, width, height, true));
        }

        function loop() {
            if (isDestroyed) return;
            animId = requestAnimationFrame(loop);
            if (document.hidden || !isDesktopPC()) return;

            tick++;
            windCurrent += (windTarget - windCurrent) * 0.03;
            ctx.clearRect(0, 0, width, height);

            // Fireworks for Tet & Quoc Khanh
            if (activeTheme === 'quoc_khanh' || activeTheme === 'tet') {
                var fwChance = (activeTheme === 'quoc_khanh') ? 0.028 : 0.015;
                if (Math.random() < fwChance && fireworks.length < 4) {
                    fireworks.push(createFirework(width, height, activeTheme));
                }
                updateAndDrawFireworks(ctx, fireworks, sparks, width, height);
            }

            // Update & draw main particles
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                updateParticle(p, activeTheme, width, height, tick, windCurrent, mouseX, mouseY);
                drawParticle(ctx, p, activeTheme, tick);
            }
        }

        animId = requestAnimationFrame(loop);

        currentEffectInstance = {
            destroy: function () {
                isDestroyed = true;
                if (animId) cancelAnimationFrame(animId);
                window.removeEventListener('resize', onResize);
                window.removeEventListener('mousemove', onMouseMove);
                if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            }
        };
    }

    function getParticleCount(theme) {
        switch (theme) {
            case 'tet': return 42;
            case 'trung_thu': return 32;
            case 'quoc_khanh': return 45;
            case 'halloween': return 30;
            case 'noel': return 65;
            case 'gio_to': return 36;
            case 'phu_nu': return 40;
            case 'summer': return 45;
            default: return 35;
        }
    }

    function createParticle(theme, w, h, initialRandomY) {
        var p = {
            x: Math.random() * w,
            y: initialRandomY ? Math.random() * h : -30,
            z: 0.4 + Math.random() * 0.8, // Depth scale
            size: 10 + Math.random() * 12,
            vx: (Math.random() - 0.5) * 0.8,
            vy: 0.8 + Math.random() * 1.4,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.03,
            tiltAngle: Math.random() * Math.PI * 2,
            tiltSpeed: 0.02 + Math.random() * 0.03,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.015 + Math.random() * 0.02,
            alpha: 0.75 + Math.random() * 0.25,
            subType: 0,
            color: '#fff'
        };

        if (theme === 'tet') {
            var r = Math.random();
            if (r < 0.46) {
                p.subType = 'mai'; // Hoa mai vàng 5 cánh
                p.size = (9 + Math.random() * 8) * p.z;
            } else if (r < 0.88) {
                p.subType = 'dao'; // Cánh hoa đào hồng
                p.size = (8 + Math.random() * 7) * p.z;
            } else {
                p.subType = 'lixi'; // Bao lì xì đỏ vàng
                p.size = (14 + Math.random() * 5) * p.z;
                p.vy = 0.7 + Math.random() * 0.9;
            }
        } else if (theme === 'trung_thu') {
            // Sky lanterns float UPWARD
            p.y = initialRandomY ? Math.random() * h : (h + 40);
            var r2 = Math.random();
            if (r2 < 0.55) {
                p.subType = 'lantern'; // Đèn trời Khổng Minh phát sáng
                p.size = (14 + Math.random() * 14) * p.z;
                p.vy = -(0.45 + Math.random() * 0.75) * p.z;
                p.vx = (Math.random() - 0.5) * 0.35;
            } else if (r2 < 0.72) {
                p.subType = 'star_lantern'; // Đèn ông sao 5 cánh
                p.size = (15 + Math.random() * 10) * p.z;
                p.vy = -(0.4 + Math.random() * 0.6) * p.z;
            } else {
                p.subType = 'sparkle'; // Đom đóm trăng rằm
                p.size = 2.5 + Math.random() * 3.5;
                p.vy = -(0.25 + Math.random() * 0.45);
            }
        } else if (theme === 'quoc_khanh') {
            var r3 = Math.random();
            if (r3 < 0.35) {
                p.subType = 'gold_star'; // Sao vàng 5 cánh
                p.size = (10 + Math.random() * 8) * p.z;
            } else {
                p.subType = 'confetti'; // Hoa giấy Đỏ - Vàng
                p.size = (7 + Math.random() * 6) * p.z;
                p.color = Math.random() < 0.55 ? '#da251d' : '#ffcd00';
            }
        } else if (theme === 'halloween') {
            var r4 = Math.random();
            if (r4 < 0.45) {
                p.subType = 'bat'; // Dơi vỗ cánh bay ngang
                p.size = (16 + Math.random() * 14) * p.z;
                p.vx = (Math.random() < 0.5 ? 1 : -1) * (1.2 + Math.random() * 1.6);
                p.vy = (Math.random() - 0.5) * 0.6;
                p.wingPhase = Math.random() * Math.PI * 2;
            } else if (r4 < 0.68) {
                p.subType = 'pumpkin'; // Bí ngô phát sáng
                p.size = (14 + Math.random() * 8) * p.z;
                p.vy = 0.6 + Math.random() * 0.8;
            } else {
                p.subType = 'ember'; // Đom đóm ma thuật cam/tím
                p.size = 3 + Math.random() * 4;
                p.color = Math.random() < 0.6 ? '#ff7518' : '#a855f7';
                p.vy = -(0.3 + Math.random() * 0.6);
                p.y = initialRandomY ? Math.random() * h : (h + 20);
            }
        } else if (theme === 'noel') {
            var r5 = Math.random();
            if (r5 < 0.3) {
                p.subType = 'crystal'; // Bông tuyết tinh thể 6 cánh
                p.size = (9 + Math.random() * 9) * p.z;
            } else {
                p.subType = 'snow'; // Hạt tuyết tròn mềm
                p.size = (2.5 + Math.random() * 5) * p.z;
            }
            p.vy = (0.6 + Math.random() * 1.3) * p.z;
        } else if (theme === 'gio_to') {
            p.subType = Math.random() < 0.65 ? 'lotus' : 'gold_dust';
            p.size = p.subType === 'lotus' ? (10 + Math.random() * 8) * p.z : (2.5 + Math.random() * 3.5);
        } else if (theme === 'phu_nu') {
            p.subType = Math.random() < 0.72 ? 'rose' : 'heart';
            p.size = (10 + Math.random() * 8) * p.z;
            p.color = Math.random() < 0.5 ? '#e11d48' : '#fb7185';
        } else {
            // summer / gaming fireflies
            p.subType = 'firefly';
            p.size = 2.5 + Math.random() * 4;
            p.vx = (Math.random() - 0.5) * 0.7;
            p.vy = (Math.random() - 0.5) * 0.7;
            p.color = Math.random() < 0.5 ? '#38bdf8' : '#facc15';
        }

        return p;
    }

    function updateParticle(p, theme, w, h, tick, wind, mx, my) {
        p.swayPhase += p.swaySpeed;
        p.angle += p.spin;
        p.tiltAngle += p.tiltSpeed;

        if (theme === 'trung_thu') {
            p.x += p.vx + Math.sin(p.swayPhase) * 0.4 + wind * 0.3;
            p.y += p.vy;
            if (p.y < -60) {
                p.y = h + 40;
                p.x = Math.random() * w;
            }
            if (p.x < -50) p.x = w + 40;
            if (p.x > w + 50) p.x = -40;
            return;
        }

        if (theme === 'halloween' && p.subType === 'bat') {
            p.wingPhase += 0.18;
            p.x += p.vx;
            p.y += p.vy + Math.sin(p.swayPhase * 1.5) * 0.7;
            if (p.vx > 0 && p.x > w + 60) {
                p.x = -50;
                p.y = 40 + Math.random() * (h * 0.65);
            } else if (p.vx < 0 && p.x < -60) {
                p.x = w + 50;
                p.y = 40 + Math.random() * (h * 0.65);
            }
            return;
        }

        if (theme === 'halloween' && p.subType === 'ember') {
            p.x += Math.sin(p.swayPhase) * 0.5 + wind * 0.2;
            p.y += p.vy;
            if (p.y < -20) {
                p.y = h + 20;
                p.x = Math.random() * w;
            }
            return;
        }

        if (theme === 'summer') {
            p.x += p.vx + Math.cos(p.swayPhase) * 0.35;
            p.y += p.vy + Math.sin(p.swayPhase) * 0.35;
            // Gentle mouse interaction
            var dx = p.x - mx;
            var dy = p.y - my;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110 && dist > 1) {
                p.x += (dx / dist) * 1.2;
                p.y += (dy / dist) * 1.2;
            }
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.y < -20) p.y = h + 20;
            if (p.y > h + 20) p.y = -20;
            return;
        }

        // Standard downward falling with 3D sway & wind
        p.x += p.vx + Math.sin(p.swayPhase) * 0.85 + wind * p.z;
        p.y += p.vy;

        if (p.y > h + 40) {
            p.y = -30;
            p.x = Math.random() * w;
        }
        if (p.x > w + 40) p.x = -30;
        if (p.x < -40) p.x = w + 30;
    }

    function drawParticle(ctx, p, theme, tick) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = p.alpha;

        var scaleY = Math.cos(p.tiltAngle);

        if (p.subType === 'mai') {
            // 5-petal yellow apricot blossom (Hoa Mai)
            ctx.rotate(p.angle);
            ctx.scale(1, 0.55 + Math.abs(scaleY) * 0.45);
            var r = p.size * 0.5;
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = 'rgba(250, 204, 21, 0.4)';
            ctx.shadowBlur = 4;
            for (var i = 0; i < 5; i++) {
                ctx.save();
                ctx.rotate((i * Math.PI * 2) / 5);
                ctx.beginPath();
                ctx.arc(0, -r * 0.65, r * 0.48, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            // Red-orange pistils
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.subType === 'dao' || p.subType === 'lotus') {
            // 3D peach / lotus petal
            ctx.rotate(p.angle);
            ctx.scale(1, 0.35 + Math.abs(scaleY) * 0.65);
            var s = p.size * 0.6;
            var grad = ctx.createRadialGradient(0, 0, 1, 0, 0, s);
            grad.addColorStop(0, '#ffe4e6');
            grad.addColorStop(0.6, '#fb7185');
            grad.addColorStop(1, '#f43f5e');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.bezierCurveTo(s * 0.9, -s * 0.5, s * 0.8, s * 0.7, 0, s);
            ctx.bezierCurveTo(-s * 0.8, s * 0.7, -s * 0.9, -s * 0.5, 0, -s);
            ctx.fill();
        } else if (p.subType === 'lixi') {
            // Red Lucky Envelope (Bao Lì Xì)
            ctx.rotate(Math.sin(p.swayPhase) * 0.35);
            var w = p.size * 0.75;
            var h = p.size * 1.1;
            ctx.fillStyle = '#dc2626';
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(-w / 2, -h / 2, w, h, 2.5) : ctx.rect(-w / 2, -h / 2, w, h);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(0, 0, w * 0.22, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.subType === 'lantern') {
            // Glowing Sky Lantern (Đèn Trời Trung Thu)
            ctx.rotate(Math.sin(p.swayPhase) * 0.12);
            var lw = p.size * 0.8;
            var lh = p.size * 1.15;
            // Outer warm glow
            var glow = ctx.createRadialGradient(0, lh * 0.2, 2, 0, 0, lh * 1.3);
            glow.addColorStop(0, 'rgba(255, 230, 130, 0.95)');
            glow.addColorStop(0.45, 'rgba(255, 110, 30, 0.55)');
            glow.addColorStop(1, 'rgba(255, 80, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, lh * 1.3, 0, Math.PI * 2);
            ctx.fill();

            // Lantern body
            var bodyGrad = ctx.createLinearGradient(0, -lh / 2, 0, lh / 2);
            bodyGrad.addColorStop(0, '#dc2626');
            bodyGrad.addColorStop(0.6, '#f97316');
            bodyGrad.addColorStop(1, '#fef08a');
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.moveTo(-lw * 0.35, -lh * 0.5);
            ctx.quadraticCurveTo(-lw * 0.65, 0, -lw * 0.28, lh * 0.5);
            ctx.lineTo(lw * 0.28, lh * 0.5);
            ctx.quadraticCurveTo(lw * 0.65, 0, lw * 0.35, -lh * 0.5);
            ctx.closePath();
            ctx.fill();
        } else if (p.subType === 'star_lantern' || p.subType === 'gold_star') {
            // 5-pointed Star
            ctx.rotate(p.angle);
            var sr = p.size * 0.65;
            ctx.fillStyle = (p.subType === 'gold_star') ? '#ffcd00' : '#f59e0b';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 8;
            drawFivePointStar(ctx, 0, 0, 5, sr, sr * 0.45);
            ctx.fill();
        } else if (p.subType === 'confetti') {
            ctx.rotate(p.angle);
            ctx.scale(1, scaleY);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size * 0.45, -p.size * 0.25, p.size * 0.9, p.size * 0.5);
        } else if (p.subType === 'bat') {
            // Flapping Bat
            var dir = p.vx >= 0 ? 1 : -1;
            ctx.scale(dir, 1);
            var wingY = Math.sin(p.wingPhase) * (p.size * 0.45);
            var bs = p.size * 0.65;
            ctx.fillStyle = '#1e1b4b';
            ctx.shadowColor = 'rgba(249, 115, 22, 0.5)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-bs * 0.6, wingY - bs * 0.5, -bs * 1.3, wingY);
            ctx.quadraticCurveTo(-bs * 0.7, wingY + bs * 0.3, 0, bs * 0.2);
            ctx.quadraticCurveTo(bs * 0.7, wingY + bs * 0.3, bs * 1.3, wingY);
            ctx.quadraticCurveTo(bs * 0.6, wingY - bs * 0.5, 0, 0);
            ctx.fill();
            // Glowing eyes
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(-2, -1, 1.3, 0, Math.PI * 2);
            ctx.arc(2, -1, 1.3, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.subType === 'pumpkin') {
            ctx.rotate(Math.sin(p.swayPhase) * 0.2);
            var pr = p.size * 0.55;
            ctx.fillStyle = '#f97316';
            ctx.shadowColor = '#ea580c';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.ellipse(0, 0, pr * 1.15, pr * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();
            // Stem
            ctx.fillStyle = '#15803d';
            ctx.fillRect(-1.5, -pr * 1.15, 3, pr * 0.35);
            // Glowing eyes
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.moveTo(-pr * 0.45, -pr * 0.25);
            ctx.lineTo(-pr * 0.2, -pr * 0.25);
            ctx.lineTo(-pr * 0.32, -pr * 0.5);
            ctx.closePath();
            ctx.moveTo(pr * 0.45, -pr * 0.25);
            ctx.lineTo(pr * 0.2, -pr * 0.25);
            ctx.lineTo(pr * 0.32, -pr * 0.5);
            ctx.closePath();
            ctx.fill();
        } else if (p.subType === 'crystal') {
            // 6-branch Snowflake Crystal
            ctx.rotate(p.angle);
            var cr = p.size * 0.55;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.4;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 5;
            for (var b = 0; b < 6; b++) {
                ctx.save();
                ctx.rotate((b * Math.PI) / 3);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -cr);
                ctx.moveTo(0, -cr * 0.55);
                ctx.lineTo(-cr * 0.28, -cr * 0.78);
                ctx.moveTo(0, -cr * 0.55);
                ctx.lineTo(cr * 0.28, -cr * 0.78);
                ctx.stroke();
                ctx.restore();
            }
        } else if (p.subType === 'snow') {
            var sg = ctx.createRadialGradient(0, 0, 0.5, 0, 0, p.size);
            sg.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            sg.addColorStop(0.6, 'rgba(224, 242, 254, 0.6)');
            sg.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = sg;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.subType === 'rose') {
            ctx.rotate(p.angle);
            ctx.scale(1, 0.4 + Math.abs(scaleY) * 0.6);
            var rs = p.size * 0.55;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.moveTo(0, -rs);
            ctx.bezierCurveTo(rs, -rs * 0.8, rs * 1.1, rs * 0.6, 0, rs);
            ctx.bezierCurveTo(-rs * 1.1, rs * 0.6, -rs, -rs * 0.8, 0, -rs);
            ctx.fill();
        } else if (p.subType === 'heart') {
            ctx.rotate(Math.sin(p.swayPhase) * 0.25);
            var hs = p.size * 0.45;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(0, hs * 0.3);
            ctx.bezierCurveTo(0, -hs * 0.4, -hs, -hs * 0.4, -hs, hs * 0.2);
            ctx.bezierCurveTo(-hs, hs * 0.7, 0, hs * 1.1, 0, hs * 1.4);
            ctx.bezierCurveTo(0, hs * 1.1, hs, hs * 0.7, hs, hs * 0.2);
            ctx.bezierCurveTo(hs, -hs * 0.4, 0, -hs * 0.4, 0, hs * 0.3);
            ctx.fill();
        } else {
            // Sparkle / Firefly / Gold dust
            var pulse = 0.5 + 0.5 * Math.sin(tick * 0.08 + p.swayPhase);
            ctx.globalAlpha = p.alpha * pulse;
            var fg = ctx.createRadialGradient(0, 0, 0.5, 0, 0, p.size * 2.2);
            fg.addColorStop(0, '#ffffff');
            fg.addColorStop(0.4, p.color || '#facc15');
            fg.addColorStop(1, 'rgba(250, 204, 21, 0)');
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function drawFivePointStar(ctx, cx, cy, spikes, outerR, innerR) {
        var rot = (Math.PI / 2) * 3;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerR);
        for (var i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerR;
            y = cy + Math.sin(rot) * outerR;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerR;
            y = cy + Math.sin(rot) * innerR;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerR);
        ctx.closePath();
    }

    function createFirework(w, h, theme) {
        var palette = (theme === 'quoc_khanh')
            ? ['#ff1744', '#ffd700', '#ff5252', '#fde047', '#38bdf8']
            : ['#ffd700', '#ff4d4f', '#f472b6', '#34d399', '#fb923c'];
        return {
            x: w * (0.12 + Math.random() * 0.76),
            y: h,
            targetY: h * (0.12 + Math.random() * 0.35),
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(7.5 + Math.random() * 3.5),
            color: palette[Math.floor(Math.random() * palette.length)],
            trail: []
        };
    }

    function updateAndDrawFireworks(ctx, fireworks, sparks, w, h) {
        for (var i = fireworks.length - 1; i >= 0; i--) {
            var fw = fireworks[i];
            fw.trail.push({ x: fw.x, y: fw.y });
            if (fw.trail.length > 8) fw.trail.shift();

            fw.x += fw.vx;
            fw.y += fw.vy;
            fw.vy += 0.08;

            // Draw rocket trail
            ctx.save();
            for (var t = 0; t < fw.trail.length; t++) {
                ctx.globalAlpha = (t / fw.trail.length) * 0.7;
                ctx.fillStyle = fw.color;
                ctx.beginPath();
                ctx.arc(fw.trail[t].x, fw.trail[t].y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            if (fw.y <= fw.targetY || fw.vy >= -1) {
                // Explode into sparks
                var count = 36 + Math.floor(Math.random() * 20);
                for (var s = 0; s < count; s++) {
                    var angle = (Math.PI * 2 * s) / count + (Math.random() - 0.5) * 0.2;
                    var speed = 1.5 + Math.random() * 4.2;
                    sparks.push({
                        x: fw.x,
                        y: fw.y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        color: fw.color,
                        alpha: 1,
                        decay: 0.014 + Math.random() * 0.012,
                        size: 1.8 + Math.random() * 1.8
                    });
                }
                fireworks.splice(i, 1);
            }
        }

        for (var j = sparks.length - 1; j >= 0; j--) {
            var sp = sparks[j];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vx *= 0.97;
            sp.vy = sp.vy * 0.97 + 0.055; // Gravity
            sp.alpha -= sp.decay;

            if (sp.alpha <= 0) {
                sparks.splice(j, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = sp.alpha;
            ctx.fillStyle = sp.color;
            ctx.shadowColor = sp.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function getCornerOrnamentHTML(theme) {
        if (theme === 'tet') {
            var lanternSvg = '' +
                '<svg width="64" height="130" viewBox="0 0 64 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: vnPulseGlow 3s infinite;">' +
                '<line x1="32" y1="0" x2="32" y2="18" stroke="#fbbf24" stroke-width="2.5"/>' +
                '<rect x="22" y="16" width="20" height="6" rx="2" fill="#fbbf24"/>' +
                '<ellipse cx="32" cy="48" rx="26" ry="28" fill="url(#tetLanternGrad)" stroke="#fbbf24" stroke-width="1.5"/>' +
                '<path d="M20 22 C12 38, 12 58, 20 74" stroke="#fde047" stroke-width="1" fill="none" opacity="0.7"/>' +
                '<path d="M44 22 C52 38, 52 58, 44 74" stroke="#fde047" stroke-width="1" fill="none" opacity="0.7"/>' +
                '<circle cx="32" cy="48" r="10" fill="#fde047" opacity="0.9"/>' +
                '<text x="32" y="52" text-anchor="middle" fill="#b91c1c" font-size="11" font-weight="bold">TẾT</text>' +
                '<rect x="22" y="74" width="20" height="6" rx="2" fill="#fbbf24"/>' +
                '<line x1="27" y1="80" x2="25" y2="122" stroke="#ef4444" stroke-width="2"/>' +
                '<line x1="32" y1="80" x2="32" y2="126" stroke="#fbbf24" stroke-width="2"/>' +
                '<line x1="37" y1="80" x2="39" y2="122" stroke="#ef4444" stroke-width="2"/>' +
                '<defs><radialGradient id="tetLanternGrad" cx="50%" cy="50%" r="50%">' +
                '<stop offset="0%" stop-color="#ff4d4f"/><stop offset="100%" stop-color="#b91c1c"/>' +
                '</radialGradient></defs></svg>';
            return '<div class="vn-corner-ornament vn-corner-left">' + lanternSvg + '</div>' +
                   '<div class="vn-corner-ornament vn-corner-right">' + lanternSvg + '</div>';
        }
        if (theme === 'quoc_khanh') {
            var badgeSvg = '' +
                '<svg width="58" height="95" viewBox="0 0 58 95" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 10px rgba(218,37,29,0.5));">' +
                '<path d="M8 0 H50 V68 L29 84 L8 68 Z" fill="#da251d" stroke="#ffcd00" stroke-width="2"/>' +
                '<polygon points="29,18 33,31 46,31 35,39 39,52 29,44 19,52 23,39 12,31 25,31" fill="#ffcd00"/>' +
                '</svg>';
            return '<div class="vn-corner-ornament vn-corner-left">' + badgeSvg + '</div>' +
                   '<div class="vn-corner-ornament vn-corner-right">' + badgeSvg + '</div>';
        }
        if (theme === 'trung_thu') {
            var moonSvg = '' +
                '<div style="position:fixed;top:18px;right:28px;pointer-events:none;z-index:9999;animation:vnFloat 5s ease-in-out infinite;">' +
                '<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 0 20px rgba(253,224,71,0.85));">' +
                '<circle cx="36" cy="36" r="28" fill="url(#moonGrad)"/>' +
                '<defs><radialGradient id="moonGrad"><stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#facc15"/></radialGradient></defs>' +
                '</svg></div>';
            return moonSvg;
        }
        if (theme === 'halloween') {
            var webSvg = '' +
                '<svg width="95" height="95" viewBox="0 0 100 100" fill="none" stroke="rgba(255,140,0,0.38)" stroke-width="1.3">' +
                '<line x1="0" y1="0" x2="100" y2="20"/><line x1="0" y1="0" x2="85" y2="55"/><line x1="0" y1="0" x2="55" y2="85"/><line x1="0" y1="0" x2="20" y2="100"/>' +
                '<path d="M30 6 Q26 20 20 26 Q14 28 6 30"/><path d="M55 11 Q48 34 34 48 Q22 52 11 55"/><path d="M80 16 Q68 50 50 68 Q34 74 16 80"/>' +
                '</svg>';
            return '<div style="position:fixed;top:0;left:0;pointer-events:none;z-index:9999;">' + webSvg + '</div>' +
                   '<div style="position:fixed;top:0;right:0;transform:scaleX(-1);pointer-events:none;z-index:9999;">' + webSvg + '</div>';
        }
        return '';
    }

    // Expose global controller for live preview & initialization
    window.VNHolidayEffects = {
        init: initHolidayEffects
    };

    document.addEventListener('DOMContentLoaded', function () {
        if (window.__VN_HOLIDAY_EFFECT_MODE__) {
            initHolidayEffects(window.__VN_HOLIDAY_EFFECT_MODE__);
        }
    });
})();

