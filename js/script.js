var server = "http://192.168.1.172:3000/product/";//servidor com os dados
var checkName = 0;//variavel para checar de o item ja existe

//limpa a tabela
function cleanTable(){
	$("#rowsTable").html("");
}

//limpa o campo de busca e os resultados
function cleanSearch(){
	$("#searchResult").html("");
	$("#searchInput").val("");
	$(".searchResult").css({"display":"none"});
}

//verifica o status do dado do json
function verifyStatus(statusJson){
	if (statusJson=="A"){
		var status="Ativo";
		return status;
	}
	else if (statusJson=="I"){
		var status="Inativo";
		return status;
	}
}

//checa o status selecionado
function checkStatusSelect(statusSelected){
	if (statusSelected=="A"){
		$("#subtitle").html("Itens Ativos");
		return statusSelected;
	}
	else if(statusSelected=="I"){
		$("#subtitle").html("Itens Inativos");
		return statusSelected;
	}
	else if (statusSelected=="AI"){
		$("#subtitle").html("Itens Ativos e Inativos");
		return "";
	}
}

//transforma o valor em string
function valueToString(valor){//transforma o valor de numero para string para colocar na tabela e no modal
	valor = parseFloat(valor.toString()).toFixed(2).replace(".", ",");
	return valor;
}

//cria a tabela através do get
function createTable(){
	var statusSelected = checkStatusSelect($("#selectStatus").val());//checa que dado está selecionado
	cleanTable();//limpa a tabela para atualizar
	cleanSearch();//limpa a busca
	$.get(server, function(data) {//seleciona os dados no json
		for(var i=0; i<data.length; i++){//percorre todos os dados
			var valor = valueToString(data[i].valor);//transforma o valor em string
			var status = verifyStatus(data[i].status);//verifica o status do item
			if(statusSelected==data[i].status){//se o status selecionado for igual ao status do item
				$("#rowsTable").append("<tr data-id="+data[i].id+" >"+//cria a linha da tabela com os dados
				"<td>"+data[i].id+"</td>"+
				"<td>"+data[i].nome+"</td>"+
				"<td>R$ "+valor+"</td>"+//printa o valor em string
				"<td>"+status+"</td>"+//printa o parametro mandado pelo checkStatus
				"<td>"+data[i].estoque+"</td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#dataModal' class='editBtn'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#deleteModal' class='delBtn'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");
			}
			else if(statusSelected==""){//se o status selecionado for nem ativo, nem inativo
				$("#rowsTable").append("<tr data-id="+data[i].id+" >"+//cria a linha da tabela com os dados
				"<td>"+data[i].id+"</td>"+
				"<td>"+data[i].nome+"</td>"+
				"<td>R$ "+valor+"</td>"+//printa o valor em string
				"<td>"+status+"</td>"+//printa o parametro mandado pelo checkStatus
				"<td>"+data[i].estoque+"</td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#dataModal' class='editBtn'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#deleteModal' class='delBtn'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");
			}
		}
	});
}

//seleciona o id na tabela através dos botões de editar e deletar
function getId(){
	$("#rowsTable").on('click', '.delBtn', function(){//no clique do botão deletar na tabela, pega o id da linha
		var id = $(this).parents('tr').data('id');
		setIdModalDel(id);//seta o id da linha no modal de deletar
	});
	$("#rowsTable").on('click', '.editBtn', function(){//no clique do botão editar na tabela, pega o id da linha
		var id = $(this).parents('tr').data('id');
		setIdModalEdit(id);//seta o id da linha no modal de edição
		inputsModalEdit(id);//preenche os inputs no modal de edição
	});
	$("#searchResult").on('click', '.delSearchBtn', function(){//no clique do botão deletar na tabela, pega o id da linha
		var id = $(this).parents('.well').data('id');
		setIdModalDel(id);//seta o id da linha no modal de deletar	
	});
	$("#searchResult").on('click', '.editSearchBtn', function(){//no clique do botão editar na tabela, pega o id da linha
		var id = $(this).parents('.well').data('id');
		setIdModalEdit(id);//seta o id da linha no modal de edição
		inputsModalEdit(id);//preenche os inputs no modal de edição
	});
}

//define as características dos inputs do modal de adicionar
function inputsModalAdd(){
	$("#nome, #valor, #estoque").val("");//limpa os inputs
	$("#status").val("A");//define o status inicial como ativo
	$("#saveBtn").data('item', "");//define o botão de salvar com o id nulo
	cleanAlertInput();//limpa o alerta se houver
}

//define as características dos inputs do modal de editar
function inputsModalEdit(id){
	$.get(server+id, function(data) {//chama os produtos para preencher as inputs com o produto certo
		$("#nome").val(data.nome);
		$("#valor").val(valueToString(data.valor));
		$("#status").val(data.status);
		$("#estoque").val(data.estoque);
	});
	cleanAlertInput();//limpa o alerta se houver
}

