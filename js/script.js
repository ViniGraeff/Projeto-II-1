var server = "http://192.168.1.171:3000/product";

function clearTable(){
	$("#rowsTable").html("");
}

function createTable(){
	clearTable();
	$.get(server, function(data) {
		for(var i=0; i<data.length; i++){
			var valor = data[i].valor
			var valorString = valueToString(valor);
			$("#rowsTable").append("<tr data-id="+data[i].id+" >"+
				"<td>"+data[i].id+"</td>"+
				"<td>"+data[i].nome+"</td>"+
				"<td>R$ "+valorString+"</td>"+
				"<td>"+data[i].status+"</td>"+
				"<td>"+data[i].estoque+"</td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#data' class='edit'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
				"<td class='table-option'><button data-toggle='modal' data-target='#delete' class='del'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");
		}
	});
}

function valueToString(valor){
	valor = valor.toFixed(2).toString().replace(".", ",");
	return valor;
}

function actions(){
	$("#addBtn").click(function(){
		$("#titleModal").html("Adicionando Produto");
	});
	$("#rowsTable").on('click', '.edit', function(){
		$("#titleModal").html("Editando Produto");
	});
}

function getId(){
	$("#rowsTable").on('click', '.del', function(){
		var id = $(this).parents('tr').data('id');
		setIdModalDel(id);
	});
	$("#rowsTable").on('click', '.edit', function(){
		var id = $(this).parents('tr').data('id');
		modalEdit(id);
		setIdModalEdit(id);
	});
}

function setIdModalDel(id){
	$("#delete").data('item', id);
}

function setIdModalEdit(id){
	$("#data").data('item', id);
}

function modalEdit(id){
	$.get(server+"/"+id, function(data) {
		var valor = data.valor;
		var valorString = valueToString(valor);
		$("#nome").val(data.nome);
		$("#valor").val(valorString);
		$("#status").val(data.status);
		$("#estoque").val(data.estoque);
	});
}

$(document).ready(function(){
	actions();
	createTable();
	getId();

});

// function tabela(){
// 	limparTab();
// 	$.get("http://192.168.1.171:3000/product", function(data) {
// 		for(var i=0; i<data.length; i++){
// 			var valor = data[i].valor
// 			valor = valor.toFixed(2).toString().replace(".", ",");
			
// 			if (data[i].status=="A" && $('#listaStatus').val()=="A"){
// 				$("#linhas-tab").append("<tr data-id="+data[i].id+" >"+
// 					"<td>"+data[i].id+"</td>"+
// 					"<td>"+data[i].nome+"</td>"+
// 					"<td>R$ "+valor+"</td>"+
// 					"<td>Ativo</td>"+
// 					"<td>"+data[i].estoque+"</td>"+
// 					"<td class='table-option'><button data-toggle='modal' data-target='#dados' class='editar'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
// 					"<td class='table-option'><button data-toggle='modal' data-target='#delete' class='excluir'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");
// 			}
// 			else if (data[i].status=="I" && $('#listaStatus').val()=="I"){
// 				$("#linhas-tab").append("<tr data-id="+data[i].id+">"+
// 					"<td>"+data[i].id+"</td>"+
// 					"<td>"+data[i].nome+"</td>"+
// 					"<td>R$ "+valor+"</td>"+
// 					"<td>Inativo</td>"+
// 					"<td>"+data[i].estoque+"</td>"+
// 					"<td class='table-option'><button data-toggle='modal' data-target='#dados' class='editar'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
// 					"<td class='table-option'><button data-toggle='modal' data-target='#delete' class='excluir'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");
// 			}
// 			else if ($('#listaStatus').val()=="AI"){
// 				var status;
// 				if (data[i].status=="A"){
// 					status = "Ativo";
// 				}
// 				else if (data[i].status=="I"){
// 					status = "Inativo";
// 				}
			
