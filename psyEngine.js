// ============================================================================
// NEUROPSY AI — Procedural Dual-Deck Psytrance Generator & Auto-DJ Engine
// Zero pre-made song loops: every track is algorithmically composed in real
// time from studio WAV one-shot samples (kick, bass, hi-hats, snare, clap,
// crash, FM zaps, squelches) + real-time 303 Acid & FM Grid synthesizers.
// ============================================================================

const SAMPLE_MANIFEST = {
  // 8 Studio Kicks
  kick_fullon: 'samples/kick_fullon.wav',
  kick_dark: 'samples/kick_dark.wav',
  kick_goa: 'samples/kick_goa.wav',
  kick_prog: 'samples/kick_prog.wav',
  kick_alien: 'samples/kick_alien.wav',
  kick_subby: 'samples/kick_subby.wav',
  kick_laser: 'samples/kick_laser.wav',
  kick_tribal: 'samples/kick_tribal.wav',
  // 8 Studio Basses
  bass_rolling: 'samples/bass_rolling.wav',
  bass_snappy: 'samples/bass_snappy.wav',
  bass_dark_fm: 'samples/bass_dark_fm.wav',
  bass_acid_303: 'samples/bass_acid_303.wav',
  bass_alien_sub: 'samples/bass_alien_sub.wav',
  bass_virus_growl: 'samples/bass_virus_growl.wav',
  bass_trippy_fm: 'samples/bass_trippy_fm.wav',
  bass_plucked: 'samples/bass_plucked.wav',
  // 13 Drums & Percussion
  hihat_closed: 'samples/hihat_closed.wav',
  hihat_tight: 'samples/hihat_tight.wav',
  hihat_crispy: 'samples/hihat_crispy.wav',
  hihat_shaker: 'samples/hihat_shaker.wav',
  hihat_open: 'samples/hihat_open.wav',
  hihat_open_long: 'samples/hihat_open_long.wav',
  snare_psy: 'samples/snare_psy.wav',
  snare_tight: 'samples/snare_tight.wav',
  clap_psy: 'samples/clap_psy.wav',
  clap_reverb: 'samples/clap_reverb.wav',
  perc_rim: 'samples/perc_rim.wav',
  perc_tom: 'samples/perc_tom.wav',
  crash_psy: 'samples/crash_psy.wav'
};

// Base root of WAV bass samples is E1 (MIDI 28 = 41.2034 Hz)
const BASS_SAMPLE_BASE_MIDI = 28;

const PSY_SCALES = {
  'Goa': [0, 1, 4, 5, 7, 8, 10],
  'Darkness': [0, 1, 3, 5, 7, 8, 10],
  'Acid': [0, 2, 3, 6, 7, 8, 11],
  'Default': [0, 1, 4, 5, 7, 8, 11],
  'Mushroom': [0, 1, 3, 5, 6, 8, 10]
};

const ROOT_NOTES = [
  { name: 'C', midi: 24 },
  { name: 'C#', midi: 25 },
  { name: 'D', midi: 26 },
  { name: 'D#', midi: 27 },
  { name: 'E', midi: 28 },
  { name: 'F', midi: 29 },
  { name: 'F#', midi: 30 },
  { name: 'G', midi: 31 },
  { name: 'G#', midi: 32 },
  { name: 'A', midi: 21 },
  { name: 'A#', midi: 22 },
  { name: 'B', midi: 23 }
];

export { ROOT_NOTES };

const SUBGENRES = [
  {
    id: 'alien_project',
    name: 'Trance GOA preset',
    bpmRange: [144, 146],
    kickChoices: ['kick_alien', 'kick_fullon', 'kick_goa'],
    bassChoices: ['bass_alien_sub', 'bass_virus_growl', 'bass_snappy', 'bass_acid_303'],
    scales: ['Goa', 'Darkness'],
    colorPrimary: '#00f5d4',
    colorSecondary: '#7209b7',
    acidCutoffBase: 740,
    fmDensity: 0.48
  },
  {
    id: 'fullon',
    name: 'Full-on PSY',
    bpmRange: [142, 146],
    kickChoices: ['kick_fullon', 'kick_alien', 'kick_tribal'],
    bassChoices: ['bass_rolling', 'bass_virus_growl', 'bass_snappy', 'bass_acid_303'],
    scales: ['Goa', 'Acid'],
    colorPrimary: '#00bbf9',
    colorSecondary: '#b5179e',
    acidCutoffBase: 660,
    fmDensity: 0.40
  },
  {
    id: 'darkpsy',
    name: 'Mushroom',
    bpmRange: [148, 154],
    kickChoices: ['kick_dark', 'kick_laser', 'kick_fullon'],
    bassChoices: ['bass_dark_fm', 'bass_trippy_fm', 'bass_virus_growl'],
    scales: ['Darkness', 'Mushroom'],
    colorPrimary: '#ff0055',
    colorSecondary: '#7209b7',
    acidCutoffBase: 440,
    fmDensity: 0.65
  },
  {
    id: 'goa604',
    name: 'PSYtral',
    bpmRange: [140, 145],
    kickChoices: ['kick_goa', 'kick_tribal', 'kick_fullon'],
    bassChoices: ['bass_acid_303', 'bass_snappy', 'bass_rolling'],
    scales: ['Default', 'Goa'],
    colorPrimary: '#ffbe0b',
    colorSecondary: '#fb5607',
    acidCutoffBase: 850,
    fmDensity: 0.25
  },
  {
    id: 'progpsy',
    name: 'HypnoAcid',
    bpmRange: [136, 140],
    kickChoices: ['kick_prog', 'kick_subby', 'kick_fullon'],
    bassChoices: ['bass_plucked', 'bass_alien_sub', 'bass_rolling'],
    scales: ['Darkness', 'Acid'],
    colorPrimary: '#3a86ff',
    colorSecondary: '#00f5d4',
    acidCutoffBase: 520,
    fmDensity: 0.30
  },
  {
    id: 'hitech',
    name: 'Hi-Tech',
    bpmRange: [155, 164],
    kickChoices: ['kick_laser', 'kick_dark'],
    bassChoices: ['bass_trippy_fm', 'bass_dark_fm', 'bass_acid_303'],
    scales: ['Darkness', 'Acid'],
    colorPrimary: '#00bbf9',
    colorSecondary: '#f15bb5',
    acidCutoffBase: 760,
    fmDensity: 0.78
  }
];

