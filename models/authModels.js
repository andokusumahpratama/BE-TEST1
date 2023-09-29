const pool = require('./db');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AppError = require('./../utils/AppError');

function validatorInput(data){
            
    // Lakukan validasi data
    if (!data?.email) {
        throw new Error('Please provide your email');
    }
    if (!validator.isEmail(data?.email)) {        
        throw new Error('Please correct the email');
    }
    if (!data?.name ) {
        throw new Error('A user must have a name');
    }    
    if (!['user', 'admin'].includes(data?.role)) {
        throw new Error('Invalid role');
    }
    if (!data?.password || data?.password.length < 8) {
        throw new Error('Please provide a password with at least 8 characters');
    }                
}
    

async function correctPassword(candidatePassword, userPassword){    
    return await bcrypt.compare(candidatePassword, userPassword);    
}

async function create(data){

    validatorInput(data);

    const insertQuery = `
        INSERT INTO akun (name, email, role, password)
        VALUES ($1, $2, $3, $4) RETURNING *
    `;

    const client = await pool.connect();

    data.password = await bcrypt.hash(data.password, 12);

    const value = [
        data.name, 
        data.email, 
        data.role, 
        data.password
    ];
    

    try{        
        const result = await client.query(insertQuery, value);        
        
        const createdAccount = result.rows[0]; 
        console.log('Account successfully created:');
        return createdAccount; 
    } catch(err){
        throw new Error('The Account has already been created')
    }finally{
        client.release(); // Release the client back to the pool
    }
}

async function find(email){                
    const client = await pool.connect();
    try {
        if(!validator.isEmail(email)) throw new Error('Please correct the email')
        const query = 'SELECT * FROM akun WHERE email = $1';        
        const result = await client.query(query, [email]);                

        if(result.rows[0] === undefined) return({email: '', password: ''});

        return result.rows[0]; // Mengambil data pertama yang cocok        
    } catch (error) {        
        throw error;
    } finally{
        client.release();
    }
}

async function findById(id){
    const client = await pool.connect();
    try {
        const query = 'SELECT name, email, role FROM akun WHERE id = $1';        
        const result = await client.query(query, [id]);        

        return result.rows[0]; // Mengambil data pertama yang cocok
    } catch (error) {
        throw error;
    } finally{
        client.release();
    }
}

module.exports = {create, find, correctPassword, findById};