//define o id do modal e do botão
function setIdModalEdit(id){
	$("#dataModal").data('item', id);
	$("#saveBtn").data('item', id);
}

//define o id do modal de deletar
function setIdModalDel(id){
	$("#deleteModal").data('item', id);
}

//define os títulos dos modais e dos botões de salvar
function modalTitles(title, button){
	$("#titleModal").html(title);//cria o título do modal editar/adicionar
	$("#saveBtn").val(button);//cria o titulo do botão de salvar
}

//limpa o alerta das inputs
function cleanAlertInput(){
	$("#nome, #valor, #status, #estoque").css({"border": "1px solid #ccc"});
	$("#alertInputs").html("");
}

//valida o formulário
function validateForm(saveId){
	checkName = 0;
	if($("#nome").val()==""){
		alertInputs("#nome");
	}
	else if ($("#valor").val()==""){
		alertInputs("#valor");
	}
	else if ($("#status").val()==""){
		alertInputs("#status");
	}
	else if ($("#estoque").val()==""){
		alertInputs("#estoque");
	}
	else{//se todos os inputs estão preenchidos, verifica se o nome ja existe
		nomeSearch(saveId);
	}
}

//cria um alerta para as inputs dentro do modal
function alertInputs(input){
	if(input!=""){
		$(input).css({"border":"1px solid red"});
		$("#alertInputs").html("Todos os campos devem ser preenchidos!");
	}
	else{
		$("#nome").css({"border":"1px solid red"});
		$("#alertInputs").html("Item já cadastrado!");
	}
}

//procura o nome do produto
function nomeSearch(saveId){
	$.get(server, function(data) {
		for(var i=0; i<data.length; i++){
			if($("#nome").val().toLowerCase()==data[i].nome.toLowerCase() && saveId!=data[i].id){
				alertInputs("");//se o nome já existe, alerta de item ja cadastado
				checkName = 1;
			}
		}
		if(checkName==0){//se o nome não existe, fecha o modal
			closeModal(saveId);
		}
	});
}

//fecha o modal
function closeModal(saveId){
		$("#dataModal").fadeOut();
		setTimeout(function(){
			$('#dataModal').modal("hide");
		});
		checkSave(saveId);//verifica o id do botão de salvar
}

//verifica o id do botão de salvar
function checkSave(saveId){
	if (saveId == ""){//se o id for vazio, é pra adicionar
		addJson();
	}else{//se o id não for vazio, é pra editar
		editJson(saveId);
	}
}

//transforma o valor em numero
function valueToNumber(){//transforma o valor de string para numero, para adicionar no json
	var valor = $("#valor").val();
	valor = Number(valor.replace(",", "."));
	return valor;
}

//função com os parâmetros de deletar
function deleteJson(id){
	ajax("DELETE", id, "", "", "", "", "Item "+id+" excluído com sucesso!");
}

//função com os parâmetros de adicionar
function addJson(){
	ajax("POST", "", $("#nome").val(), valueToNumber(), $("#status").val(), $("#estoque").val(), $("#nome").val()+" adicionado com sucesso!");
}

//função com os parâmetros de editar
function editJson(id){
	ajax("PUT", id, $("#nome").val(), valueToNumber(), $("#status").val(), $("#estoque").val(), "Item "+id+" editado com sucesso!");
}

//função para realizar as operações
function ajax(type, id, nome, valor, status, estoque, msg){//realiza a operação desejada, com os dados recebidos
	$.ajax({
		type: type,
		url: server+id,
		data: {
			nome: nome,
			valor: valor,
			status: status,
			estoque: estoque
		},
		success: function(){
			alertMsg(msg);//envia mensagem conforme função realizada
			createTable();//chama a tabela atualizada
		},
		error: function(){
			alertMsg("Erro na operação!");//envia mensagem de erro
		}
	});
}

//cria um alerta depois das operações 
function alertMsg(mensagem){
	$("#bodyMsgAlert").html("<p>"+mensagem+"</p>");
	$('#msgAlert').modal('show');
	$('#msgAlert').fadeOut('slow');
	setTimeout(function(){
		$('#msgAlert').modal("hide");
	}, 2500);
}


