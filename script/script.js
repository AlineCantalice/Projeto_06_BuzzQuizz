let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;
const expressao = 
/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const verificaUrl = new RegExp(expressao);

function pegarInformacoesBasicas(){
    titulo = document.dados.titulo;
    urlImagem = document.dados.urlImagem;
    qtdPerguntas = document.dados.qtdPerguntas;
    qtdNiveis = document.dados.qtdNiveis;
    validarDados();
}

function validarDados(){

    if(titulo.value === '' || urlImagem.value === '' || qtdPerguntas.value === '' || qtdNiveis.value === ''){
        alert("Preenchimento incorreto!! Campos vazios");
        return false;
    }
    if(titulo.value.length < 20 || titulo.value.length > 65){
        alert("O titulo deve ser maior do que 20 caracteres e menor do que 65 caracteres");
        return false;
    }
    if(!urlImagem.value.match(verificaUrl)){
        alert("url invalida!");
        return false;
    }
    if(qtdPerguntas.value < 3){
        alert("Deve conter pelo menos 3 perguntas!");
        return false;
    }
    if(qtdNiveis.value < 2){
        alert("Deve conter pelo menos 2 níveis!");
        return false;
    }
    return true;
}