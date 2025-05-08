const WebSocket = require('ws');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

let clipboardy;
(async () => {
  clipboardy = (await import('clipboardy')).default;

  const wss = new WebSocket.Server({ port: 8080 });
  let lastClipboardText = '';

  wss.on('connection', ws => {
    console.log('Client connected');
    ws.send(JSON.stringify({ text: lastClipboardText }));
  });

  setInterval(async () => {
    try {
      const currentText = await clipboardy.read();
      if (
        typeof currentText === 'string' &&
        currentText.trim() !== '' &&
        currentText !== lastClipboardText
      ) {
        lastClipboardText = currentText;
        const data = JSON.stringify({ text: currentText });

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        });

        console.log(`${currentText.slice(0, 300)}...`);
      }
    } catch (err) {
      console.error('Ошибка при чтении буфера:', err);
    }
  }, 1000);

  const filePath = path.join(__dirname, 'index.html');
  if (fs.existsSync(filePath)) {
    const url = `file://${filePath}`;
    exec(`start ${url}`);
  } else {
    console.warn('index.html не найден.');
  }
})();
