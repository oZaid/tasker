const Task = require('./../models/taskModel');
const TasksFeat = require('./../utils/taskFeat');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.nearestFive = catchAsync(async (req, res, next) => {
    req.query.sort = 'deadline,category';
    req.query.limit = '5';
    next();
})

exports.getAllTasks = catchAsync(async (req, res) => {
    const seek = new TasksFeat(Task.find(), req.query)
        .filter()
        .sort()
        .fields()
        .limitation()
    const tasks = await seek.model;


    res.status(200).json({
        status: "success",
        results: tasks.length,
        data: tasks
    });
});

exports.getTask = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!id) return next(new AppError("There is no givin Identfier!", 401))

    res.status(200).json({
        status: "success",
        task
    });
});

exports.createTask = catchAsync(async (req, res, next) => {
    const task = await Task.create(req.body);
    res.status(201).json({
        stats: "success",
        task
    })
});

exports.updateTask = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) return next(new AppError("There is no givin Identfier!", 401))
    await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    const updated = await Task.findById(id);

    res.status(200).json({
        status: "succes",
        updated
    })
})

exports.deleteTask = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!id) return next(new AppError("There is no givin Identfier!", 401))
    await Task.findByIdAndDelete(id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