const TITLE_PREFIXES = [
  'CLAUDE', 'QUANTUM', 'NEURAL', 'HYPERSPACE', 'GEMINI', 'SHIVA',
  'FRACTAL', 'CHRONOS', 'DIMENSIONAL', 'CHATGPT', 'AKASHIC', 'TACHYON',
  'VOID', 'NEBULA', 'SYNAPTIC', 'PSIONIC', 'SOLARIS', 'KUNDALINI'
];

const TITLE_SUFFIXES = [
  'ATTACK', 'RESONANCE', 'SINGULARITY', 'OPUS', '2017',
  'MANIFOLD', 'HORIZON', 'CARBON', 'TELEPATHY', 'ASTRA',
  'PARADOX', 'ECLIPSE', '2000', 'GATEWAY', 'OVERDRIVE', 'MONOLITH'
];

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================================
// Procedural Track DNA Generator (creates a fresh, never-repeated composition)
// ============================================================================
export function generateTrackDNA(excludeSubgenreId = null, preferAlienProject = false) {
  const pool = excludeSubgenreId
    ? SUBGENRES.filter(g => g.id !== excludeSubgenreId)
    : SUBGENRES;
  const subgenre = (preferAlienProject || Math.random() < 0.45)
    ? (pool.find(g => g.id === 'alien_project') || pickRandom(pool))
    : pickRandom(pool);
  const bpm = randomInt(subgenre.bpmRange[0], subgenre.bpmRange[1]);
  const root = pickRandom(ROOT_NOTES);
  const scaleName = pickRandom(subgenre.scales);
  const scaleIntervals = PSY_SCALES[scaleName];

  const kickSample = pickRandom(subgenre.kickChoices);
  const bassSample = pickRandom(subgenre.bassChoices);
  const closedHatSample = pickRandom(['hihat_closed', 'hihat_tight', 'hihat_crispy', 'hihat_shaker']);
  const openHatSample = pickRandom(['hihat_open', 'hihat_open_long']);
  const snareSample = pickRandom(['snare_psy', 'snare_tight']);
  const clapSample = pickRandom(['clap_psy', 'clap_reverb']);
  const dropStyle = pickRandom([
    'snare_tom_fill',
    'filter_sweep_riser',
    'kick_triplet_stutter',
    'acid_overload',
    'clean_minimal'
  ]);

  // Generate 16-step Kick & Rolling Bass Pattern
  // Classic Psytrance: Kick on 0, 4, 8, 12; Bass on off-beats (K-B-B-B) or gallop
  const bassStyle = pickRandom(['Classic Rolling K-B-B-B', 'Octave Jumping Gallop', 'Hypnotic Triplet-Feel Bounce', 'Sci-Fi Syncopated Drive']);
  const kickSteps = new Array(16).fill(0);
  const bassSteps = [];

  for (let i = 0; i < 16; i++) {
    const isBeat = (i % 4 === 0);
    if (isBeat) {
      kickSteps[i] = 1.0;
      bassSteps.push({ active: false, midi: root.midi, vel: 0, cutoffBoost: 1.0 });
    } else {
      const subStep = i % 4; // 1, 2, 3
      let active = true;
      let octaveOffset = 0;
      let degreeOffset = 0;
      let vel = subStep === 1 ? 0.72 : (subStep === 2 ? 0.92 : 0.86);

      if (bassStyle === 'Octave Jumping Gallop') {
        octaveOffset = (subStep === 2 || (i > 12 && subStep === 3)) ? 12 : 0;
      } else if (bassStyle === 'Hypnotic Triplet-Feel Bounce') {
        if (subStep === 1 && Math.random() < 0.25) active = false;
        octaveOffset = subStep === 3 ? 12 : 0;
      } else if (bassStyle === 'Sci-Fi Syncopated Drive') {
        if (i === 7 || i === 15) degreeOffset = scaleIntervals[1]; // Phrygian b2 tension
        octaveOffset = (subStep === 2) ? 12 : 0;
      }

      // End-of-bar turnaround note variation on steps 13, 14, 15
      if (i >= 13 && Math.random() < 0.45) {
        degreeOffset = pickRandom([scaleIntervals[1], scaleIntervals[4], scaleIntervals[5]]);
      }

      bassSteps.push({
        active,
        midi: root.midi + octaveOffset + degreeOffset,
        vel,
        cutoffBoost: subStep === 2 ? 1.25 : 1.0
      });
    }
  }

  // Generate 32-step Acid 303 & Goa Lead Sequence (2-bar evolving phrase)
  const acidSteps = [];
  const arpMode = pickRandom(['Spiral Goa Arpeggio', 'Hypnotic 303 Squelch', 'Fractal Euclidean Matrix', 'Cybernetic Gate Sequence']);
  for (let i = 0; i < 32; i++) {
    const activeProb = arpMode === 'Spiral Goa Arpeggio' ? 0.78 : 0.65;
    const active = Math.random() < activeProb;
    const degIndex = (i * randomInt(1, 3) + randomInt(0, 2)) % scaleIntervals.length;
    const interval = scaleIntervals[degIndex];
    const octave = pickRandom([12, 24, 24, 36]);
    const accent = (i % 4 === 2) || Math.random() < 0.28;
    const slide = active && Math.random() < 0.32;
    const waveform = Math.random() < 0.65 ? 'sawtooth' : 'square';

    acidSteps.push({
      active,
      midi: root.midi + octave + interval,
      accent,
      slide,
      waveform,
      filterMod: 0.5 + Math.random() * 1.1
    });
  }

  // Generate 16-step Hi-Hat, Snare/Clap & Euclidean FM Grid
  const hatSteps = [];
  const percSteps = [];
  for (let i = 0; i < 16; i++) {
    const isOffbeat = (i % 4 === 2);
    const isGhost = (i % 2 === 1);
    hatSteps.push({
      open: isOffbeat,
      closed: !isOffbeat && (isGhost ? Math.random() < 0.85 : Math.random() < 0.55),
      vel: isOffbeat ? 0.88 : (isGhost ? 0.55 : 0.42),
      pan: ((i % 4) - 1.5) * 0.18
    });

    percSteps.push({
      snare: (i === 4 || i === 12),
      clap: (i === 4 || i === 12) && Math.random() < 0.75,
      ghostSnare: (i === 15 && Math.random() < 0.5),
      rim: (i % 4 === 3 || i === 6) && Math.random() < 0.32,
      tom: (i === 14 || i === 15) && Math.random() < 0.25,
      fmBlip: Math.random() < subgenre.fmDensity,
      fmMidi: root.midi + 36 + pickRandom(scaleIntervals),
      fmRatio: pickRandom([1.5, 2.0, 2.73, 3.14, 4.5])
    });
  }

  const title = `${pickRandom(TITLE_PREFIXES)} ${pickRandom(TITLE_SUFFIXES)} #${randomInt(101, 999)}`;

  return {
    id: `track_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    title,
    subgenre,
    bpm,
    root,
    scaleName,
    scaleIntervals,
    bassStyle,
    arpMode,
    dropStyle,
    kickSample,
    bassSample,
    closedHatSample,
    openHatSample,
    snareSample,
    clapSample,
    kickSteps,
    bassSteps,
    acidSteps,
    hatSteps,
    percSteps
  };
}

// ============================================================================
// Single Deck Audio Channel Graph (Filters, Acid Synth, Sample Triggering)
// ============================================================================
class PsyDeck {
  constructor(ctx, name, masterInput, sampleBuffers) {
    this.ctx = ctx;
    this.name = name;
    this.sampleBuffers = sampleBuffers;
    this.dna = null;

    // DJ Morph Filter chain: Highpass -> Lowpass -> PingPong Delay Send -> Deck Gain
    this.hpFilter = ctx.createBiquadFilter();
    this.hpFilter.type = 'highpass';
    this.hpFilter.frequency.value = 18;
    this.hpFilter.Q.value = 0.8;

    this.lpFilter = ctx.createBiquadFilter();
    this.lpFilter.type = 'lowpass';
    this.lpFilter.frequency.value = 20000;
    this.lpFilter.Q.value = 0.9;

    this.deckGain = ctx.createGain();
    this.deckGain.gain.value = 0.0;

    // Stereo Delay for Acid & FX
    this.delaySend = ctx.createGain();
    this.delaySend.gain.value = 0.28;
    this.delayNode = ctx.createDelay(2.0);
    this.delayNode.delayTime.value = (60 / 145) * 0.75; // Dotted 8th
    this.delayFeedback = ctx.createGain();
    this.delayFeedback.gain.value = 0.42;
    this.delayFilter = ctx.createBiquadFilter();
    this.delayFilter.type = 'bandpass';
    this.delayFilter.frequency.value = 1400;
    this.delayFilter.Q.value = 1.1;

    this.delaySend.connect(this.delayNode);
    this.delayNode.connect(this.delayFilter);
    this.delayFilter.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayFilter.connect(this.hpFilter);

    this.hpFilter.connect(this.lpFilter);
    this.lpFilter.connect(this.deckGain);
    this.deckGain.connect(masterInput);

    this.lastAcidFreq = 220;
  }

  loadDNA(dna) {
    this.dna = dna;
    const dottedEighth = (60 / dna.bpm) * 0.75;
    this.delayNode.delayTime.setTargetAtTime(dottedEighth, this.ctx.currentTime, 0.05);
  }

  playSample(key, time, gainVal = 1.0, playbackRate = 1.0, panVal = 0.0, sendToDelay = false) {
    const buf = this.sampleBuffers[key];
    if (!buf) return;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.setValueAtTime(playbackRate, time);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, time);

    if (panVal !== 0 && this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panVal)), time);
      src.connect(g);
      g.connect(panner);
      panner.connect(this.hpFilter);
      if (sendToDelay) panner.connect(this.delaySend);
    } else {
      src.connect(g);
      g.connect(this.hpFilter);
      if (sendToDelay) g.connect(this.delaySend);
    }

    src.start(time);
  }

  playBassStep(bassStep, time, stepDur, macroCutoffMod = 1.0, octaveShift = 0) {
    if (!bassStep.active) return;

    const shiftedMidi = bassStep.midi + (octaveShift * 12);

    // 1. Trigger Studio WAV Bass One-Shot pitch-shifted to exact MIDI note
    const semitoneDiff = shiftedMidi - BASS_SAMPLE_BASE_MIDI;
    const rate = Math.pow(2, semitoneDiff / 12);
    this.playSample(this.dna.bassSample, time, bassStep.vel * 0.88, rate, 0.0, false);

    // 2. Layer ultra-tight phase-locked sawtooth sub-punch for extra analog bite
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();

    const freq = midiToFreq(shiftedMidi);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(3.2, time);
    const startCut = Math.min(4800, 1950 * bassStep.cutoffBoost * macroCutoffMod);
    filter.frequency.setValueAtTime(startCut, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(85, freq * 1.6), time + stepDur * 0.85);

    amp.gain.setValueAtTime(0.001, time);
    amp.gain.linearRampToValueAtTime(bassStep.vel * 0.26, time + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.001, time + stepDur * 0.92);

    osc.connect(filter);
    filter.connect(amp);
    amp.connect(this.hpFilter);

    osc.start(time);
    osc.stop(time + stepDur * 0.96);
  }

  playAcid303Step(acidStep, time, stepDur, macroAcidCutoff = 1.0, macroResonance = 12.0) {
    if (!acidStep.active) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const shaper = this.ctx.createWaveShaper();
    const amp = this.ctx.createGain();

    osc.type = acidStep.waveform;
    const targetFreq = midiToFreq(acidStep.midi);

    if (acidStep.slide && this.lastAcidFreq) {
      osc.frequency.setValueAtTime(this.lastAcidFreq, time);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, time + stepDur * 0.45);
    } else {
      osc.frequency.setValueAtTime(targetFreq, time);
    }
    this.lastAcidFreq = targetFreq;

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(acidStep.accent ? macroResonance * 1.25 : macroResonance, time);

    const baseCut = this.dna.subgenre.acidCutoffBase * macroAcidCutoff;
    const peakCut = Math.min(9500, baseCut * (acidStep.accent ? 4.2 : 2.6) * acidStep.filterMod);
    filter.frequency.setValueAtTime(peakCut, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(220, baseCut * 0.65), time + stepDur * 0.88);

    // Subtle soft saturation curve
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = Math.tanh(x * (acidStep.accent ? 2.6 : 1.7));
    }
    shaper.curve = curve;

    const peakGain = acidStep.accent ? 0.20 : 0.13;
    amp.gain.setValueAtTime(0.001, time);
    amp.gain.linearRampToValueAtTime(peakGain, time + 0.005);
    amp.gain.exponentialRampToValueAtTime(0.001, time + stepDur * (acidStep.slide ? 1.15 : 0.88));

    osc.connect(filter);
    filter.connect(shaper);
    shaper.connect(amp);
    amp.connect(this.hpFilter);
    amp.connect(this.delaySend);

    osc.start(time);
    osc.stop(time + stepDur * 1.2);
  }

  playFMGridBlip(percStep, time, stepDur) {
    if (!percStep.fmBlip) return;

    // Alien Project style Nord/Virus dual-saw resonant formant lead stab (in-key!)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();

    const cFreq = midiToFreq(percStep.fmMidi);
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // Slight liquid pitch envelope sweep from +7 semitones down to exact scale note
    osc1.frequency.setValueAtTime(cFreq * 1.498, time);
    osc1.frequency.exponentialRampToValueAtTime(cFreq, time + 0.028);

    osc2.frequency.setValueAtTime(cFreq * 1.506, time);
    osc2.frequency.exponentialRampToValueAtTime(cFreq * 1.006, time + 0.028);

    filter.type = 'bandpass';
    filter.Q.setValueAtTime(6.5, time);
    filter.frequency.setValueAtTime(Math.min(6200, cFreq * 5.2), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(480, cFreq * 1.8), time + stepDur * 0.88);

    amp.gain.setValueAtTime(0.001, time);
    amp.gain.linearRampToValueAtTime(0.14, time + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.001, time + stepDur * 0.92);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(amp);
    amp.connect(this.delaySend);
    amp.connect(this.hpFilter);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + stepDur * 0.96);
    osc2.stop(time + stepDur * 0.96);
  }

  playBreakdownPad(time, dur) {
    // Lush stereo detuned Goa / Alien Project atmospheric pad (Root + 5th)
    const rootFreq = midiToFreq(this.dna.root.midi + 24);
    const fifthFreq = midiToFreq(this.dna.root.midi + 31);
    const freqs = [rootFreq, rootFreq * 1.006, fifthFreq, fifthFreq * 0.995];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(2.5, time);
    filter.frequency.setValueAtTime(420, time);
    filter.frequency.exponentialRampToValueAtTime(2400, time + dur * 0.5);
    filter.frequency.exponentialRampToValueAtTime(620, time + dur);

    const amp = this.ctx.createGain();
    amp.gain.setValueAtTime(0.001, time);
    amp.gain.linearRampToValueAtTime(0.095, time + dur * 0.25);
    amp.gain.exponentialRampToValueAtTime(0.001, time + dur);

    filter.connect(amp);
    amp.connect(this.delaySend);
    amp.connect(this.hpFilter);

    for (const f of freqs) {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, time);
      osc.connect(filter);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    }
  }

  playDropImpact(time) {
    // Massive sub-bass boom + crash + in-key liquid zap on drop bar
    const sub = this.ctx.createOscillator();
    const subAmp = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(115, time);
    sub.frequency.exponentialRampToValueAtTime(34, time + 0.75);

    subAmp.gain.setValueAtTime(0.55, time);
    subAmp.gain.exponentialRampToValueAtTime(0.001, time + 0.85);

    sub.connect(subAmp);
    subAmp.connect(this.hpFilter);
    sub.start(time);
    sub.stop(time + 0.9);

    this.playSample('crash_psy', time, 0.52, 1.0, 0.0, true);
  }

  triggerStep(step32, time, stepDur, macros, trackBar = 0) {
    if (!this.dna) return null;
    const step16 = step32 % 16;
    const section = PsytranceAIEngine.getSectionForBar(trackBar);

    const events = {
      kick: false,
      bass: false,
      acid: false,
      hat: false,
      fx: false
    };

    // Detect pre-drop fill bars (right before drops at bars 16, 48, 88, 112)
    const isPreDropFillBar = (trackBar === 15 || trackBar === 47 || trackBar === 87 || trackBar === 111);
    const isDropBar = (trackBar === 16 || trackBar === 48 || trackBar === 88 || trackBar === 112);
    const dropStyle = this.dna.dropStyle || 'filter_sweep_riser';

    // Only some tracks use the snare/tom drum fill + vacuum gap; others use filter sweeps, kick stutters, acid overload, or clean drops!
    const isVacuumGap = isPreDropFillBar && step16 >= 12 && (dropStyle === 'snare_tom_fill' || dropStyle === 'clean_minimal');
    const isDrumFillWindow = isPreDropFillBar && step16 >= 8 && step16 < 12 && dropStyle === 'snare_tom_fill';
    const isKickStutterWindow = isPreDropFillBar && step16 >= 8 && dropStyle === 'kick_triplet_stutter';
    const isAcidOverloadWindow = isPreDropFillBar && step16 >= 4 && dropStyle === 'acid_overload';

    // Smooth High-Pass Filter Sweep for 'filter_sweep_riser' style
    if (isPreDropFillBar && dropStyle === 'filter_sweep_riser') {
      if (step16 === 0) {
        this.hpFilter.frequency.setValueAtTime(18, time);
        this.hpFilter.frequency.exponentialRampToValueAtTime(950, time + stepDur * 14);
      } else if (step16 === 14) {
        this.hpFilter.frequency.setValueAtTime(18, time + stepDur * 1.9);
      }
    }

    // Trigger Pad every 2 bars (step32 === 0) during Calm, Breakdown & Buildup
    if (step32 === 0 && (section.id === 'calm' || section.id === 'breakdown' || section.id === 'buildup')) {
      this.playBreakdownPad(time, stepDur * 32);
    }

    // Trigger massive Drop Impact on Drop Bars (step 0 of the bar)
    if (isDropBar && step16 === 0) {
      this.hpFilter.frequency.setValueAtTime(18, time);
      this.playDropImpact(time);
      events.fx = true;
    }

    // 1. Kick Drum
    if (isKickStutterWindow) {
      // Stutter kick acceleration (8th -> 16th) instead of snare fill
      if (step16 < 12 ? (step16 % 2 === 0) : true) {
        const pitchRise = 1.0 + (step16 - 8) * 0.04;
        this.playSample(this.dna.kickSample, time, 0.92, pitchRise, 0.0, false);
        events.kick = true;
      }
    } else if (section.kickActive && !isDrumFillWindow && !isVacuumGap && !isAcidOverloadWindow && this.dna.kickSteps[step16] > 0) {
      this.playSample(this.dna.kickSample, time, 0.98, 1.0, 0.0, false);
      events.kick = true;
    }

    // 2. Rolling Psy Bassline
    const bassStep = this.dna.bassSteps[step16];
    if (section.bassActive && !isDrumFillWindow && !isVacuumGap && !isKickStutterWindow && !isAcidOverloadWindow && bassStep && bassStep.active) {
      const bassCutoffMod = macros.acidCutoff * section.bassFilterMult;
      this.playBassStep(bassStep, time, stepDur, bassCutoffMod, macros.bassOctaveShift || 0);
      events.bass = true;
    }

    // 3. Hi-Hats
    const hatStep = this.dna.hatSteps[step16];
    if (section.hatsActive && !isVacuumGap && !isAcidOverloadWindow) {
      if (hatStep.open && section.openHatActive) {
        this.playSample(this.dna.openHatSample || 'hihat_open', time, hatStep.vel * 0.52, 1.0, hatStep.pan, false);
        events.hat = true;
      } else if (hatStep.closed) {
        this.playSample(this.dna.closedHatSample, time, hatStep.vel * 0.46, 1.0, hatStep.pan, false);
        events.hat = true;
      }
    }

    // 4. Drum Fills (Сбивки), Buildup Variations & Percussion
    const percStep = this.dna.percSteps[step16];
    if (isDrumFillWindow) {
      // Classic Snare + Tom + Clap fill (only when dropStyle === 'snare_tom_fill')
      const fillPitch = 0.95 + (step16 - 8) * 0.10;
      if (step16 % 2 === 0) {
        this.playSample('perc_tom', time, 0.72, fillPitch, -0.2, true);
      } else {
        this.playSample(this.dna.snareSample || 'snare_psy', time, 0.78, fillPitch + 0.08, 0.2, true);
      }
      if (step16 === 11) {
        this.playSample(this.dna.clapSample || 'clap_reverb', time, 0.70, 1.05, 0.0, true);
      }
    } else if (isVacuumGap || isAcidOverloadWindow || isKickStutterWindow) {
      // No snare/tom percussion during vacuum, acid overload, or kick stutter
    } else if (section.id === 'buildup') {
      // Buildup style varies per track!
      const buildupProgress = (trackBar - 80) / 8; // 0.0 -> 1.0
      if (dropStyle === 'snare_tom_fill') {
        const rollEvery = buildupProgress < 0.45 ? 2 : 1;
        if (step16 % rollEvery === 0) {
          const rollVel = 0.28 + buildupProgress * 0.65;
          const rollPitch = 1.0 + buildupProgress * 0.34;
          this.playSample(this.dna.snareSample || 'snare_psy', time, rollVel, rollPitch, 0.0, true);
          if (buildupProgress >= 0.62) {
            this.playSample(this.dna.snareSample || 'snare_psy', time + stepDur * 0.5, rollVel * 0.8, rollPitch + 0.05, 0.0, true);
          }
        }
      } else if (dropStyle === 'kick_triplet_stutter') {
        // Quarter-note -> eighth-note tribal tom/rim buildup instead of snare roll
        if (step16 % (buildupProgress < 0.6 ? 4 : 2) === 0) {
          this.playSample('perc_tom', time, 0.42 + buildupProgress * 0.4, 0.9 + buildupProgress * 0.35, 0.0, true);
        }
      } else if (dropStyle === 'filter_sweep_riser' || dropStyle === 'clean_minimal') {
        // Subtle offbeat clap + shaker pulse without snare roll
        if (step16 === 4 || step16 === 12) {
          this.playSample(this.dna.clapSample || 'clap_reverb', time, 0.35 + buildupProgress * 0.3, 1.0, 0.0, true);
        }
      }
    } else if (section.snareActive) {
      if (percStep.snare) {
        this.playSample(this.dna.snareSample || 'snare_psy', time, 0.58, 1.0, -0.08, false);
      }
      if (percStep.clap) {
        this.playSample(this.dna.clapSample || 'clap_psy', time, 0.48, 1.0, 0.1, true);
      }
      if (percStep.ghostSnare) {
        this.playSample(this.dna.snareSample || 'snare_psy', time, 0.30, 1.12, 0.2, true);
      }
      if (percStep.rim) {
        this.playSample('perc_rim', time, 0.34, 1.0, -0.25, true);
      }
      if (percStep.tom) {
        this.playSample('perc_tom', time, 0.40, 1.0, 0.22, false);
      }
    }

    if (!isVacuumGap && percStep.fmBlip && Math.random() < macros.fxDensity * section.fxMult) {
      this.playFMGridBlip(percStep, time, stepDur);
      events.fx = true;
    }

    // 5. Acid 303 & Goa Arpeggio Lead (screams open during acid_overload!)
    const acidStep = this.dna.acidSteps[step32];
    if (section.acidActive && !isVacuumGap && acidStep && acidStep.active) {
      const overloadBoost = isAcidOverloadWindow ? (1.6 + (step16 / 16) * 0.9) : 1.0;
      const lfoMod = (0.78 + 0.35 * Math.sin((step32 / 32) * Math.PI * 2)) * section.acidFilterMult * overloadBoost;
      this.playAcid303Step(
        acidStep,
        time,
        stepDur,
        macros.acidCutoff * lfoMod,
        isAcidOverloadWindow ? Math.min(22, macros.resonance * 1.35) : macros.resonance
      );
      events.acid = true;
    }

    return events;
  }
}

// ============================================================================
// Master Dual-Deck AI Engine with Beat-Matched Crossfade & Transition Riser
// ============================================================================
export class PsytranceAIEngine {
  static getSectionForBar(bar) {
    const b = bar % 144;
    if (b < 16) {
      return {
        id: 'intro',
        name: 'INTRO // HYPERSPACE ENTRY',
        kickActive: true,
        bassActive: true,
        hatsActive: true,
        openHatActive: false,
        snareActive: false,
        acidActive: b >= 8,
        bassFilterMult: 0.72 + (b / 16) * 0.28,
        acidFilterMult: 0.65,
        fxMult: 0.75
      };
    }
    if (b < 32) {
      return {
        id: 'groove',
        name: 'FULL-ON GROOVE // ROLLING DRIVE',
        kickActive: true,
        bassActive: true,
        hatsActive: true,
        openHatActive: true,
        snareActive: true,
        acidActive: true,
        bassFilterMult: 1.0,
        acidFilterMult: 0.95,
        fxMult: 0.9
      };
    }
    if (b < 38) {
      // ~10 seconds (6 bars @ 144 BPM = 10.0s) of calm melodic breathing room: no drums, no bass!
      return {
        id: 'calm',
        name: 'COSMIC CALM // MELODIC DRIFT',
        kickActive: false,
        bassActive: false,
        hatsActive: false,
        openHatActive: false,
        snareActive: false,
        acidActive: true,
        bassFilterMult: 0.4,
        acidFilterMult: 0.72,
        fxMult: 0.25
      };
    }
    if (b < 48) {
      return {
        id: 'groove',
        name: 'FULL-ON GROOVE // ROLLING DRIVE',
        kickActive: true,
        bassActive: true,
        hatsActive: true,
        openHatActive: true,
        snareActive: true,
        acidActive: true,
        bassFilterMult: 1.05,
        acidFilterMult: 1.0,
        fxMult: 0.95
      };
    }
    if (b < 64) {
      return {
        id: 'peak1',
        name: 'ACID PEAK I // ALIEN 303 MATRIX',
        kickActive: true,
        bassActive: true,
        hatsActive: true,
        openHatActive: true,
        snareActive: true,
        acidActive: true,
        bassFilterMult: 1.15,
        acidFilterMult: 1.25,
        fxMult: 1.25
      };
    }
    if (b < 80) {
      return {
        id: 'breakdown',
        name: 'ASTRAL BREAKDOWN // MELODIC FLOAT',
        kickActive: false,
        bassActive: b >= 72,
        hatsActive: false,
        openHatActive: false,
        snareActive: false,
        acidActive: true,
        bassFilterMult: 0.55,
        acidFilterMult: 1.1,
        fxMult: 1.15
      };
    }
    if (b < 88) {
      return {
        id: 'buildup',
        name: 'BUILDUP & SNARE ROLL // QUANTUM RISER',
        kickActive: false,
        bassActive: false,
        hatsActive: true,
        openHatActive: false,
        snareActive: true,
        acidActive: true,
        bassFilterMult: 0.8,
        acidFilterMult: 1.35 + ((b - 80) / 8) * 0.5,
        fxMult: 1.3
      };
    }
    if (b < 104) {
      return {
        id: 'climax',
        name: 'CLIMAX DROP // FULL-ON OVERDRIVE',
        kickActive: true,
        bassActive: true,
        hatsActive: true,
        openHatActive: true,
        snareActive: true,
        acidActive: true,
        bassFilterMult: 1.2,
        acidFilterMult: 1.3,
        fxMult: 1.2
      };
    }
    if (b < 110) {
      // Second rare ~10s calm melodic island before the final overdrive drop
      return {
        id: 'calm',
        name: 'COSMIC CALM // MELODIC DRIFT',
        kickActive: false,
        bassActive: false,
        hatsActive: false,
        openHatActive: false,
        snareActive: false,
        acidActive: true,
        bassFilterMult: 0.4,
        acidFilterMult: 0.75,
        fxMult: 0.25
      };
    }
    if (b < 128) {
      return {
        id: 'climax',
        name: 'CLIMAX DROP // FULL-ON OVERDRIVE',
        kickActive: true,
        bassActive: true,
        hatsActive: true,
        openHatActive: true,
        snareActive: true,
        acidActive: true,
        bassFilterMult: 1.22,
        acidFilterMult: 1.32,
        fxMult: 1.2
      };
    }
    return {
      id: 'outro',
      name: 'OUTRO // DJ MIX ZONE',
      kickActive: true,
      bassActive: true,
      hatsActive: true,
      openHatActive: b < 136,
      snareActive: b < 136,
      acidActive: b < 138,
      bassFilterMult: 0.9 - ((b - 128) / 16) * 0.35,
      acidFilterMult: 0.8,
      fxMult: 0.7
    };
  }

  constructor(onStateUpdate, onStepTriggered) {
    this.ctx = null;
    this.initPromise = null;
    this.onStateUpdate = onStateUpdate;
    this.onStepTriggered = onStepTriggered;

    this.sampleBuffers = {};
    this.samplesLoaded = false;
    this.isPlaying = false;

    this.deckA = null;
    this.deckB = null;
    this.activeDeckName = 'A'; // 'A' or 'B'
    this.crossfader = 0.0; // 0.0 = Deck A, 1.0 = Deck B
    this.pendingDNA = generateTrackDNA(null, true);

    // Transition state
    this.isMixing = false;
    this.mixStartTime = 0;
    this.mixDuration = 5.2; // seconds for smooth AI DJ transition
    this.mixFromDeck = 'A';
    this.mixToDeck = 'B';
    this.startBpm = 145;
    this.targetBpm = 145;
    this.currentBpm = this.pendingDNA.bpm;

    // Scheduler state
    this.currentStep32 = 0;
    this.barCount = 1;
    this.nextNoteTime = 0;
    this.timerID = null;

    // Live interactive macros
    this.macros = {
      acidCutoff: 1.0,       // 0.3 to 2.5
      resonance: 11.5,       // 2.0 to 22.0
      fxDensity: 1.0,        // 0.2 to 1.8
      bassOctaveShift: 0,    // -1 (Deep Sub), 0 (Standard), +1 (High Full-On)
      autoDjEveryBars: 144   // ~4 minutes per track (144 bars @ 144 BPM = 4:00)
    };
    this.autoPilot = true;
    this.barsOnCurrentTrack = 0;
    this.totalTrackBars = 144;
  }

  async init() {
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Dynamics Compressor + Limiter + Analyser
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.88;

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -10;
      this.compressor.knee.value = 8;
      this.compressor.ratio.value = 4.5;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.12;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.80;

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Load all 17 Studio WAV Samples
      await this.loadAllSamples();

      this.deckA = new PsyDeck(this.ctx, 'A', this.masterGain, this.sampleBuffers);
      this.deckB = new PsyDeck(this.ctx, 'B', this.masterGain, this.sampleBuffers);

      const initialDNA = this.pendingDNA;
      this.deckA.loadDNA(initialDNA);
      this.deckA.deckGain.gain.value = 1.0;
      this.deckB.deckGain.gain.value = 0.0;
      this.currentBpm = initialDNA.bpm;

      this.emitState();
    })();
    return this.initPromise;
  }

  async loadAllSamples() {
    const entries = Object.entries(SAMPLE_MANIFEST);
    await Promise.all(
      entries.map(async ([key, url]) => {
        try {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
          const arrayBuf = await resp.arrayBuffer();
          this.sampleBuffers[key] = await this.ctx.decodeAudioData(arrayBuf);
        } catch (err) {
          console.warn(`Sample load warning (${key}):`, err);
        }
      })
    );
    this.samplesLoaded = true;
  }

  async start() {
    await this.init();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStep32 = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.04;
    this.schedulerLoop();
    this.emitState();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
    this.emitState();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  // ==========================================================================
  // CHANGE MIX — AI DJ Dual-Deck Procedural Transition
  // ==========================================================================
  triggerChangeMix() {
    if (!this.ctx) {
      this.start();
      return;
    }
    if (!this.isPlaying) {
      this.start();
    }

    const now = this.ctx.currentTime;
    const outgoingDeck = this.activeDeckName === 'A' ? this.deckA : this.deckB;
    const incomingDeck = this.activeDeckName === 'A' ? this.deckB : this.deckA;
    const nextDeckName = this.activeDeckName === 'A' ? 'B' : 'A';

    // Generate brand-new procedural track DNA on incoming deck
    const currentSubgenreId = outgoingDeck.dna ? outgoingDeck.dna.subgenre.id : null;
    const newDNA = generateTrackDNA(currentSubgenreId);
    incomingDeck.loadDNA(newDNA);

    this.isMixing = true;
    this.mixStartTime = now;
    this.mixDuration = 4.8; // 4.8s holographic DJ blend
    this.mixFromDeck = this.activeDeckName;
    this.mixToDeck = nextDeckName;
    this.startBpm = this.currentBpm;
    this.targetBpm = newDNA.bpm;
    this.barsOnCurrentTrack = 0;

    // Synthesize Psychedelic White-Noise & FM Riser + Sub Drop for the transition
    this.playTransitionRiserAndImpact(now, this.mixDuration, incomingDeck);

    this.emitState();
  }

  playTransitionRiserAndImpact(now, duration, incomingDeck) {
    // 1. Psychedelic FM + Filtered Noise Riser during mix
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const amp = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + duration * 0.92);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(4, now);
    lfo.frequency.exponentialRampToValueAtTime(28, now + duration * 0.92);
    lfoGain.gain.setValueAtTime(180, now);

    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.5, now);
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(7500, now + duration * 0.92);

    amp.gain.setValueAtTime(0.001, now);
    amp.gain.exponentialRampToValueAtTime(0.18, now + duration * 0.88);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    osc.connect(filter);
    filter.connect(amp);
    amp.connect(this.masterGain);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + duration + 0.05);
    lfo.stop(now + duration + 0.05);

    // 2. Trigger Crash at the exact drop completion
    const dropTime = now + duration * 0.92;
    incomingDeck.playSample('crash_psy', dropTime, 0.55, 1.0, 0.0, true);
  }

  updateMixEnvelope(now) {
    if (!this.isMixing) return;

    const elapsed = now - this.mixStartTime;
    const progress = Math.min(1.0, Math.max(0.0, elapsed / this.mixDuration));

    // Smooth S-curve crossfade
    const s = progress * progress * (3 - 2 * progress);
    this.crossfader = this.mixFromDeck === 'A' ? s : (1.0 - s);

    // Equal-power gain curves so perceived loudness never dips
    const gainA = Math.cos(this.crossfader * 0.5 * Math.PI);
    const gainB = Math.sin(this.crossfader * 0.5 * Math.PI);
    this.deckA.deckGain.gain.setTargetAtTime(gainA, now, 0.03);
    this.deckB.deckGain.gain.setTargetAtTime(gainB, now, 0.03);

    // Outgoing deck sweeps high-pass up (removes old bass gently so kicks don't clash)
    const outDeck = this.mixFromDeck === 'A' ? this.deckA : this.deckB;
    const inDeck = this.mixToDeck === 'A' ? this.deckA : this.deckB;

    const outHpFreq = 18 + Math.pow(s, 1.6) * 1400; // cuts low-end of old track
    outDeck.hpFilter.frequency.setTargetAtTime(outHpFreq, now, 0.04);
    outDeck.lpFilter.frequency.setTargetAtTime(20000, now, 0.04);

    // Incoming deck sweeps low-pass open from 320 Hz -> 20,000 Hz, then drops full bass
    const inLpFreq = 320 + Math.pow(s, 1.8) * 19680;
    const inHpFreq = s < 0.55 ? 160 * (1 - s) : 18;
    inDeck.lpFilter.frequency.setTargetAtTime(inLpFreq, now, 0.04);
    inDeck.hpFilter.frequency.setTargetAtTime(inHpFreq, now, 0.04);

    // Smooth BPM Glide
    this.currentBpm = Math.round((this.startBpm + (this.targetBpm - this.startBpm) * s) * 10) / 10;

    if (progress >= 1.0) {
      this.isMixing = false;
      this.activeDeckName = this.mixToDeck;
      this.currentBpm = this.targetBpm;

      // Reset filters cleanly
      inDeck.hpFilter.frequency.setTargetAtTime(18, now, 0.05);
      inDeck.lpFilter.frequency.setTargetAtTime(20000, now, 0.05);
      inDeck.deckGain.gain.setTargetAtTime(1.0, now, 0.05);
      outDeck.deckGain.gain.setTargetAtTime(0.0, now, 0.05);
      outDeck.hpFilter.frequency.setTargetAtTime(18, now, 0.05);
      this.crossfader = this.activeDeckName === 'A' ? 0.0 : 1.0;
    }

    this.emitState();
  }

  schedulerLoop() {
    if (!this.isPlaying) return;

    const lookaheadSec = 0.11;
    const now = this.ctx.currentTime;
    this.updateMixEnvelope(now);

    while (this.nextNoteTime < now + lookaheadSec) {
      const stepDur = (60 / this.currentBpm) / 4; // 16th note duration
      const stepToPlay = this.currentStep32;

      let eventsA = null;
      let eventsB = null;

      if (this.isMixing) {
        eventsA = this.deckA.triggerStep(stepToPlay, this.nextNoteTime, stepDur, this.macros, this.barsOnCurrentTrack);
        eventsB = this.deckB.triggerStep(stepToPlay, this.nextNoteTime, stepDur, this.macros, 0);
      } else if (this.activeDeckName === 'A') {
        eventsA = this.deckA.triggerStep(stepToPlay, this.nextNoteTime, stepDur, this.macros, this.barsOnCurrentTrack);
      } else {
        eventsB = this.deckB.triggerStep(stepToPlay, this.nextNoteTime, stepDur, this.macros, this.barsOnCurrentTrack);
      }

      const activeEvents = this.activeDeckName === 'A' ? (eventsA || eventsB) : (eventsB || eventsA);
      if (this.onStepTriggered) {
        this.onStepTriggered({
          step32: stepToPlay,
          step16: stepToPlay % 16,
          barCount: this.barCount,
          events: activeEvents,
          crossfader: this.crossfader,
          isMixing: this.isMixing
        });
      }

      this.nextNoteTime += stepDur;
      this.currentStep32 = (this.currentStep32 + 1) % 32;

      if (this.currentStep32 % 16 === 0) {
        this.barCount++;
        this.barsOnCurrentTrack++;

        // Slight organic AI mutation every 4 bars so the track keeps evolving live
        if (this.barsOnCurrentTrack % 4 === 0 && !this.isMixing) {
          this.mutateActiveDNA();
        }

        // Auto-Pilot DJ Mix every N bars if enabled
        if (this.autoPilot && !this.isMixing && this.barsOnCurrentTrack >= this.macros.autoDjEveryBars) {
          this.triggerChangeMix();
        }
      }
    }

    this.timerID = setTimeout(() => this.schedulerLoop(), 25);
  }

  // Real-time AI melodic mutation every 4 bars so even within a track it never repeats static loops
  mutateActiveDNA() {
    const activeDeck = this.activeDeckName === 'A' ? this.deckA : this.deckB;
    if (!activeDeck || !activeDeck.dna) return;
    const dna = activeDeck.dna;

    // Mutate 3-5 steps of the 32-step Acid 303 sequence
    const numMutations = randomInt(3, 6);
    for (let m = 0; m < numMutations; m++) {
      const idx = randomInt(0, 31);
      const interval = pickRandom(dna.scaleIntervals);
      const octave = pickRandom([12, 24, 36]);
      dna.acidSteps[idx] = {
        active: Math.random() < 0.75,
        midi: dna.root.midi + octave + interval,
        accent: Math.random() < 0.35,
        slide: Math.random() < 0.35,
        waveform: Math.random() < 0.65 ? 'sawtooth' : 'square',
        filterMod: 0.5 + Math.random() * 1.2
      };
    }
  }

  // Live Bass Key & Octave Pitch Shift
  setRootKey(noteName) {
    const newRoot = ROOT_NOTES.find(n => n.name === noteName);
    if (!newRoot) return;

    const applyToDNA = (dna) => {
      if (!dna) return;
      const diff = newRoot.midi - dna.root.midi;
      if (diff === 0) return;
      dna.root = newRoot;
      for (const b of dna.bassSteps) b.midi += diff;
      for (const a of dna.acidSteps) a.midi += diff;
      for (const p of dna.percSteps) p.fmMidi += diff;
    };

    applyToDNA(this.pendingDNA);
    if (this.deckA) applyToDNA(this.deckA.dna);
    if (this.deckB) applyToDNA(this.deckB.dna);
    this.emitState();
  }

  setBassOctaveShift(octaveShift) {
    // octaveShift: -1, 0, +1
    this.macros.bassOctaveShift = octaveShift;
    this.emitState();
  }

  getActiveDNA() {
    if (!this.deckA || !this.deckB) return this.pendingDNA;
    if (this.isMixing) {
      return this.mixToDeck === 'A' ? this.deckA.dna : this.deckB.dna;
    }
    return this.activeDeckName === 'A' ? this.deckA.dna : this.deckB.dna;
  }

  emitState() {
    if (!this.onStateUpdate) return;
    const activeDNA = this.getActiveDNA();
    const secPerBar = (60 / this.currentBpm) * 4;
    const elapsedSec = Math.round(this.barsOnCurrentTrack * secPerBar);
    const totalSec = Math.round(this.totalTrackBars * secPerBar);
    const section = PsytranceAIEngine.getSectionForBar(this.barsOnCurrentTrack);

    this.onStateUpdate({
      isPlaying: this.isPlaying,
      isMixing: this.isMixing,
      crossfader: this.crossfader,
      activeDeckName: this.activeDeckName,
      currentBpm: this.currentBpm,
      barCount: this.barCount,
      barsOnCurrentTrack: this.barsOnCurrentTrack,
      totalTrackBars: this.totalTrackBars,
      elapsedSec,
      totalSec,
      sectionName: section.name,
      autoPilot: this.autoPilot,
      deckADNA: this.deckA ? this.deckA.dna : null,
      deckBDNA: this.deckB ? this.deckB.dna : null,
      activeDNA
    });
  }
}
