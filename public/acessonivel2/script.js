document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;

    fetch('/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, telefone, cpf })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('cadastroForm').reset();
    });
});

const modal = document.getElementById("myModal");
const btn = document.getElementById("showModal");
const span = document.getElementsByClassName("close")[0];

btn.addEventListener('click', function(event) {
    event.preventDefault(); // Evita comportamento padrão
    fetch('/grupos')
        .then(response => response.json())
        .then(grupos => {
            const gruposDiv = document.getElementById('grupos');
            gruposDiv.innerHTML = '';

            grupos.forEach((grupo, index) => {
                const grupoDiv = document.createElement('div');
                grupoDiv.innerHTML = `<h2>Grupo ${index + 1}</h2>`;
                grupo.forEach(usuario => {
                    const usuarioDiv = document.createElement('div');
                    usuarioDiv.innerHTML = `
                        <p>Nome: ${usuario.nome}</p>
                        <p>Telefone: ${usuario.telefone}</p>
                        <p>CPF: ${usuario.cpf}</p>
                        <p>Data e Hora: ${usuario.dataHora}</p>
                        <p>Status: ${usuario.pago ? 'PAGO' : 'PENDENTE'}</p>
                    `;
                    grupoDiv.appendChild(usuarioDiv);
                });
                gruposDiv.appendChild(grupoDiv);
            });

            modal.style.display = "flex";
            document.querySelector('.modal-content').classList.add('show');
        });
});

span.addEventListener('click', function(event) {
    event.preventDefault(); // Evita comportamento padrão
    modal.style.display = "none";
    document.querySelector('.modal-content').classList.remove('show');
});

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        event.preventDefault(); // Evita comportamento padrão
        modal.style.display = "none";
        document.querySelector('.modal-content').classList.remove('show');
    }
});

// Função para exibir o "Grupo Nióbio"
document.getElementById('showGrupoNiobio').addEventListener('click', function(event) {
    event.preventDefault(); // Evita comportamento padrão
    fetch('/grupo-niobio')
        .then(response => response.json())
        .then(usuarios => {
            const gruposDiv = document.getElementById('grupos');
            gruposDiv.innerHTML = '<h2>Grupo Nióbio</h2>';

            usuarios.forEach(usuario => {
                const usuarioDiv = document.createElement('div');
                usuarioDiv.innerHTML = `
                    <p>Nome: ${usuario.nome}</p>
                    <p>Telefone: ${usuario.telefone}</p>
                    <p>CPF: ${usuario.cpf}</p>
                    <p>Data e Hora: ${usuario.dataHora}</p>
                    <p>Status: PAGO</p>
                `;
                gruposDiv.appendChild(usuarioDiv);
            });

            modal.style.display = "flex";
            document.querySelector('.modal-content').classList.add('show');
        });
});