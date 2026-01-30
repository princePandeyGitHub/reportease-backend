import express from 'express';

const app = express();

const PORT = 3000;

app.get('/',(req,res)=> {
    res.send("Backend is Alive");
});

app.listen(PORT, ()=> {
    console.log(`Backend is running at http://localhost:${PORT}`);
});