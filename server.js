const express = require('express');
const bodyParser = require('body-parser');
const { connectDb } = require('./config/mongodbConnection');
const Feedback = require('./models/Feedback');
const cors = require('cors');

const app = express();
const PORT = 4404;

app.use(cors())
app.use(bodyParser.json());

// Connect to MongoDB
connectDb();

// Create
app.post('/feedbacks', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const feedback = new Feedback({ name, email, phone, message });
    await feedback.save()
      .then(savedFeedback => {
        res.send(savedFeedback);
      })
      .catch(error => {
        res.send(error);
      });
    // res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to insert feedback' });
  }
});

app.get('/health', (res, req) => {
  return res.status(200).json({
    title: "Test",
    message: "Prescription",
  });
})

// Read all feedbacks
app.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    console.error('Failed to fetch feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Read a single feedback
app.get('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.json(feedback);
  } catch (error) {
    console.error('Failed to fetch feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Update
app.put('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, message } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(id, { name, email, phoneNumber, message }, { new: true });
    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.json(feedback);
  } catch (error) {
    console.error('Failed to update feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Delete
app.delete('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Failed to delete feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
