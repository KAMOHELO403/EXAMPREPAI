const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// API endpoint for AI (you can keep your old logic here)
app.post('/api/chat', async (req, res) => {
  // For now, simple response - you can add your AI logic later
  res.json({ reply: "Hello! I am ExamPrep AI. How can I help you study?" });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
