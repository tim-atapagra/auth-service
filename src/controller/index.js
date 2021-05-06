const userService = require('../user/index');
const utils = require('../utils/index')
const bcrypt = require('bcrypt');

// constants
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 32;
const SALT_WORK_FACTOR = 12;

// one time password creds
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

/**
 * @method login
 */
exports.login = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName) return res.status(400).send('Username is required');
    if (!password) return res.status(400).send('password is required');

    const user = await userService.findOne({userName: userName});
    if (!user) return res.status(404).send('The username does not exist, please sign up for a new account');

    const authUser = await userService.findOne({userId: user.userId})

    if (!authUser.accountVerified) return res.status(404).send('Please check your phone to verify account before proceeding')

    const passCheck = await comparePassword(authUser, password);

    if (passCheck) {
        return res.status(200).json({token: authUser.token, expires: ''})
    } else {
        return res.status(404).send('Username or Password does not match, Please check again')
    }
}

/**
 * @method signup
 */
exports.signup = async (req, res) => {
    const { userName, password, email, phoneNumber } = req.body;
    if (!userName) return res.status(400).send('Username is required');
    if (!password) return res.status(400).send('Password is required');
    if (!email) return res.status(400).send('Email is required');
    if (!phoneNumber) return res.status(400).send('Phone number is required');

    const [hash, token, sanitizedEmail] = await Promise.all([hashPassword(password), generateAuthToken(), sanitizeEmail(email)])
    const randomHex  = await utils.randomHex(6);
    // create user
    const auth = await userService.create({
        userName: userName,
        password: hash,
        email: sanitizedEmail,
        phoneNumber: phoneNumber,
        token: token,
        otp: randomHex
    });

    const username = auth.userName;
    const otp = auth.otp;
    const mail = auth.email;
    const phone = auth.phoneNumber;

    // send user verification code. 
    client.messages
        .create({
        body: `Please verify your new Halen account with this code: ${randomHex}`,
        from: "+17472290054",
        to: `+1${phoneNumber}`
  })
  .then((message) => console.log(message.sid));

    // send user data back
    return res.status(201).send({username, password, mail, phone});
}

/**
 * @method validate phone number
 */
exports.validate = async (req, res) => {
    const { userName, otp } = req.body;
    if (!userName) return res.status(400).send('Username is required');
    if (!otp) return res.status(400).send('One time passcode is required to verify account');

    // check username
    const user = await userService.findOne({userName: userName});
    if (!user) return res.status(404).send('Username not found. Please check and try again');

    // check otp
    if (user.otp !== otp) {
        return res.status(400).send('Passcode does not match, please try again')
    } else {
        await userService.findOneAndUpdate({userName: userName},{accountVerified: true} )
    }

    return res.status(200).send('Your account is successfully confirmed!')
}


 async function generateAuthToken() {
    const hex = await utils.randomHex(64)
    return hex.toLowerCase()
}

function sanitizeEmail(input) {
    return String(input)
    .trim()
    .toLowerCase()
}

function sanitizePassword(input) {
    const output = String(input).trim()
    if (output.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    }
    if (output.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`password must be ${MAX_PASSWORD_LENGTH} characters or less.`)
    }
    return output
}

async function hashPassword(input) {
    const output = sanitizePassword(input)
    return await bcrypt.hash(output, SALT_WORK_FACTOR)
}

async function comparePassword(auth, input) {
    const output = sanitizePassword(input)
    const match = await bcrypt.compare(output, auth.password)
    if (!match) {
    return false;
    }
    return true;
}