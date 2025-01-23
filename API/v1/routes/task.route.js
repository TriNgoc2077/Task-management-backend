const express = require('express');
const router = express.Router();
const Task = require('../../../models/task.model');
const paginationHelper = require("../../../helpers/pagination");
// api/v1/tasks
router.get('/', async (req, res) => {
    const objectFind = {
        deleted: false
    };
    if (req.query.status) {
        objectFind.status = req.query.status;
    }
    const objectSort = {};
    if (req.query.sortKey && req.query.sortValue) {
        objectSort[req.query.sortKey] = req.query.sortValue;
    }
    //pagination
    const initPagination = {
        currentPage: 1,
        limitItem: 4,
    };
    const countTask = await Task.countDocuments(objectFind);
    const objectPagination = paginationHelper(initPagination, req.query, countTask);

    const tasks = await Task.find(objectFind)
                            .sort(objectSort)
                            .limit(objectPagination.limitItem)
                            .skip(objectPagination.skip);
    
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