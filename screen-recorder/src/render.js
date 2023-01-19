// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.querySelector('button#startBtn');
const stopBtn = document.querySelector('button#stopBtn');
const sourceBtn = document.querySelector('button#sourceBtn');
sourceBtn.onclick = getVideoSources;

async function getVideoSources() {
    const inputSources = await window.electron.desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    console.dir(inputSources);
}