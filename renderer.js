// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote, shell } = require('electron');
const { Menu } = remote;

function createMenu() {
    const template = [
        {
            label: 'Debug',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click(item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.reload();
                        }
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click(item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.webContents.toggleDevTools();
                        }
                    },
                },
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'karriere.at',
                    click() {
                        shell.openExternal('http://www.karriere.at');
                    },
                },
                {
                    label: 'manu.ninja',
                    click() {
                        shell.openExternal('https://manu.ninja');
                    },
                },
            ],
        },
    ];

    if (process.platform === 'darwin') {
        const name = remote.app.getName();
        template.unshift({
            label: name,
            submenu: [
                {
                    role: 'about',
                },
                {
                    type: 'separator',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'hide',
                },
                {
                    role: 'hideothers',
                },
                {
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    role: 'quit',
                },
            ],
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function handleEvents() {
    ipcRenderer.on('did-finish-load', (event, arg) => {
        createMenu();
        console.log(arg);
    });
}

handleEvents();
