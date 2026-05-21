const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Production API!');
});

// Monitoring Stage: Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Application is running smoothly.' });
});

// Export app for testing, but only listen if run directly
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;