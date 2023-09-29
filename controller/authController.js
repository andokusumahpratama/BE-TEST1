const jwt = require('jsonwebtoken');
const {promisify} = require('util');

const catchAsync = require('../utils/catchAsync');
const Auth = require('./../models/authModels');
const AppError = require('./../utils/AppError');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) =>{    
    const token = signToken(user.id);    

    // * INI UNTUK MENGIRIM COOKIE KE BROWSER DAN MENJAGA KEAMANAN COOKIES
    const cookieOptions = {    
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),        
        httpOnly: true,        
    };
    
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // * Hidden password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsync(async(req, res, next) => {
    try{
        const newUser  = await Auth.create({
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password
        });
    
        createSendToken(newUser,201,res);
    }catch(err){        
        return next(new AppError(err.message, 404));
    }    
})

const loginAttempts = {};   // INI UNTUK MENYIMPAN LOG, DARI GAGAL LOGIN
exports.login = catchAsync(async(req, res, next) => {
    try{
        const { email, password } = req.body;
        // console.log(req.body, ' BUAJINGAN ', email, " ", password);        

        // ** 1) Check if email and password exist
        if(!email || !password){
            return next(new AppError('Please provide email and password', 400));
        }

        // ** 2) Check if users exist and password is correct
        const user = await Auth.find(email);                     

        const correct = await Auth.correctPassword(password, user.password);                        

         // * KEAMANAN/SECURITY
        if(!user || !correct){             
            // * CEK APAKAH USER SUDAH GAGAL MENCOBA LOGIN SEBANYAK 10X? JIKA SUDAH MAKA DIA TIDAK BISA LOGIN KEMBALI SELAMA 1 HARI
            const loginAttemptKey = `${email}_${req.ip}_${req.headers['user-agent']}`;
            loginAttempts[loginAttemptKey] = (loginAttempts[loginAttemptKey] || 0) + 1;

            // ** Check if login attempts exceeded the limit
            if (loginAttempts[loginAttemptKey] >= 10) {
                const blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // * Blok 1 Hari
                
                return next(new AppError(`Too many failed login attempts. Please try again after ${blockedUntil}`, 401));
            }

            return next(new AppError('Incorrect email and password', 401));
        }

        // ** Reset login attempts for the same email and device
        const loginAttemptKey = `${email}_${req.ip}_${req.headers['user-agent']}`;
        delete loginAttempts[loginAttemptKey];

        // ** 3) If everything ok, send token to client    
        createSendToken(user,200,res);
    }catch(err){
        return next(new AppError(err.message, 404));
    }
})

exports.protect = async(req, res, next) => {
    try{
        let token;

        // * 1) Cek Token
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){    // ini membaca token di postman
            token = req.headers.authorization.split(' ')[1];            
        }

        // console.log(req.cookies.jwt);                

        if(!token){
            return next(new AppError('You are not logged in! please log in to get access', 401));
        }
    
        // * 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
        // ** 3) Check if user still exists (intinya ini case dimana token udah digenerate serta berlaku token selama 2hari. tetapi user menghapus akun. inilah solusinya)
        const freshUser = await Auth.findById(decoded.id);
        if(!freshUser){
            return next(new Error('Token pengguna milik token ini sudah tidak ada lagi.'));            
        }
    
        req.user = freshUser;        
        next();
    }catch(err){        
        return next(new Error(''))
    }
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to access', 403));
        }
        next();
    }
}