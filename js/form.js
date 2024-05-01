const localStorageKey = "ListaTarefas";

$(document).ready(function () {
    $("#meuFormulario").submit(function (e) {
        var txt_nome = $('#nome').val();
        var txt_data = $('#data').val();
        var txt_descricao = $('#descricao').val();

        // Verifica se o nome já existe no banco de dados
        $.ajax({
            url: 'http://localhost/ProjetoWeb/php/verificar_nome.php',
            type: 'POST',
            data: { nome: txt_nome },
            dataType: 'json',
            success: function (response) {
                if (response.existe) {
                    alert("Este nome já existe, por favor, escolha outro.");
                } else {
                    adicionarTarefa(txt_nome, txt_data, txt_descricao);
                }
            },
            error: function (xhr, status, error) {
                console.error("Erro na requisição:", error);
                alert("Erro na requisição: " + error);
            }
        });

        e.preventDefault();
    });
});

function adicionarTarefa(txt_nome, txt_data, txt_descricao) {
    let valores = JSON.parse(localStorage.getItem(localStorageKey) || "[]")
    valores.push({
        nome: txt_nome,
        data: txt_data,
        descricao: txt_descricao,
    })
    localStorage.setItem(localStorageKey, JSON.stringify(valores))

    // Faz a requisição AJAX para adicionar no banco de dados
    $.ajax({
        url: 'http://localhost/ProjetoWeb/php/processar_formulario.php',
        type: 'POST',
        data: {
            nome: txt_nome, data: txt_data, descricao: txt_descricao,
        },
        dataType: 'json',
        success: function (response) {
            console.log("Requisição bem-sucedida:", response);
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição:", error);
            alert("Erro na requisição: " + error);
        }
    });
    mostrarTarefas();
};

$("#pegar-tarefas").click(function (e) {
    e.preventDefault();
    $.ajax({
        url: 'http://localhost/ProjetoWeb/php/obter_tarefas.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("Requisição bem-sucedida:", response);
            localStorage.setItem(localStorageKey, JSON.stringify(response))
            mostrarTarefas();
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição:", error);
        }
    });
});

function mostrarTarefas() {
    let valores = JSON.parse(localStorage.getItem(localStorageKey) || "[]")
    let lista = document.getElementById("listaTarefa")
    let tarefa1 = document.getElementById("tarefa1")
    let tarefa2 = document.getElementById("tarefa2")
    let tarefa3 = document.getElementById("tarefa3")
    let tarefa4 = document.getElementById("tarefa4")
    let data1 = document.getElementById("data1")
    let data2 = document.getElementById("data2")
    let data3 = document.getElementById("data3")
    let data4 = document.getElementById("data4")
    let descricao1 = document.getElementById("descricao1")
    let descricao2 = document.getElementById("descricao2")
    let descricao3 = document.getElementById("descricao3")
    let descricao4 = document.getElementById("descricao4")

    
    lista.innerHTML = ""; // Limpa a lista antes de mostrar as tarefas novamente

    for (let i = 0; i < valores.length; i++){
        lista.innerHTML += `<li class="d-flex flex-column align-items-center border rounded mw-100 mh-100 m-2 h-25">
        <div class="p-2 mw-100 mh-100">${valores[i]['nome']}</div>
        <div class="p-2 mw-100 mh-100">${valores[i]['descricao']}</div>
        <div class="p-2 mw-100 mh-100">${valores[i]['data']}</div>
        <button id="concluida" class="p-2" onclick="apagaritem('${valores[i]['nome']}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
         <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
        </svg>
        </button></li>`;
    }
    tarefa1.innerHTML = valores[0]['nome'];
    descricao1.innerHTML = valores[0]['descricao'];
    data1.innerHTML = valores[0]['data'];
    tarefa2.innerHTML = valores[1]['nome'];
    descricao2.innerHTML = valores[1]['descricao'];
    data2.innerHTML = valores[1]['data'];
    tarefa3.innerHTML = valores[2]['nome'];
    descricao3.innerHTML = valores[2]['descricao'];
    data3.innerHTML = valores[2]['data'];
    tarefa4.innerHTML = valores[3]['nome'];
    descricao4.innerHTML = valores[3]['descricao'];
    data4.innerHTML = valores[3]['data'];
    
}

function apagaritem(nome){
    let valores = JSON.parse(localStorage.getItem(localStorageKey) || "[]")
    let index = valores.findIndex(x => x.nome === nome)
    valores.splice(index, 1)
    localStorage.setItem(localStorageKey, JSON.stringify(valores))

    // Faz a requisição AJAX para excluir o item no banco de dados
    $.ajax({
        url: 'http://localhost/ProjetoWeb/php/apagar_item.php',
        type: 'POST',
        data: { nome: nome },
        dataType: 'json',
        success: function (response) {
            console.log("Item excluído do banco de dados:", response);
            mostrarTarefas(); // Atualiza a lista após a exclusão
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição:", error);
            alert("Erro na requisição: " + error);
        }
    });
}

mostrarTarefas();
