const express = require('express');
const router = express.Router();
const Task = require('../../../models/task.model');

router.get('/', async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });
    
    res.json(tasks);
});

router.get('/detail/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false,
        });
        res.json(task);
    } catch(error) {
        res.json("Not found !");
    }
});

module.exports = router;