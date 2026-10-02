// Simula o usuário autenticado
if (!sessionStorage.getItem("usuario")) {
    sessionStorage.setItem("usuario", "Administrador");
}

const nomeUsuario = sessionStorage.getItem("usuario");

document.getElementById("nomeUsuario").textContent = nomeUsuario;

// Carrega os dados do localStorage
const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
const veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
const ordens = JSON.parse(localStorage.getItem("ordens")) || [];

// Atualiza os números do dashboard
document.getElementById("totalClientes").textContent = clientes.length;
document.getElementById("totalVeiculos").textContent = veiculos.length;
document.getElementById("totalOS").textContent = ordens.length;

// Logout
document.getElementById("logout").addEventListener("click", function () {

    sessionStorage.removeItem("usuario");

    window.location.href = "index.html";
});