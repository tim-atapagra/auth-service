const userService = require('../user/index');
const utils = require('../utils/index')
const bcrypt = require('bcrypt');

// constants
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 32;
const SALT_WORK_FACTOR = 12;

/**
 * @method login
 */
exports.login = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName) res.status(400).send('Username is required');
    if (!password) res.status(400).send('password is required');

    const user = await userService.findOne({userName: userName});
    if (!user) res.status(404).send('The username does not exist, please sign up for a new account');

    const authUser = await userService.findOne({userId: user.userId})

    const passCheck = await comparePassword(authUser, password);

    if (passCheck) {
        res.status(200).json({token: authUser.token, expires: ''})
    } else {
        res.status(404).send('Username or Password does not match, Please check again')
    }
}

/**
 * @method signup
 */
exports.signup = async (req, res) => {
    const { userName, password, email, phoneNumber } = req.body;
    if (!userName) res.status(400).send('Username is required');
    if (!password) res.status(400).send('Password is required');
    if (!email) res.status(400).send('Email is required');
    if (!phoneNumber) res.status(400).send('Phone number is required');

    const [hash, token, sanitizedEmail] = await Promise.all([hashPassword(password), generateAuthToken(), sanitizeEmail(email)])

    const auth = await userService.create({
        userName: userName,
        password: hash,
        email: sanitizedEmail,
        phoneNumber: phoneNumber,
        token: token
    });

    // send one time password to email and password
    res.status(201).send({auth});
}

/**
 * @method validate phone number
 */
validate = async (req, res) => {
    const user = req.body;
    // generate random one time password and send to email or phone

    // on successful response, 
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