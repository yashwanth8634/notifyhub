import express from 'express'

const app = express();

app.get('/',(req,res)=>{
    res.send('Hello NotifyHub backend is running')
})

app.listen(3000,()=>{
    console.log('NotifyHub backend is running on port 3000')
})