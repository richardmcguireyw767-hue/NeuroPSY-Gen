import { PsytranceAIEngine, ROOT_NOTES } from './psyEngine.js?v=10';
import { PsyVisualizer } from './visualizer.js?v=10';

const canvas = document.getElementById('psy-canvas');
const visualizer = new PsyVisualizer(canvas);
visualizer.start();

// UI Elements
const subgenreBadge = document.getElementById('subgenre-badge');
const trackTitle = document.getElementById('track-title');
const metaKey = document.getElementById('meta-key');
const metaScale = document.getElementById('meta-scale');
const metaBass = document.getElementById('meta-bass');
const pillBpm = document.getElementById('pill-bpm');
const pillBar = document.getElementById('pill-bar');
const pillStatus = document.getElementById('pill-status');
const pillSamples = document.getElementById('pill-samples');

const deckATag = document.getElementById('deck-a-tag');
const deckBTag = document.getElementById('deck-b-tag');
const crossfadeFill = document.getElementById('crossfade-fill');
const trackCard = document.getElementById('track-card');

const btnChangeMix = document.getElementById('btn-change-mix');
const btnChangeMixText = document.getElementById('btn-change-mix-text');
const btnPlayToggle = document.getElementById('btn-play-toggle');
const btnAutoPilot = document.getElementById('btn-autopilot');
const btnVisMode = document.getElementById('btn-vis-mode');
const visModeLabel = document.getElementById('vis-mode-label');

const keyKeyboard = document.getElementById('key-keyboard');
const activeKeyIndicator = document.getElementById('active-key-indicator');
const octaveButtons = document.querySelectorAll('.btn-octave');

const stepGrid = document.getElementById('step-grid');
const sliderCutoff = document.getElementById('slider-cutoff');
const sliderResonance = document.getElementById('slider-resonance');
const sliderFx = document.getElementById('slider-fx');
const valCutoff = document.getElementById('val-cutoff');
const valResonance = document.getElementById('val-resonance');
const valFx = document.getElementById('val-fx');

// Build 12-Note Bass Tonality Keyboard (C to B)
const keyButtons = {};
for (const note of ROOT_NOTES) {
  const btn = document.createElement('button');
  const isSharp = note.name.includes('#');
  btn.className = `key-btn ${isSharp ? 'sharp' : ''}`;
  btn.textContent = note.name;
  btn.dataset.note = note.name;
  keyKeyboard.appendChild(btn);
  keyButtons[note.name] = btn;
}

// Build 16-step matrix cells
const stepCells = [];
for (let i = 0; i < 16; i++) {
  const cell = document.createElement('div');
  cell.className = `step-cell ${i % 4 === 0 ? 'beat-marker' : ''}`;
  cell.innerHTML = `
    <div class="dot-row"><span class="dot" data-role="kick"></span></div>
    <div class="dot-row"><span class="dot" data-role="bass"></span></div>
    <div class="dot-row"><span class="dot" data-role="acid"></span></div>
  `;
  stepGrid.appendChild(cell);
  stepCells.push(cell);
}

function updateStepMatrixPattern(dna) {
  if (!dna) return;
  for (let i = 0; i < 16; i++) {
    const cell = stepCells[i];
    const kickDot = cell.querySelector('[data-role="kick"]');
    const bassDot = cell.querySelector('[data-role="bass"]');
    const acidDot = cell.querySelector('[data-role="acid"]');

    kickDot.className = `dot ${dna.kickSteps[i] > 0 ? 'kick-on' : ''}`;
    bassDot.className = `dot ${dna.bassSteps[i] && dna.bassSteps[i].active ? 'bass-on' : ''}`;
    acidDot.className = `dot ${dna.acidSteps[i] && dna.acidSteps[i].active ? 'acid-on' : ''}`;
  }
}

