const express = require("express");
const app = express();

const BASE_URL = "/api/v1";

const votes = new Map();

app.use(express.json());

/*
 * GET      /talks
 * POST     /talks
 * GET      /talks/:id
 * PUT      /talks/:id
 * DELETE   /talks/:id
 * GET      /talks/:id/votes
 * POST     /talks/:id/votes
 */

app.post(`${BASE_URL}/talks`, (req, res) => {
    const talkId = req.body.talkId;
    if (!talkId) {
        return res.status(400).json({ message: "Talk ID is required" });
    }
    if (votes.has(talkId)) {
        return res.status(409).json({ message: "Talk already exists" });
    }
    votes.set(talkId, new Array());
    res.status(201).json({ message: "Talk created", talkId });
});

app.delete(`${BASE_URL}/talks/:talkId`, (req, res) => {
    const talkId = req.params.talkId;
    if (!talkId) {
        return res.status(400).json({ message: "Talk ID is required" });
    }
    if (!votes.has(talkId)) {
        return res.status(404).json({ message: "Talk not found" });
    }
    votes.delete(talkId);
    res.status(200).json({ message: "Talk deleted" });
});

app.post(`${BASE_URL}/talks/:talkId/votes`, (req, res) => {
    const talkId = req.params.talkId;
    const vote = req.body.vote;
    if (!talkId) {
        return res.status(400).json({ message: "Talk ID is required" });
    }
    if (!vote) {
        return res.status(400).json({ message: "Vote is required" });
    }
    if (!votes.has(talkId)) {
        return res.status(404).json({ message: "Talk not found" });
    }
    votes.get(talkId).push(vote);
    res.status(201).json({ message: "Vote added" });
});

app.get(`${BASE_URL}/talks/:talkId/votes/result`, (req, res) => {
    const talkId = req.params.talkId;
    if (!talkId) {
        return res.status(400).json({ message: "Talk ID is required" });
    }
    if (!votes.has(talkId)) {
        return res.status(404).json({ message: "Talk not found" });
    }
    const talkVotes = votes.get(talkId);
    let result = {
        count: 0,
        average: 0,
    };
    if (talkVotes.length > 0) {
        result.count = talkVotes.length;
        result.average = talkVotes.reduce((a, b) => a + b, 0) / talkVotes.length;
    }
    res.status(200).json({ message: "Vote result", result });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});