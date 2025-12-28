const express = require("express");
const router = express.Router();
const { calculateReading } = require("../services/billingService");

router.post("/calculate-reading", async (req, res) => {
  try {
    const { readingId } = req.body;
    if (!readingId) {
      return res.status(400).json({ error: "readingId required" });
    }

    await calculateReading(readingId);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
