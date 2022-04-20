let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;
const expressaoValidaUrl =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const verificaUrl = new RegExp(expressaoValidaUrl);
const expressaoValidaHex = /^#([0-9a-f]{3}){1,2}$/i;
const verificaHex = new RegExp(expressaoValidaHex);

function pegarquizzes () {
    alert("eai?")
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes")
    promisse.then(renderizarposts)
    promisse.catch(deuruim)
}
pegarquizzes ()
function renderizarposts (response){
    const posts=response.data
    console.log(response.data)
    const listaposts=document.querySelector(".lista_posts") 
    for(let i=0; i<posts.length;i++){
        listaposts.innerHTML+=`<div class='post' style="background-image:url(${posts[i].image}};"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
        // listaposts.innerHTML+=`<div class='post' style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${posts[i].image});background-size: 100% 100%;"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
    }
}
function deuruim (){
    alert("Deu ruim!")
}
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
function criandoquizz (){
    document.querySelector(".posts").style.display="none"
    document.querySelector(".criar-quizz").style.display="inherit"
}