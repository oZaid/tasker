const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Enter a Username...!"],
        lowercase: true,
        unique: [true, "Username is Taken...!"],
        minlength: 2
    },
    email: {
        type: String,
        required: [true, "Must Enter an Email...!"],
        unique: [true, "Email is Taken...!"],
        validate: isEmail,
    },
    password: {
        type: String,
        required: [true, "Enter a Password...!"],
        select: false,
        minlength: 4
    },
    passwordConfirm: {
        type: String,
        required: [true, "Enter a Password...!"],
        validate: {
            // Works Only on Crate and Save
            validator: function (el) {
                return el === this.password;
            },
            msg: "Password and Confirm-Password are NOT the same..."
        }
    },
    isChanged: Date,
    passwordResetToken: String,
    passwordResetExpires: Date, // As a SECURITY measure
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}
    ,
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

// Documents Middle-wares
userSchema.pre('save', async function (next) {
    this.role = 'user';
    if (!this.isModified('password')) {
        return next()
    }


    this.passwordConfirm = undefined;
    this.password = await bcrypt.hash(this.password, 10);
    next()
})


// Virtuals
userSchema.virtual('tasks', {
    ref: 'Tasks',
    foreignField: 'user',
    localField: '_id'
})

userSchema.pre(/^find/, function (next) {
    this.populate('tasks')
    next()
})

// Schema Methods
userSchema.methods.correctPassword = async function (givenPassword, userPassword) {
    return await bcrypt.compare(givenPassword, userPassword);
};
userSchema.methods.checkPasswordChanged = function (JWTTimestamp) {
    if (this.isChanged) {
        const changeTimestamp = parseInt(this.isChanged.getTime() / 1000, 10)

        return JWTTimestamp < changeTimestamp;
    }

    return false;
}


userSchema.methods.createPasswordResetToken = function () {
    // Generate a token to send it to User email
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Encrypt the token then store it in db, then compare it after
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + (10 * 60 * 1000)

    return resetToken;
}
const User = mongoose.model('users', userSchema);

module.exports = User;