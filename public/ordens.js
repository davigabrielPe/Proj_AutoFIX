let ordens = JSON.parse(localStorage.getItem("ordens")) || [];
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];

const form = document.getElementById("osForm");
const formContainer = document.getElementById("formContainer");

const selectCliente = document.getElementById("clienteId");
const selectVeiculo = document.getElementById("veiculoId");

const lista = document.getElementById("listaOS");

function salvarDados() {

    localStorage.setItem(
        "ordens",
        JSON.stringify(ordens)
    );
}

function carregarDados() {

    clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    veiculos =
        JSON.parse(localStorage.getItem("veiculos")) || [];
}

function carregarClientes() {

    selectCliente.innerHTML = `
        <option value="">
            Selecione um cliente
        </option>
    `;

    clientes.forEach(cliente => {

        const option = document.createElement("option");

        option.value = cliente.id;
        option.textContent = cliente.nome;

        selectCliente.appendChild(option);
    });
}

function carregarVeiculos(clienteId = null) {

    selectVeiculo.innerHTML = `
        <option value="">
            Selecione um veículo
        </option>
    `;

    const listaVeiculos = clienteId
        ? veiculos.filter(
            veiculo =>
                veiculo.clienteId === Number(clienteId)
        )
        : veiculos;

    listaVeiculos.forEach(veiculo => {

        const option = document.createElement("option");

        option.value = veiculo.id;

        option.textContent =
            `${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}`;

        selectVeiculo.appendChild(option);
    });
}

selectCliente.addEventListener("change", function () {

    carregarVeiculos(this.value);

});

function formatarData(data) {

    if (!data) return "-";

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function renderizarOS() {

    lista.innerHTML = "";

    carregarDados();

    const ordenadas = [...ordens].sort(
        (a, b) =>
            new Date(b.data) - new Date(a.data)
    );

    if (ordenadas.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="7">
                    Nenhuma Ordem de Serviço cadastrada.
                </td>
            </tr>
        `;

        return;
    }

    ordenadas.forEach(os => {

        const cliente = clientes.find(
            cliente =>
                cliente.id === os.clienteId
        );

        const veiculo = veiculos.find(
            veiculo =>
                veiculo.id === os.veiculoId
        );

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>#${os.id}</td>

            <td>
                ${formatarData(os.data)}
            </td>

            <td>
                ${cliente ? cliente.nome : "-"}
            </td>

            <td>
                ${
                    veiculo
                        ? `${veiculo.marca} ${veiculo.modelo}
                           (${veiculo.placa})`
                        : "-"
                }
            </td>

            <td>
                ${os.descricao}
            </td>

            <td>
                <span class="status">
                    ${os.status}
                </span>
            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="editarOS(${os.id})">
                    Editar
                </button>

                <button
                    class="action-btn"
                    onclick="excluirOS(${os.id})">
                    Excluir
                </button>

            </td>
        `;

        lista.appendChild(tr);
    });
}

document.getElementById("novaOS")
    .addEventListener("click", () => {

        carregarDados();

        if (clientes.length === 0) {

            alert(
                "Cadastre um cliente antes de criar uma Ordem de Serviço."
            );

            window.location.href =
                "../clientes/clientes.html";

            return;
        }

        if (veiculos.length === 0) {

            alert(
                "Cadastre um veículo antes de criar uma Ordem de Serviço."
            );

            window.location.href =
                "../veiculos/veiculos.html";

            return;
        }

        form.reset();

        document.getElementById("osId").value = "";

        document.getElementById("formTitle")
            .textContent =
            "Nova Ordem de Serviço";

        carregarClientes();

        carregarVeiculos();

        formContainer.classList.add("active");
    });

document.getElementById("cancelar")
    .addEventListener("click", () => {

        form.reset();

        formContainer.classList.remove("active");
    });

form.addEventListener("submit", event => {

    event.preventDefault();

    const id =
        document.getElementById("osId").value;

    const clienteId =
        Number(selectCliente.value);

    const veiculoId =
        Number(selectVeiculo.value);

    const os = {

        id: id ? Number(id) : Date.now(),

        clienteId: clienteId,

        veiculoId: veiculoId,

        data:
            document.getElementById("data").value,

        status:
            document.getElementById("status").value,

        descricao:
            document.getElementById("descricao").value
    };

    if (!clienteId || !veiculoId) {

        alert(
            "Selecione o cliente e o veículo."
        );

        return;
    }

    const veiculo = veiculos.find(
        veiculo => veiculo.id === veiculoId
    );

    if (
        !veiculo ||
        veiculo.clienteId !== clienteId
    ) {

        alert(
            "O veículo selecionado não pertence ao cliente escolhido."
        );

        return;
    }

    if (id) {

        const index = ordens.findIndex(
            ordem => ordem.id === Number(id)
        );

        ordens[index] = os;

    } else {

        ordens.push(os);
    }

    salvarDados();

    renderizarOS();

    form.reset();

    formContainer.classList.remove("active");
});

function editarOS(id) {

    carregarDados();

    const os = ordens.find(
        ordem => ordem.id === id
    );

    if (!os) return;

    carregarClientes();

    selectCliente.value = os.clienteId;

    carregarVeiculos(os.clienteId);

    document.getElementById("osId").value = os.id;

    selectVeiculo.value = os.veiculoId;

    document.getElementById("data").value =
        os.data;

    document.getElementById("status").value =
        os.status;

    document.getElementById("descricao").value =
        os.descricao;

    document.getElementById("formTitle")
        .textContent =
        "Editar Ordem de Serviço";

    formContainer.classList.add("active");
}

function excluirOS(id) {

    if (!confirm(
        "Deseja realmente excluir esta Ordem de Serviço?"
    )) {
        return;
    }

    ordens = ordens.filter(
        ordem => ordem.id !== id
    );

    salvarDados();

    renderizarOS();
}

carregarDados();
carregarClientes();
carregarVeiculos();
renderizarOS();