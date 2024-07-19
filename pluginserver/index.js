import os from 'os';
import pty from 'node-pty';
import express from 'express';

const app = express();
const port = 3009;

app.use(express.json());

app.post('/run-commands', (req, res) => {
    const { message } = req.body;
    const vaultPath = '/Users/jah/coding_Projects/garden/content'; // Replace with your actual vault path

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cwd: process.env.HOME,
        env: process.env
    });

    let command = `
        cd ${vaultPath};
        git add .;
        git commit -m "${message || 'blog changes'}";
        git push;
        cd ..;
        npm run deploy;
    `;

    ptyProcess.write(command + '\r');

    ptyProcess.on('data', (data) => {
        res.write(data);
    });

    ptyProcess.on('exit', (code) => {
        res.end(`Process exited with code ${code}`);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});