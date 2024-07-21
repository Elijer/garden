import os from 'os';
import pty from 'node-pty';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3009;

app.use(cors()); // Enable CORS
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

    // Accumulate output and errors
    let output = '';
    let errorOutput = '';

    // Define command sequence
    const commands = [
        `cd ${vaultPath}`,
        'git add .',
        `git commit -m "${message || 'blog changes'}"`,
        'git push',
        'cd ..',
        'git add .',
        'git push',
        'npm run deploy'
    ];

    // Write each command separately
    commands.forEach(cmd => ptyProcess.write(`${cmd}\r`));

    // End input and handle output
    ptyProcess.write('\x04'); // Send EOF signal to end the input

    ptyProcess.on('data', (data) => {
        output += data;
    });

    ptyProcess.on('exit', (code) => {
      console.log("Exited")
        if (code !== 0) {
            errorOutput += `Process exited with code ${code}`;
        }
        res.status(code === 0 ? 200 : 500).end(output || errorOutput);
    });

    // Error handling for ptyProcess
    ptyProcess.on('error', (error) => {
      console.log("There was an error")
        res.status(500).end(`Error: ${error.message}`);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
