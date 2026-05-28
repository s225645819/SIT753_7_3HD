const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Production API!');
});

// INCIDENT SIMULATION: Intentionally broken health check
app.get('/health', (req, res) => {
    res.status(500).json({ status: 'DOWN', message: 'Application crashed!' });
});

// Export app for testing, but only listen if run directly
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;