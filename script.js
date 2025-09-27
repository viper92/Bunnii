const defaultFrames = `
           _.-""-._
        .-'        '-.
       /              \
      ;   .-"``"-.     ;
      |  /  _  _  \    |
      | |  (o)(o) |    |
      | |    __   |    |
      |  \  '--' /     |
      ;   '-.__.-'     ;
       \              /
        '-.        .-'
           '-.__.-'
---
           _.-""-._
        .-'        '-.
       /              \
      ;   .-"``"-.     ;
      |  /  _  _  \    |
      | |  (o)(o) |    |
      | |    __   |    |
      |  \  '--' /     |
      ;    '-.__.-'    ;
       \     .--.     /
        '-.  '--'  .-'
           '-.__.-'
---
           _.-""-._
        .-'        '-.
       /              \
      ;   .-"``"-.     ;
      |  /  _  _  \    |
      | |  (o)(o) |    |
      | |    __   |    |
      |  \  '--' /     |
      ;    .-.__.-.    ;
       \   ( >  < )   /
        '-. '--'  .-'
           '-.__.-'
---
           _.-""-._
        .-'        '-.
       /              \
      ;   .-"``"-.     ;
      |  /  _  _  \    |
      | |  (o)(o) |    |
      | |    __   |    |
      |  \  '--' /     |
      ;    '-.__.-'    ;
       \     '--'     /
        '-.        .-'
           '-.__.-'
---
           _.-""-._
        .-'        '-.
       /              \
      ;   .-"``"-.     ;
      |  /  _  _  \    |
      | |  (o)(o) |    |
      | |    __   |    |
      |  \  '--' /     |
      ;    .-.__.-.    ;
       \   ( >  < )   /
        '-. '--'  .-'
           '-.__.-'
---
           _.-""-._
        .-'        '-.
       /              \
      ;   .-"``"-.     ;
      |  /  _  _  \    |
      | |  (o)(o) |    |
      | |    __   |    |
      |  \  '--' /     |
      ;    '-.__.-'    ;
       \     .--.     /
        '-.  '--'  .-'
           '-.__.-'
`.trim().replace(/\r/g, '').split(/\n---\n/);

const frameDisplay = document.getElementById('frameDisplay');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const stepBtn = document.getElementById('stepBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const frameRange = document.getElementById('frameRange');
const frameCount = document.getElementById('frameCount');
const frameFile = document.getElementById('frameFile');

let frames = [...defaultFrames];
let frameRate = Number(speedSlider.value);
let currentFrame = 0;
let isPlaying = false;
let animationHandle = null;
let lastTimestamp = 0;

function renderFrame(index) {
  if (!frames.length) {
    frameDisplay.textContent = 'Load a frame file to begin playback.';
    frameCount.textContent = '0 / 0';
    frameRange.value = 0;
    frameRange.max = 0;
    return;
  }

  currentFrame = ((index % frames.length) + frames.length) % frames.length;
  frameDisplay.textContent = frames[currentFrame];
  frameRange.value = currentFrame;
  frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;
}

function stepForward() {
  renderFrame(currentFrame + 1);
}

function updateFrameRate(value) {
  frameRate = Number(value);
  speedValue.textContent = `${frameRate} fps`;
}

function play() {
  if (!frames.length) {
    return;
  }
  if (!isPlaying) {
    isPlaying = true;
    playPauseBtn.textContent = 'Pause';
    lastTimestamp = performance.now();
    animationHandle = requestAnimationFrame(tick);
  }
}

function pause() {
  if (isPlaying) {
    isPlaying = false;
    playPauseBtn.textContent = 'Play';
    if (animationHandle) {
      cancelAnimationFrame(animationHandle);
    }
  }
}

function stop() {
  pause();
  renderFrame(0);
}

function tick(timestamp) {
  if (!isPlaying) {
    return;
  }

  const elapsed = timestamp - lastTimestamp;
  const frameDuration = 1000 / frameRate;

  if (elapsed >= frameDuration) {
    lastTimestamp = timestamp - (elapsed % frameDuration);
    stepForward();
  }

  animationHandle = requestAnimationFrame(tick);
}

function setFrames(newFrames) {
  frames = newFrames.filter((frame) => frame.trim().length > 0);
  frameRange.max = Math.max(frames.length - 1, 0);
  renderFrame(0);
}

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

stopBtn.addEventListener('click', stop);
stepBtn.addEventListener('click', () => {
  pause();
  stepForward();
});

speedSlider.addEventListener('input', (event) => {
  updateFrameRate(event.target.value);
});

frameRange.addEventListener('input', (event) => {
  pause();
  renderFrame(Number(event.target.value));
});

frameFile.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result);
    const parsed = text.replace(/\r/g, '').split(/\n---\n/);
    setFrames(parsed);
  };
  reader.readAsText(file);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pause();
  }
});

updateFrameRate(frameRate);
setFrames(frames);
