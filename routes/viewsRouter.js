const express = require('express')
const authControl = require('./../controllers/authControl')
const viewControl = require('./../controllers/viewControl')

const router = express.Router()


router.route('/signup')
  .get(viewControl.signup)

router.route('/login')
  .get(viewControl.login)

router.route('/forgot').get(viewControl.forgot);
router.route('/reset/:token').get(viewControl.reset)


router.route('/')
  .get(authControl.protect, viewControl.main)
// .post()

module.exports = router;