//função de busca
function search(){
	$('#searchInput').keyup(function(){//quando escrever na input, realiza a busca
		var searchField = $(this).val();
		if(searchField === '')  {//se não houver nada no campo de busca, esconde a div de resultados
			$(".searchResult").fadeOut("fast").css({"display":"none"});
			return;
		}

		var regex = new RegExp(searchField, "i");//define a busca sem case sensitive
		var output = '<div class="row busca" id="rowBusca">';//cria a div para mostras os resultados

		$.get(server, function(data){//procura os dados
			$(data).each(function (){//percorre um por um
				var nome = this.nome;
				var status;
				if (nome.search(regex) != -1){//se houver dados correspondentes à busca
					//muda o nome do status
					var status = verifyStatus(this.status);
					//mostra a div de resultados e printa 
					$(".searchResult").fadeIn("fast").css({"display":"block"});	
					output += "<div class='col-md-10 col-md-offset-1 well' data-id="+ this.id+">"+
					"<div class='col-md-2'><h4>" + nome + "</h4></div>"+
					"<div class='col-md-2'><h4>Preço: " + valueToString(this.valor) + "</h4></div>"+
					"<div class='col-md-2'><h4>Status: "+ status +"</h4></div>"+
					"<div class='col-md-4'><h4>Estoque: "+ this.estoque +"</h4></div>"+
					"<div class='col-md-2 column-btn'><button data-toggle='modal' data-target='#dataModal' class='editSearchBtn btn-busca col-md-6'><span class='glyphicon glyphicon-pencil'></span></button>"+
					"<button data-toggle='modal' data-target='#deleteModal' class='delSearchBtn btn-busca col-md-6'><span class='glyphicon glyphicon-trash'></span></button></div></div>";
				}
			});
			output += '</div>';
			$('#searchResult').html(output);//define a div com os resultados
		});
	});
}

//ações dos botões/inputs
function actions(){
	//no clique do botão para adicionar produto
	$("#addBtn").click(function(){
		modalTitles("Adicionando Produto", "Adicionar Produto");//muda o título do modal e do botão salvar
		inputsModalAdd();//limpa as inputs do modal
	});
	//no clique do botão de editar item
	$("#rowsTable").on('click', '.editBtn', function(){
		modalTitles("Editando Produto", "Salvar Alterações");//muda o título do modal e do botão salvar
	});
	//no clique do botão de editar no resultado da busca
	$("#searchResult").on('click', '.editSearchBtn', function(){
		modalTitles("Editando Produto", "Salvar Alterações");//muda o título do modal e do botão salvar
	});
	//no clique do botão de deletar item
	$("#deleteBtn").click(function(){
		deleteJson($("#deleteModal").data('item'));//confirma a operação de deletar, pega o id do modal
	});
	//no clique do botão de salvar
	$("#saveBtn").click(function(){
		validateForm($("#saveBtn").data('item'));//checa se é para adicionar ou editar
	});
	//ao selecionar status
	$('#selectStatus').change(function(){
		createTable();//checa qual status está selecionado
	});
	//quando der foco nas inputs do modal
	$("#nome, #valor, #status, #estoque").focus(function(){
		$(this).css({"border": "1px solid #00ab9b"});//define a cor
		$("#alertInputs").html("");//limpa o alerta se houver
	});
	//quando sair das inputs do modal
	$("#nome, #valor, #status, #estoque").blur(function(){
		cleanAlertInput();//limpa o alerta se houver, definindo a cor inicial
	});
	//permite apenas numeros na input estoque
	$('#estoque').keypress(function (event) {
		if ((event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}
		if ($(this).val().indexOf(0) == 0) {
			$(this).val($(this).val().replace(0,''));
		}
	});
	//quando sair da input, apaga tudo que não é número
	$('#estoque').blur(function () {
		if (!this.value.match(/[0-9]/)) {
			this.value = this.value.replace(/[^0-9]/g, '');
		}
	});
	//permite apenas o que está definido na input
	$("#nome").keyup(function(){
		var regexp = /[^a-zA-Z- çãõáéíóúàèÌòùâêîôûäëïüöÃÕÁÉÍÓÚÀÈÌÒÙÄÜÏÖËÂÊÎÔÛ]/g;
		if($(this).val().match(regexp)){
			$(this).val( $(this).val().replace(regexp,'') );
		}
	});
	//não permite colar coisas nas inputs
	$('#nome, #valor, #estoque').on("paste",function(e) {
		e.preventDefault();
	});
	//não permite enter, ponto ou vírgula na busca
	$('#searchInput').keypress(function(event){
		if (event.which == 44 || event.which == 46 || event.which == 13) {
			event.preventDefault();
		}
	});
}

//mascara para o campo valor do modal
function maskValor(){
	$('#valor').priceFormat({
		prefix: '', centsSeparator: ',', thousandsSeparator: ''
	});
}

//na página carregada
$(document).ready(function(){
	createTable();//cria a tabela com o $.get
	search();//função de busca
	actions();//ações de botões ou inputs
	getId();//seleciona o id na tabela através dos botões de editar e deletar
	maskValor();//mascara para o valor
});