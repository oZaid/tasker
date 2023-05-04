const tasks = require('./../controllers/taskControl');
const express = require('express')
const authControl = require('./../controllers/authControl');
const Task = require('../models/taskModel');

const router = express.Router()


// router.use(authControl.protect)

router.route('/').get(authControl.protect, tasks.getAllTasks)
  .post(tasks.createTask)

router.route('/user/:id').get(async (req, res) => {
  const tasks = await Task.find({ user: req.params.id })
  res.status(200).json({
    status: 'success',
    data: tasks
  })
})
router.route('/:id')
  .patch(tasks.updateTask)
  .delete(tasks.deleteTask)
// .get(tasks.getTask)

router.route('/nearest').get(tasks.nearestFive, tasks.getAllTasks);


module.exports = router;