const engine = new PsytranceAIEngine(
  // onStateUpdate
  (state) => {
    const dna = state.activeDNA;
    if (dna) {
      subgenreBadge.textContent = dna.subgenre.name;
      trackTitle.textContent = dna.title;
      metaKey.textContent = `${dna.root.name} Minor`;
      metaScale.textContent = dna.scaleName;
      metaBass.textContent = `${dna.bassStyle} (${dna.kickSample.replace('kick_', '').toUpperCase()} WAV)`;
      activeKeyIndicator.textContent = `ROOT: ${dna.root.name} MINOR`;

      // Highlight active bass key button
      Object.entries(keyButtons).forEach(([noteName, btn]) => {
        btn.classList.toggle('active', noteName === dna.root.name);
      });

      document.documentElement.style.setProperty('--primary', dna.subgenre.colorPrimary);
      document.documentElement.style.setProperty('--secondary', dna.subgenre.colorSecondary);
      visualizer.setPalette(dna.subgenre.colorPrimary, dna.subgenre.colorSecondary);
      updateStepMatrixPattern(dna);
    }

    pillBpm.textContent = `${state.currentBpm} BPM`;
    const fmtTime = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    pillBar.textContent = `${fmtTime(state.elapsedSec)} / ${fmtTime(state.totalSec)} • ${state.sectionName}`;

    if (state.isMixing) {
      pillStatus.textContent = `MIXING ${engine.mixFromDeck} ➔ ${engine.mixToDeck}`;
      btnChangeMix.classList.add('mixing');
      trackCard.classList.add('mixing');
      btnChangeMixText.textContent = 'MIXING...';
    } else {
      pillStatus.textContent = state.isPlaying ? `LIVE DECK ${state.activeDeckName}` : 'READY — CLICK TO PLAY';
      btnChangeMix.classList.remove('mixing');
      trackCard.classList.remove('mixing');
      btnChangeMixText.textContent = 'MIX';
    }

    deckATag.classList.toggle('active', state.crossfader < 0.5);
    deckBTag.classList.toggle('active', state.crossfader >= 0.5);
    crossfadeFill.style.width = `${Math.round((0.15 + state.crossfader * 0.85) * 100)}%`;

    btnPlayToggle.textContent = state.isPlaying ? 'PAUSE PSY' : 'START PSY';
    btnAutoPilot.classList.toggle('active-toggle', state.autoPilot);
    btnAutoPilot.textContent = state.autoPilot ? 'AUTO-MIX: On' : 'AUTO-MIX: Off';

    if (engine.analyser && !visualizer.analyser) {
      visualizer.setAnalyser(engine.analyser);
    }
  },
  // onStepTriggered
  (stepInfo) => {
    for (let i = 0; i < 16; i++) {
      stepCells[i].classList.toggle('active-step', i === stepInfo.step16);
    }
    visualizer.triggerStepPulse(stepInfo.events, stepInfo.isMixing);
  }
);

// Live Bass Tonality Click Handlers
Object.entries(keyButtons).forEach(([noteName, btn]) => {
  btn.addEventListener('click', () => {
    engine.setRootKey(noteName);
  });
});

// Live Bass Octave Register Handlers
octaveButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const oct = parseInt(btn.dataset.octave, 10);
    engine.setBassOctaveShift(oct);
    octaveButtons.forEach(b => b.classList.toggle('active', b === btn));
  });
});

// Visual Mode Switcher
btnVisMode.addEventListener('click', () => {
  const newModeName = visualizer.cycleMode();
  visModeLabel.textContent = newModeName;
});

// Primary Button: CHANGE MIX
btnChangeMix.addEventListener('click', async () => {
  if (!engine.isPlaying) {
    await engine.start();
  }
  engine.triggerChangeMix();
});

// Play / Pause Toggle
btnPlayToggle.addEventListener('click', () => {
  engine.togglePlay();
});

// Auto-DJ Toggle
btnAutoPilot.addEventListener('click', () => {
  engine.autoPilot = !engine.autoPilot;
  engine.emitState();
});

// Live Synth Macro Controls
sliderCutoff.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  engine.macros.acidCutoff = v;
  valCutoff.textContent = `${Math.round(v * 100)}%`;
});

sliderResonance.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  engine.macros.resonance = v;
  valResonance.textContent = `${v.toFixed(1)} Q`;
});

sliderFx.addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  engine.macros.fxDensity = v;
  valFx.textContent = `${Math.round(v * 100)}%`;
});

// Populate initial UI state immediately from pendingDNA before audio starts
engine.emitState();

// Initialize samples immediately on load & attempt auto-start
(async () => {
  try {
    await engine.init();
    pillSamples.textContent = '29 STUDIO WAV SAMPLES LOADED';
    await engine.start();
    if (engine.ctx && engine.ctx.state === 'suspended') {
      engine.isPlaying = false;
      engine.emitState();
      const unlockAudio = async () => {
        await engine.start();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio);
      window.addEventListener('keydown', unlockAudio);
    }
  } catch (err) {
    console.error('Audio init notice:', err);
  }
})();
