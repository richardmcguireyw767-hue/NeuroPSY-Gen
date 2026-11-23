// ============================================================================
// NEUROPSY AI — Next-Gen 60 FPS Festival Stage & Cyber-Visionary Visualizer
// 3 Visual Modes:
//   1. PLASMA VORTEX (3D Bass Terrain + Radial LED Spectrum + Shockwaves)
//   2. FIBONACCI MATRIX (Golden Ratio Phyllotaxis Spiral + Acid Lissajous)
//   3. HYPER-GRID 3D (Perspective Laser Horizon + Oscilloscope Ribbons)
// ============================================================================

export class PsyVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.analyser = null;
    this.freqData = new Uint8Array(1024);
    this.timeData = new Uint8Array(1024);

    this.colorPrimary = '#00f5d4';
    this.colorSecondary = '#7209b7';
    this.colorAccent = '#ff007f';

    this.mode = 0; // 0: Plasma Vortex, 1: Fibonacci Matrix, 2: Hyper-Grid 3D
    this.modeNames = ['PLASMA VORTEX 3D', 'FIBONACCI PHYLLOTAXIS', 'CYBER HORIZON 3D'];

    this.time = 0;
    this.kickPulse = 0;
    this.bassPulse = 0;
    this.acidPulse = 0;
    this.warpDrive = 0;

    this.shockwaves = [];
    this.stars = [];
    this.initStars();

    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 180; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 2400,
        y: (Math.random() - 0.5) * 2400,
        z: Math.random() * 1200 + 20,
        size: 1.0 + Math.random() * 2.4,
        colorType: i % 3
      });
    }
  }

  cycleMode() {
    this.mode = (this.mode + 1) % this.modeNames.length;
    return this.modeNames[this.mode];
  }

  setAnalyser(analyser) {
    this.analyser = analyser;
    if (analyser) {
      this.freqData = new Uint8Array(analyser.frequencyBinCount);
      this.timeData = new Uint8Array(analyser.frequencyBinCount);
    }
  }

  setPalette(primary, secondary) {
    this.colorPrimary = primary;
    this.colorSecondary = secondary;
  }

  triggerStepPulse(events, isMixing) {
    if (!events) return;
    if (events.kick) {
      this.kickPulse = 1.0;
      this.shockwaves.push({
        radius: 50,
        alpha: 0.9,
        color: this.colorPrimary,
        lineWidth: 3.5
      });
    }
    if (events.bass) {
      this.bassPulse = Math.min(1.0, this.bassPulse + 0.55);
    }
    if (events.acid || events.fx) {
      this.acidPulse = Math.min(1.0, this.acidPulse + 0.7);
      if (events.fx) {
        this.shockwaves.push({
          radius: 75,
          alpha: 0.85,
          color: '#ff007f',
          lineWidth: 2.2
        });
      }
    }
    if (isMixing) {
      this.warpDrive = Math.min(1.0, this.warpDrive + 0.18);
    }
  }

  start() {
    const loop = () => {
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  getAudioBands() {
    if (!this.analyser) {
      const t = performance.now() * 0.002;
      return {
        sub: 0.2 + 0.08 * Math.sin(t * 2),
        mid: 0.15 + 0.05 * Math.cos(t * 3),
        high: 0.12 + 0.04 * Math.sin(t * 5)
      };
    }

    this.analyser.getByteFrequencyData(this.freqData);
    this.analyser.getByteTimeDomainData(this.timeData);

    let sub = 0, mid = 0, high = 0;
    for (let i = 1; i < 14; i++) sub += this.freqData[i];
    for (let i = 14; i < 95; i++) mid += this.freqData[i];
    for (let i = 95; i < 340; i++) high += this.freqData[i];

    return {
      sub: sub / (13 * 255),
      mid: mid / (81 * 255),
      high: high / (245 * 255)
    };
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = w * 0.5;
    const cy = h * 0.5;

    const bands = this.getAudioBands();

    this.kickPulse *= 0.86;
    this.bassPulse *= 0.89;
    this.acidPulse *= 0.90;
    this.warpDrive *= 0.95;

    const speed = 1 + bands.sub * 2.2 + this.warpDrive * 4.5;
    this.time += 0.016 * speed;

    // Deep cosmic background fade with subtle motion persistence
    ctx.fillStyle = this.warpDrive > 0.12 ? 'rgba(3, 2, 10, 0.20)' : 'rgba(4, 3, 12, 0.32)';
    ctx.fillRect(0, 0, w, h);

    // Dynamic Dual-Core Radial Plasma Glow
    const auraRadius = Math.max(w, h) * (0.48 + bands.sub * 0.18 + this.kickPulse * 0.08);
    const bgGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, auraRadius);
    bgGrad.addColorStop(0, `${this.colorPrimary}28`);
    bgGrad.addColorStop(0.38, `${this.colorSecondary}24`);
    bgGrad.addColorStop(0.75, 'rgba(12, 4, 32, 0.12)');
    bgGrad.addColorStop(1, 'rgba(3, 2, 10, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 1. Render 3D Starfield Warp
    this.renderStarfield(ctx, cx, cy, bands, speed);

    // 2. Render 3D Perspective Bass Terrain Floor & Ceiling
    this.render3DBassTerrain(ctx, w, h, cx, cy, bands);

    // 3. Render Mode-Specific Centerpiece
    if (this.mode === 0) {
      this.renderPlasmaVortexCore(ctx, w, h, cx, cy, bands);
    } else if (this.mode === 1) {
      this.renderFibonacciMatrix(ctx, w, h, cx, cy, bands);
    } else {
      this.renderCyberLaserRibbons(ctx, w, h, cx, cy, bands);
    }

    // 4. Render Expanding Kick & Zap Shockwave Rings
    this.renderShockwaves(ctx, cx, cy, w, h);
  }

  renderStarfield(ctx, cx, cy, bands, speed) {
    ctx.save();
    ctx.translate(cx, cy);
    const focal = 450;

    for (const s of this.stars) {
      s.z -= (4.5 + bands.sub * 14 + this.warpDrive * 38);
      if (s.z <= 12) {
        s.z = 1200;
        s.x = (Math.random() - 0.5) * 2400;
        s.y = (Math.random() - 0.5) * 2400;
      }

      const scale = focal / s.z;
      const sx = s.x * scale;
      const sy = s.y * scale;
      const prevScale = focal / (s.z + 25 + this.warpDrive * 80 + bands.sub * 30);
      const px = s.x * prevScale;
      const py = s.y * prevScale;

      const alpha = Math.min(1, (1200 - s.z) / 800);
      const col = s.colorType === 0 ? this.colorPrimary : (s.colorType === 1 ? '#ffffff' : this.colorSecondary);

      ctx.beginPath();
      ctx.strokeStyle = col;
      ctx.globalAlpha = alpha * 0.85;
      ctx.lineWidth = Math.max(0.7, s.size * scale * 0.7);
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
    ctx.restore();
  }

  render3DBassTerrain(ctx, w, h, cx, cy, bands) {
    ctx.save();
    const horizonY = cy + h * 0.12;
    const rows = 14;
    const cols = 28;
    const gridScroll = (this.time * 2.4) % 1;

    // Horizontal audio-modulated terrain lines
    for (let r = 1; r <= rows; r++) {
      const normZ = (r - gridScroll) / rows; // 0 (horizon) -> 1 (camera)
      const persp = Math.pow(normZ, 2.1);
      const yBase = horizonY + persp * (h - horizonY + 40);

      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const normX = (c / cols) * 2 - 1; // -1 to +1
        const spread = 0.25 + persp * 1.45;
        const x = cx + normX * (w * 0.65) * spread;

        // Displace terrain height using FFT frequency bin
        const binIdx = Math.abs(Math.floor((c - cols / 2) * 3)) + r * 2;
        const fftVal = this.analyser ? (this.freqData[binIdx] / 255) : (0.2 * Math.sin(c * 0.5 + this.time * 3));
        const centerFade = Math.sin((c / cols) * Math.PI);
        const elevation = fftVal * 78 * persp * centerFade * (1 + this.bassPulse * 0.5);

        const y = yBase - elevation;
        if (c === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = r % 2 === 0 ? this.colorPrimary : this.colorSecondary;
      ctx.globalAlpha = Math.min(0.65, persp * 0.85);
      ctx.lineWidth = 1.0 + persp * 1.6;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderPlasmaVortexCore(ctx, w, h, cx, cy, bands) {
    ctx.save();
    ctx.translate(cx, cy);

    const minDim = Math.min(w, h);
    const coreR = minDim * 0.145 * (1 + bands.sub * 0.32 + this.kickPulse * 0.18);

    // 1. Segmented 64-Bar Radial Festival Equalizer Ring
    const numBars = 64;
    for (let i = 0; i < numBars; i++) {
      const angle = (i / numBars) * Math.PI * 2 + this.time * 0.18;
      const mirrorIdx = i < numBars / 2 ? i * 2 : (numBars - i) * 2;
      const val = this.analyser
        ? (this.freqData[mirrorIdx + 2] / 255)
        : (0.25 + 0.15 * Math.sin(i * 0.4 + this.time * 5));

      const innerR = coreR * 1.12;
      const barLen = 10 + Math.pow(val, 1.35) * (minDim * 0.17) * (1 + this.acidPulse * 0.3);
      const outerR = innerR + barLen;

      const x1 = Math.cos(angle) * innerR;
      const y1 = Math.sin(angle) * innerR;
      const x2 = Math.cos(angle) * outerR;
      const y2 = Math.sin(angle) * outerR;

      ctx.beginPath();
      ctx.strokeStyle = i % 2 === 0 ? this.colorPrimary : (val > 0.68 ? '#ff007f' : this.colorSecondary);
      ctx.lineWidth = 3.4;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.45 + val * 0.55;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 2. Dual Counter-Rotating Plasma Waveform Ribbons
    for (let layer = 0; layer < 2; layer++) {
      ctx.beginPath();
      const pts = 120;
      const dir = layer === 0 ? 1 : -1;
      for (let i = 0; i <= pts; i++) {
        const idx = i % pts;
        const a = (idx / pts) * Math.PI * 2 + this.time * 0.5 * dir;
        const sample = this.analyser
          ? ((this.timeData[idx * 4] - 128) / 128)
          : (Math.sin(idx * 0.25 + this.time * 6) * 0.2);

        const harmonic = Math.sin(a * (layer === 0 ? 5 : 7) + this.time * 4) * 14 * (bands.mid + this.acidPulse * 0.5);
        const r = coreR * (layer === 0 ? 0.92 : 0.72) + sample * coreR * 0.55 + harmonic;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = layer === 0 ? this.colorPrimary : '#ff007f';
      ctx.lineWidth = layer === 0 ? 2.6 : 1.9;
      ctx.shadowColor = layer === 0 ? this.colorPrimary : '#ff007f';
      ctx.shadowBlur = 18;
      ctx.stroke();
    }

    // 3. Glowing Energy Singularity Horizon inside Core
    const orbGrad = ctx.createRadialGradient(0, 0, coreR * 0.08, 0, 0, coreR * 0.65);
    orbGrad.addColorStop(0, '#ffffff');
    orbGrad.addColorStop(0.28, this.colorPrimary);
    orbGrad.addColorStop(0.7, `${this.colorSecondary}55`);
    orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.fillStyle = orbGrad;
    ctx.globalAlpha = 0.35 + this.kickPulse * 0.45;
    ctx.arc(0, 0, coreR * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderFibonacciMatrix(ctx, w, h, cx, cy, bands) {
    ctx.save();
    ctx.translate(cx, cy);

    const numSeeds = 220;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5077 degrees
    const maxSpread = Math.min(w, h) * 0.42;

    for (let i = 1; i < numSeeds; i++) {
      const norm = i / numSeeds;
      const binVal = this.analyser ? (this.freqData[(i * 2) % 256] / 255) : 0.3;

      const angle = i * goldenAngle + this.time * 0.35 + Math.sin(norm * 6 - this.time * 3) * 0.25 * (bands.mid + this.acidPulse);
      const radius = Math.sqrt(norm) * maxSpread * (0.85 + bands.sub * 0.3 + binVal * 0.18);

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const dotR = (1.5 + norm * 4.5) * (0.7 + binVal * 1.4 + this.kickPulse * 0.4);

      ctx.beginPath();
      ctx.fillStyle = i % 3 === 0 ? this.colorPrimary : (i % 3 === 1 ? '#ff007f' : this.colorSecondary);
      ctx.globalAlpha = (1 - norm * 0.5) * (0.4 + binVal * 0.6);
      ctx.arc(x, y, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderCyberLaserRibbons(ctx, w, h, cx, cy, bands) {
    ctx.save();
    const numRibbons = 5;
    const points = 96;

    for (let r = 0; r < numRibbons; r++) {
      ctx.beginPath();
      const yOffset = (r - (numRibbons - 1) / 2) * 38;
      for (let i = 0; i <= points; i++) {
        const normX = i / points;
        const x = normX * w;
        const env = Math.sin(normX * Math.PI); // taper at screen edges
        const sample = this.analyser
          ? ((this.timeData[(i * 5 + r * 20) % 512] - 128) / 128)
          : Math.sin(normX * 14 + this.time * 6 + r);

        const y = cy + yOffset + sample * (145 + this.kickPulse * 70 + this.acidPulse * 60) * env;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = r % 2 === 0 ? this.colorPrimary : (r === 1 ? '#ff007f' : this.colorSecondary);
      ctx.lineWidth = r === 2 ? 3.2 : 1.8;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 16;
      ctx.globalAlpha = 0.82;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderShockwaves(ctx, cx, cy, w, h) {
    ctx.save();
    ctx.translate(cx, cy);
    const maxR = Math.max(w, h) * 0.6;

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 12 + this.warpDrive * 18;
      sw.alpha *= 0.93;

      if (sw.alpha <= 0.03 || sw.radius > maxR) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = sw.lineWidth;
      ctx.arc(0, 0, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}
