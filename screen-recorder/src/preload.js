// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require('electron')
const { Menu, dialog } = require('@electron/remote');
const fs = require('fs');

contextBridge.exposeInMainWorld('api', {
    getVideoSources: async (options) => {
        return await ipcRenderer.invoke('get-sources', options)
    },
    showVideoSources: async (template) => {
        let menu = Menu.buildFromTemplate(template);
        menu.popup();
    },
    saveRecords: async (blob, ...args) => {
        const buffer = Buffer.from(await blob.arrayBuffer());

        const { filePath } = await dialog.showSaveDialog({
            buttonLabel: 'Save video',
            defaultPath: `vid-${Date.now()}.webm`
        });

        if (filePath) {
            fs.promises.writeFile(filePath, buffer, ...args)
        }
    }
})

