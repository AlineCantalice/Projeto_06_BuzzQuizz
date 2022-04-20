let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;
const expressaoValidaUrl =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const verificaUrl = new RegExp(expressaoValidaUrl);
const expressaoValidaHex = /^#([0-9a-f]{3}){1,2}$/i;
const verificaHex = new RegExp(expressaoValidaHex);

function pegarInformacoesBasicas(){
    titulo = document.dados.titulo;
    urlImagem = document.dados.urlImagem;
    qtdPerguntas = document.dados.qtdPerguntas;
    qtdNiveis = document.dados.qtdNiveis;

    validarDados();
}

function pegarPerguntas(){

}

function validarDados(){

    if(titulo.value === '' || urlImagem.value === '' || qtdPerguntas.value === '' || qtdNiveis.value === ''){
        alert("Preenchimento incorreto!! Campos vazios");
        return false;
    }
    if(titulo.value.length < 20 || titulo.value.length > 65){
        alert("O titulo deve ser maior do que 20 caracteres e menor do que 65 caracteres");
        titulo.focus();
        return false;
    }
    if(!urlImagem.value.match(verificaUrl)){
        alert("url invalida!");
        urlImagem.focus();
        return false;
    }
    if(qtdPerguntas.value < 3){
        alert("Deve conter pelo menos 3 perguntas!");
        qtdPerguntas.focus();
        return false;
    }
    if (qtdNiveis.value < 2) {
        alert("Deve conter pelo menos 2 níveis!");
        qtdNiveis.focus();
        return false;
    }
    return true;
}