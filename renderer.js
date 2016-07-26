// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = remote;
const setApplicationMenu = require('./menu');

const form = document.querySelector('form');

const inputs = {
    source: form.querySelector('input[name="source"]'),
    destination: form.querySelector('input[name="destination"]'),
    name: form.querySelector('input[name="name"]'),
    fps: form.querySelector('input[name="fps"]'),
};


const buttons = {
    source: document.getElementById('chooseSource'),
    destination: document.getElementById('chooseDestination'),
    submit: form.querySelector('button[type="submit"]'),
};

ipcRenderer.on('did-finish-load', () => {
    setApplicationMenu();
});

ipcRenderer.on('processing-did-succeed', (event, html) => {
    shell.openExternal(`file://${html}`);
});

ipcRenderer.on('processing-did-fail', (event, error) => {
    console.error(error);
    alert('Failed :\'(');
});

buttons.source.addEventListener('click', () => {
    const directory = dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    if (directory) {
        inputs.source.value = directory;
    }
});

buttons.destination.addEventListener('click', () => {
    const directory = dialog.showOpenDialog({
        properties: [
            'openDirectory',
            'createDirectory',
        ],
    });
    if (directory) {
        inputs.destination.value = directory;
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    ipcRenderer.send('did-submit-form', {
        source: inputs.source.value,
        destination: inputs.destination.value,
        name: inputs.name.value,
        fps: inputs.fps.value,
    });
});
