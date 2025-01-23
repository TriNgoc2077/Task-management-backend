const express = require('express');
const router = express.Router();
const Task = require('../../../models/task.model');
// api/v1/tasks
router.get('/', async (req, res) => {
    console.log(req.query);
    const objectFind = {
        deleted: false
    };
    if (req.query.status) {
        objectFind.status = req.query.status;
    }

    const tasks = await Task.find(objectFind);
    
    res.json(tasks);
});
// /api/v1/tasks/detail/:id
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