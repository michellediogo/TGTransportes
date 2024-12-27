const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/enviar-contato', async (req, res) => {
    console.log('Requisição recebida:', req.body);
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'Novo Contato - TG Transportes',
            html: `
                <h2>Novo Contato do Site</h2>
                <p><strong>Nome:</strong> ${req.body.nome}</p>
                <p><strong>Email:</strong> ${req.body.email}</p>
                <p><strong>Mensagem:</strong> ${req.body.mensagem}</p>
                <p><small>Enviado em: ${new Date().toLocaleString('pt-BR')}</small></p>
            `
        });

        console.log('Email enviado com sucesso');
        res.json({ 
            status: 'success', 
            message: 'Mensagem enviada com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro ao enviar mensagem. Tente novamente.',
            error: error.message
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Email configurado:', process.env.EMAIL);
});