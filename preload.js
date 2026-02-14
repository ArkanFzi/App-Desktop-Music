const { contextBridge, ipcRenderer } = require('electron');

// Since we disabled contextIsolation for now to simplify, we might not strictly need this,
// but it's good practice to have the file.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
