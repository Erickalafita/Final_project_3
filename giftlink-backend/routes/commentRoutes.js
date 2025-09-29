const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const axios = require('axios');

// Get comments for a specific gift
router.get('/:giftId', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('comments');

        const giftId = req.params.giftId;
        const comments = await collection.find({ giftId: giftId }).toArray();

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add a new comment with sentiment analysis
router.post('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('comments');

        const { giftId, author, comment } = req.body;

        if (!giftId || !author || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Call sentiment analysis service
        let sentiment = 'neutral';
        let sentimentScore = 0;

        try {
            const sentimentResponse = await axios.post(
                `${process.env.SENTIMENT_URL || 'http://localhost:3000'}/sentiment`,
                { sentence: comment }
            );
            sentiment = sentimentResponse.data.sentiment;
            sentimentScore = sentimentResponse.data.sentimentScore;
        } catch (sentimentError) {
            console.error('Sentiment analysis failed:', sentimentError.message);
            // Continue without sentiment if service fails
        }

        // Insert comment with sentiment
        const newComment = {
            giftId,
            author,
            comment,
            sentiment,
            sentimentScore,
            timestamp: new Date(),
            createdAt: new Date()
        };

        const result = await collection.insertOne(newComment);

        res.status(201).json({
            message: 'Comment added successfully',
            comment: { ...newComment, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

module.exports = router;