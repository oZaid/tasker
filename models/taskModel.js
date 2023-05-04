const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A Task must have a Name...!"]
    },
    category: {
        type: String,
        default: "others",
        enum: {
            values: ["others", "mid", "expired"]
        }
    },
    deadline: {
        type: Date,
        required: [true, "Must Give Dead-line...!"]
    },
    createdAt: {
        type: Date,
        defalut: Date.now(),
        select: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: [true, 'Who made the task??!!'],
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })


taskSchema.pre(/^find/, function (next) {
    this.select('-__v')
    next();
});

taskSchema.virtual('dateFromat').get(function () {
    const then = new Date(this.deadline);
    const now = new Date();
    const remaining = Math.floor((then.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (remaining < 0) {
        return 'Expired'
    }
    return {
        remaining,
        day: then.getDate(),
        month: then.getMonth(),
        year: then.getFullYear()
    }
})


taskSchema.pre('save', function (next) {
    if (new Date() > new Date(this.deadline)) {
        this.category = "expired";
    }
    this.createdAt = new Date();
    next();
})

const Task = mongoose.model("Tasks", taskSchema);

module.exports = Task;