let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

const form = document.getElementById("clienteForm");
const formContainer = document.getElementById("formContainer");
const lista = document.getElementById("listaClientes");
const busca = document.getElementById("busca");

function salvarDados() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
}

function renderizarClientes(filtro = "") {

    lista.innerHTML = "";

    const termo = filtro.toLowerCase();

    const filtrados = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.cpf.toLowerCase().includes(termo)
    );

    if (filtrados.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum cliente encontrado.
                </td>
            </tr>
        `;

        return;
    }

    filtrados.forEach(cliente => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.telefone || "-"}</td>
            <td>${cliente.email || "-"}</td>

            <td>
                <button class="action-btn edit"
                    onclick="editarCliente(${cliente.id})">
                    Editar
                </button>

                <button class="action-btn delete"
                    onclick="excluirCliente(${cliente.id})">
                    Excluir
                </button>
            </td>
        `;

        lista.appendChild(tr);
    });
}

document.getElementById("novoCliente").addEventListener("click", () => {

    form.reset();

    document.getElementById("clienteId").value = "";

    document.getElementById("formTitle").textContent = "Novo Cliente";

    formContainer.classList.add("active");
});

document.getElementById("cancelar").addEventListener("click", () => {

    form.reset();

    formContainer.classList.remove("active");
});

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const id = document.getElementById("clienteId").value;

    const cliente = {
        id: id ? Number(id) : Date.now(),
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value
    };

    if (id) {

        const index = clientes.findIndex(c => c.id === Number(id));

        clientes[index] = cliente;

    } else {

        clientes.push(cliente);

    }

    salvarDados();

    renderizarClientes();

    form.reset();

    formContainer.classList.remove("active");
});

function editarCliente(id) {

    const cliente = clientes.find(c => c.id === id);

    if (!cliente) return;

    document.getElementById("clienteId").value = cliente.id;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("email").value = cliente.email;

    document.getElementById("formTitle").textContent = "Editar Cliente";

    formContainer.classList.add("active");
}

function excluirCliente(id) {

    const possuiVeiculo = (JSON.parse(localStorage.getItem("veiculos")) || [])
        .some(veiculo => veiculo.clienteId === id);

    if (possuiVeiculo) {
        alert("Não é possível excluir este cliente porque existem veículos vinculados a ele.");
        return;
    }

    if (!confirm("Deseja realmente excluir este cliente?")) {
        return;
    }

    clientes = clientes.filter(cliente => cliente.id !== id);

    salvarDados();

    renderizarClientes();
}

busca.addEventListener("input", () => {
    renderizarClientes(busca.value);
});

renderizarClientes();