const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Vulnerability 1: Command Injection
app.get('/exec', (req, res) => {
    const command = req.query.command;
    require('child_process').exec(command, (err, stdout, stderr) => {
        if (err) return res.status(500).send(`Error: ${stderr}`);
        res.send(`Output: ${stdout}`);
    });
});

// Vulnerability 2: Reflected XSS
app.get('/greet', (req, res) => {
    const name = req.query.name;
    res.send(`<h1>Hello, ${name}!</h1>`);
});

// Vulnerability 3: Insecure Direct Object Reference (IDOR)
const users = [
    { id: 1, name: 'Alice', secret: 'Alice\'s secret data' },
    { id: 2, name: 'Bob', secret: 'Bob\'s secret data' }
];

app.get('/user/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User not found');
    }
});

// Vulnerability 4: Sensitive Information Exposure
app.get('/config', (req, res) => {
    const config = {
        adminPassword: 'password123', // Insecure: Hard-coded sensitive data
        databaseURL: 'mongodb://localhost:27017'
    };
    res.send(config);
});

app.listen(PORT, () => {
    console.log(`Vulnerable app listening on http://localhost:${PORT}`);
});