// 				$("#linhas-tab").append("<tr data-id="+data[i].id+">"+
// 					"<td>"+data[i].id+"</td>"+
// 					"<td>"+data[i].nome+"</td>"+
// 					"<td>R$ "+valor+"</td>"+
// 					"<td>"+status+"</td>"+
// 					"<td>"+data[i].estoque+"</td>"+
// 					"<td class='table-option'><button data-toggle='modal' data-target='#dados' class='editar'><span class='glyphicon glyphicon-pencil'></span></button></td>"+
// 					"<td class='table-option'><button data-toggle='modal' data-target='#delete' class='excluir'><span class='glyphicon glyphicon-trash'></span></button></td></tr>");
// 			}
// 		}
//     });
// }

// function limparTab(){
// 	$("#linhas-tab").html("");
// }

// function decimal(){
// 	var valor = $("#valor").val();
// 	valor = Number(valor.replace(",", ".")).toFixed(2);
// 	return valor;
// }

// function add(){
// 	var nome = $("#nome").val("");
// 	var valor = $("#valor").val("");
// 	var status = $("#status").val("");
// 	var estoque = $("#estoque").val("");
// 	$("#salvar").click(function(){
// 		adicionar($("#nome").val(), $("#valor").val(), $("#status").val(), $("#estoque").val());
// 	});
// }

// function adicionar(n, v, s, e){
// 	if(n!=0 && v!=0){
// 		$.ajax({
// 			type: 'POST',
// 			url: "http://192.168.1.171:3000/product",
// 			data:{
// 				nome: n,
// 				valor: decimal(),
// 				status: s,
// 				estoque: e				
// 			},
// 			success: function(){
// 				tabela();
// 			}
// 		});
// 	}
// }

// function setIdFormEdit(id){
// 	$("#dados").data('item', id);
// 	$("#salvar").click(function(){
// 		editar($("#dados").data("item"));
// 	});
// }

// function editar(id){
// 	if($("#nome").val()!=0 && $("#valor").val()!=0){
// 		$.ajax({
// 			type: 'PUT',
// 			url: "http://192.168.1.171:3000/product/"+id,
// 			data:{
// 				nome: $("#nome").val(),
// 				valor: decimal(),
// 				status: $("#status").val(),
// 				estoque: $("#estoque").val()				
// 			},
// 			success: function(){
// 				tabela();
// 			}
// 		});
// 	}
// }

// function setIdFormDel(id){
// 	$("#delete").data('item', id);
// }

// function deletar(id){
// 	$.ajax({
// 		type: 'DELETE',
// 		url: "http://192.168.1.171:3000/product/"+id,
// 		success: function(){
// 			tabela();
// 		}
// 	});
// }

// function getId(){
// 	$("#linhas-tab").on('click', '.excluir', function(){
// 		var id = $(this).parents('tr').data('id');
// 		setIdFormDel(id);
// 	});
// 	$("#linhas-tab").on('click', '.editar', function(){
// 		var id = $(this).parents('tr').data('id');
// 		$.get("http://192.168.1.171:3000/product/"+id, function(data) {
// 			var valor = data.valor;
// 			valor = valor.toFixed(2).toString().replace(".", ",");

// 			$("#nome").val(data.nome);
// 			$("#valor").val(valor);
// 			$("#status").val(data.status);
// 			$("#estoque").val(data.estoque);
// 		});
// 		setIdFormEdit(id);
// 	});
// }

// $(document).ready(function(){
// 	tabela();
// 	getId();

// 	$("#add").click(function(){
// 		add();
// 	});

// 	$("#deletebtn").click(function(){
// 		var id = $("#delete").data("item");
// 		deletar(id);
// 	});

// 	$('#listaStatus').change(function(){
// 		tabela();
// 	}); 

// 	$('#valor').keypress(function(event) {
// 		if ((event.which != 44 || $(this).val().indexOf(',') != -1) && (event.which < 48 || event.which > 57)) {
// 			event.preventDefault();
// 		}
// 	});

// 	$('#estoque').keypress(function(event) {
// 		if ((event.which < 48 || event.which > 57)) {
// 			event.preventDefault();
// 		}
// 	});
// });

// function buscar(item){
// 	$.get("http://192.168.1.171:3000/product", function(data) {
// 		for(var i=0; i<data.length; i++){
// 			if(data[i].nome==item){
// 				limparTab();
// 			}
// 		}		
// 	});
// }


// $("#buscaBtn").click(function(){
// 	var item = $("#campoBusca").val();
// 	buscar(item);
// });
