class Validacao {
    constructor(){
        this.validacoes = [
            'minlength',
        ]
    }

    validar(form){

        let inputs = document.getElementsByTagName("input");
        let inputsArray = [...inputs];

        inputsArray.forEach(function(input){

            for(let i=0; i<this.validacoes.length; i++){
                if(input.getAttribute(this.validacoes[i]) !== null){
                    let metodo = this.validacoes[i];
                    let valor = input.getAttribute(this.validacoes[i]);
                    this[metodo](input, valor);
                }
            }
        }, this);
    }

    minlength(input, minvalue){

        let inputLength = input.value.length;

        let mensagemErro = `O campo precisa ter pelo menos ${minvalue} caracteres`;

        if(inputLength < minvalue){
            console.log(mensagemErro)
            this.printMensagem(input, mensagemErro);
        }

    }

    printMensagem(input, msg){
        let template = document.querySelector(".error-validation").cloneNode(true);
        template.textContent = msg;

        let inputParent = input.parentNode;

        template.classList.remove("template");

        inputParent.appendChild(template);
    }
}


const formInfo = document.querySelector("form[name='infoBasica']");
const submit = document.querySelector(".info-basica .botao");

let validacao = new Validacao();

submit.addEventListener('click', function(event){
    event.preventDefault();
    validacao.validar(formInfo);
});


let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;
const expressaoValidaUrl =
    /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const verificaUrl = new RegExp(expressaoValidaUrl);
const expressaoValidaHex = /^#([0-9a-f]{3}){1,2}$/i;
const verificaHex = new RegExp(expressaoValidaHex);

function pegarquizzes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes")
    promisse.then(renderizarposts)
    promisse.catch(atualizar)
}
pegarquizzes()
function renderizarposts(response) {
    const posts = response.data
    console.log(response.data)
    const listaposts = document.querySelector(".lista_posts")
    for (let i = 0; i < posts.length; i++) {
        listaposts.innerHTML += `<div class='post' style="background-image:url(${posts[i].image}};"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
        // listaposts.innerHTML+=`<div class='post' style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${posts[i].image});background-size: 100% 100%;"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
    }
}
function atualizar() {
    window.location.reload()
}
function pegarInformacoesBasicas() {


    titulo = form["infoBasica"]["titulo"];
    urlImagem = form["infoBasica"]["urlImagem"];
    qtdPerguntas = form["infoBasica"]["qtdPerguntas"];
    qtdNiveis = form["infoBasica"]["qtdNiveis"];

    validarDados();
}

function pegarPerguntas() {
    const form = document.forms;
    console.log(form["formPerguntas"]);
}

function validarDados() {

    if (titulo.value === '' || urlImagem.value === '' || qtdPerguntas.value === '' || qtdNiveis.value === '') {
        alert("Preenchimento incorreto!! Campos vazios");
        return false;
    }
    if (titulo.value.length < 20 || titulo.value.length > 65) {
        alert("O titulo deve ser maior do que 20 caracteres e menor do que 65 caracteres");
        titulo.focus();
        return false;
    }
    if (!urlImagem.value.match(verificaUrl)) {
        alert("url invalida!");
        urlImagem.focus();
        return false;
    }
    if (qtdPerguntas.value < 3) {
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
function criandoquizz() {
    document.querySelector(".posts").style.display = "none"
    document.querySelector(".criar-quizz").style.display = "inherit"
}