const btn = document.getElementById("btn")

btn.addEventListener("click", async (e)=>{
    e.preventDefault();
    
    
    const email = document.getElementById('email').value.trim()
    const senha = document.getElementById('senha').value
    
    
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
            alert(data.message);
            window.location.href = 'pagina1.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Não foi possível conectar ao servidor.');
    }
});