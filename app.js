const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const dataRouter = require('./routes/dataRoute');
const authRouter = require('./routes/authRoute');
const dataModel = require('./models/dataModels');
const globalErrorHandling = require('./controller/errorController');

const app = express();

// * Developemnt logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// * Body parser, Membaca data dari body postman into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cookieParser()); 

// * Insert data https://livethreatmap.radware.com/ ke dalam database
app.post('/insert', async (req, res) => {
    const response = await fetch('https://livethreatmap.radware.com/api/map/attacks?limit=10');
    const data = await response.json();    

    // * Menggunakan reduce untuk menggabungkan semua objek menjadi satu array tunggal
    const dataAttack = data.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);
    
    // * Memasukan data kedalam database
    dataModel.insertAttacks(dataAttack);            

    res.status(201).json({
        status: 'success',        
        hasil: {
            dataAttack
        }
    })
})

// * Routes
app.use('/api/v1/akun', authRouter); 
app.use('/api/v1/data', dataRouter); 

// ? ====GLOBAL HANDLING ERROR MIDDLEWARE====
app.use(globalErrorHandling);

module.exports = app;