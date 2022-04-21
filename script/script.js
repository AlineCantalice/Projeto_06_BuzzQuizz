let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;
const expressaoValidaUrl =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const verificaUrl = new RegExp(expressaoValidaUrl);
const expressaoValidaHex = /^#([0-9a-f]{3}){1,2}$/i;
const verificaHex = new RegExp(expressaoValidaHex);


/* Funções que estou utilizando */

function pegarquizzes () {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes")
    promisse.then(renderizarposts)
    promisse.catch(atualizar)
}
pegarquizzes ()
function renderizarposts (response){
    const posts=response.data
    console.log(response.data)
    const listaposts=document.querySelector(".lista_posts") 
    for(let i=0; i<posts.length;i++){
        listaposts.innerHTML+=`<div class='post' id="${posts[i].id}" onclick="pegarpost(this.id)" style="background-image:url(${posts[i].image}};"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
        // listaposts.innerHTML+=`<div class='post' style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${posts[i].image});background-size: 100% 100%;"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
    }
}
function pegarpost(clicked_id){
    document.querySelector(".posts").style.display="none"
    document.querySelector(".pagina_quizz").style.display="flex"
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${clicked_id}`)
    promisse.then(renderizarposts1)
    promisse.catch(atualizar)
}
function atualizar (){
    window.location.reload()
}
function criandoquizz (){
    document.querySelector(".posts").style.display="none"
    document.querySelector(".criar-quizz").style.display="inherit"
}
function renderizarposts1 (response){
    const posts=response.data
    console.log(posts)
    const quiztopo=document.querySelector(".quiz_topo") 
    const quiz_conteudo=document.querySelector(".quiz_conteudo") 
    quiztopo.innerHTML= `<img src="${posts.image}" alt="">`
    for (let i=0;i<posts.questions.length;i++){
        quiz_conteudo.innerHTML+=`<div class="container_pergunta">
        <div class="pergunta" style="background-color:${posts.questions[i].color}"> 
             ${posts.questions[i].title} 
        </div>
        <div class="container_respostas"> </div>
        </div>`
    }
    const containerrespostas=document.querySelectorAll(".container_respostas") 
    for (let i=0;i<containerrespostas.length;i++){
        console.log(posts.questions[i].answers)
        for (let j=0;j<posts.questions[i].answers.length;j++){
        containerrespostas[i].innerHTML+=`<div class="resposta">
        <img class="imagens_resposta" src="${posts.questions[i].answers[j].image}" alt="">
        <p> ${posts.questions[i].answers[j].text} </p>
        </div>`
        }
    }
}
/* Funções que estou utilizando */
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
