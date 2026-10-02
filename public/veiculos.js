let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

const form = document.getElementById("veiculoForm");
const formContainer = document.getElementById("formContainer");
const lista = document.getElementById("listaVeiculos");
const selectCliente = document.getElementById("clienteId");

function salvarDados() {
    localStorage.setItem("veiculos", JSON.stringify(veiculos));
}

function carregarClientes() {

    clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    selectCliente.innerHTML =
        '<option value="">Selecione um cliente</option>';

    clientes.forEach(cliente => {

        const option = document.createElement("option");

        option.value = cliente.id;
        option.textContent = `${cliente.nome} - ${cliente.cpf}`;

        selectCliente.appendChild(option);
    });
}

function renderizarVeiculos() {

    lista.innerHTML = "";

    if (veiculos.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhum veículo cadastrado.
                </td>
            </tr>
        `;

        return;
    }

    veiculos.forEach(veiculo => {

        const cliente = clientes.find(
            cliente => cliente.id === veiculo.clienteId
        );

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${veiculo.placa}</td>
            <td>${veiculo.marca}</td>
            <td>${veiculo.modelo}</td>
            <td>${veiculo.ano}</td>
            <td>${cliente ? cliente.nome : "Cliente não encontrado"}</td>

            <td>

                <button
                    class="action-btn"
                    onclick="editarVeiculo(${veiculo.id})">
                    Editar
                </button>

                <button
                    class="action-btn"
                    onclick="excluirVeiculo(${veiculo.id})">
                    Excluir
                </button>

            </td>
        `;

        lista.appendChild(tr);
    });
}

document.getElementById("novoVeiculo").addEventListener("click", () => {

    carregarClientes();

    if (clientes.length === 0) {

        alert("Cadastre um cliente antes de cadastrar um veículo.");

        window.location.href = "../clientes/clientes.html";

        return;
    }

    form.reset();

    document.getElementById("veiculoId").value = "";

    document.getElementById("formTitle").textContent = "Novo Veículo";

    formContainer.classList.add("active");
});

document.getElementById("cancelar").addEventListener("click", () => {

    form.reset();

    formContainer.classList.remove("active");
});

form.addEventListener("submit", event => {

    event.preventDefault();

    const id = document.getElementById("veiculoId").value;

    const veiculo = {

        id: id ? Number(id) : Date.now(),

        placa: document.getElementById("placa").value.toUpperCase(),

        marca: document.getElementById("marca").value,

        modelo: document.getElementById("modelo").value,

        ano: document.getElementById("ano").value,

        clienteId: Number(
            document.getElementById("clienteId").value
        )
    };

    if (!veiculo.clienteId) {

        alert("Selecione um cliente.");

        return;
    }

    if (id) {

        const index = veiculos.findIndex(
            veiculo => veiculo.id === Number(id)
        );

        veiculos[index] = veiculo;

    } else {

        veiculos.push(veiculo);
    }

    salvarDados();

    renderizarVeiculos();

    form.reset();

    formContainer.classList.remove("active");
});

function editarVeiculo(id) {

    carregarClientes();

    const veiculo = veiculos.find(
        veiculo => veiculo.id === id
    );

    if (!veiculo) return;

    document.getElementById("veiculoId").value = veiculo.id;
    document.getElementById("placa").value = veiculo.placa;
    document.getElementById("marca").value = veiculo.marca;
    document.getElementById("modelo").value = veiculo.modelo;
    document.getElementById("ano").value = veiculo.ano;
    document.getElementById("clienteId").value = veiculo.clienteId;

    document.getElementById("formTitle").textContent = "Editar Veículo";

    formContainer.classList.add("active");
}

function excluirVeiculo(id) {

    if (!confirm("Deseja realmente excluir este veículo?")) {
        return;
    }

    veiculos = veiculos.filter(
        veiculo => veiculo.id !== id
    );

    salvarDados();

    renderizarVeiculos();
}

carregarClientes();
renderizarVeiculos();