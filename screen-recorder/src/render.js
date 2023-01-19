// Record states
let mediaRecorder;
const recordedChunks = [];

// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.querySelector('button#startBtn');
startBtn.onclick = (event) => {
    if (mediaRecorder.state === 'recording') {
        return;
    }
    mediaRecorder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording';
}

const stopBtn = document.querySelector('button#stopBtn');
stopBtn.onclick = (event) => {
    if (mediaRecorder.state === 'inactive') {
        return;
    }
    mediaRecorder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start';
}

const sourceBtn = document.querySelector('button#sourceBtn');
sourceBtn.onclick = getVideoSources;

async function getVideoSources(event) {
    const inputSources = await window.api.getVideoSources({
        types: ['window', 'screen']
    });

    await window.api.showVideoSources(inputSources.map(source => {
        return {
            label: source.name,
            click: () => selectSource(source)
        }
    }));
}

async function selectSource(source) {
    sourceBtn.innerText = source.name

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    });

    videoElement.srcObject = stream;
    videoElement.play();

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}

function handleDataAvailable(event) {
    console.log('video data available');

    recordedChunks.push(event.data);
}

async function handleStop(event) {
    console.log('video stopped');

    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    window.api.saveRecords(blob, () => console.log('video saved successfully!'));
}