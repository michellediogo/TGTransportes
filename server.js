document.addEventListener('DOMContentLoaded', function() {
    // Menu Hamburguer
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Formulário de Contato
    const form = document.querySelector('#formulario-contato');
    const errorMessage = document.querySelector('.error-message');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.display = 'none';
    successMessage.style.color = 'green';
    successMessage.style.marginTop = '1rem';
    form.appendChild(successMessage);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Desabilita o botão durante o envio
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        const formData = {
            nome: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            mensagem: form.querySelector('[name="message"]').value
        };

        try {
            const response = await fetch('https://tgtransportes.onrender.com/api/enviar-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.sucesso) {
                // Mensagem de sucesso
                successMessage.textContent = 'Mensagem enviada com sucesso!';
                successMessage.style.display = 'block';
                form.reset();
                
                // Esconde a mensagem de erro se estiver visível
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }

                // Esconde a mensagem de sucesso após 5 segundos
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            } else {
                throw new Error(data.mensagem || 'Erro ao enviar mensagem');
            }
        } catch (error) {
            console.error('Erro:', error);
            if (errorMessage) {
                errorMessage.textContent = 'Erro ao enviar mensagem. Tente novamente.';
                errorMessage.style.display = 'block';
            }
        } finally {
            // Reabilita o botão após o envio (sucesso ou erro)
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensagem';
        }
    });

    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});