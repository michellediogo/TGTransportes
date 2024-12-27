const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const path = require('path');

// Configuração do CORS
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configuração do transportador de email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'michellediogossoares@gmail.com',
        pass: process.env.EMAIL_PASS
    }
});

// Rota para envio de email
app.post('/api/enviar-email', async (req, res) => {
    try {
        const { nome, email, mensagem } = req.body;
        
        const mailOptions = {
            from: email,
            to: 'gilmar@tmgtransporte.com.br',
            subject: `Nova mensagem de ${nome}`,
            text: mensagem
        };

        await transporter.sendMail(mailOptions);
        res.json({ sucesso: true, mensagem: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ 
            sucesso: false, 
            mensagem: 'Erro ao enviar email',
            erro: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});