class Validacao {
    constructor() {
        this.validacoes = [
            'required',
            'minlength',
            'maxlength',
            'urlvalidate',
            'hexvalidate',
            'minquantidade'
        ]
    }

    validar(form) {

        let currentValidations = document.querySelectorAll("form .error-validation");

        if (currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }

        let inputs = document.getElementsByTagName("input");
        let inputsArray = [...inputs];

        inputsArray.forEach(function (input) {

            for (let i = 0; i < this.validacoes.length; i++) {
                if (input.getAttribute(this.validacoes[i]) !== null) {
                    let metodo = this.validacoes[i];
                    let valor = input.getAttribute(this.validacoes[i]);
                    this[metodo](input, valor);
                }
            }
        }, this);
    }

    minlength(input, minvalue) {

        let inputLength = input.value.length;

        let mensagemErro = `O campo precisa ter pelo menos ${minvalue} caracteres`;

        if (inputLength < minvalue) {
            console.log(mensagemErro)
            this.printMensagem(input, mensagemErro);
        }

    }

    maxlength(input, maxvalue) {

        let inputLength = input.value.length;

        let mensagemErro = `O campo precisa ter menos que ${maxvalue} caracteres`;

        if (inputLength > maxvalue) {
            console.log(mensagemErro)
            this.printMensagem(input, mensagemErro);
        }

    }

    required(input) {
        let inputvalue = input.value;

        if (inputvalue === '') {
            let mensagemErro = "Esse campo é de preenchimento obrigatório!";
            this.printMensagem(input, mensagemErro);
        }
    }

    urlvalidate(input) {
        const expressaoValidaUrl =
            /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        const verificaUrl = new RegExp(expressaoValidaUrl);

        let email = input.value;

        let mensagemErro = "Insira uma URL válida!";

        if (!expressaoValidaUrl.test(email)) {
            this.printMensagem(input, mensagemErro);
        }
    }

    hexvalidate(input) {
        const expressaoValidaHex = /^#([0-9a-f]{3}){1,2}$/i;
        const verificaHex = new RegExp(expressaoValidaHex);

        let cor = input.value;

        let mensagemErro = "Insira uma cor em hexadecimal válida!";

        if (!expressaoValidaUrl.test(cor)) {
            this.printMensagem(input, mensagemErro);
        }
    }

    minquantidade(input, minvalue) {
        let inputvalue = input.value;

        let mensagemErro = '';

        let classeInput = input.classList;

        if (classeInput.value === "qtd-perguntas") {
            mensagemErro = `Precisa preencher o campo com pelo menos ${minvalue} perguntas`;
        }
        if (classeInput.value === "qtd-niveis") {
            mensagemErro = `Precisa preencher o campo com pelo menos ${minvalue} níveis`;
        }

        if (inputvalue < minvalue) {
            console.log(mensagemErro)
            this.printMensagem(input, mensagemErro);
        }
    }

    printMensagem(input, msg) {

        let erros = input.parentNode.querySelector(".error-validation");

        if (erros === null) {
            let template = document.querySelector(".error-validation").cloneNode(true);
            template.textContent = msg;

            let inputParent = input.parentNode;

            template.classList.remove("template");

            inputParent.appendChild(template);
        }
    }

    cleanValidations(validacoes) {
        validacoes.forEach(el => el.remove());
    }
}


const formInfo = document.querySelector("form[name='infoBasica']");
const submit = document.querySelector(".info-basica .botao");

let validacao = new Validacao();

submit.addEventListener('click', function (event) {
    event.preventDefault();
    validacao.validar(formInfo);
});


let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;


/* Funções que estou utilizando */

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
        listaposts.innerHTML += `<div class='post' id="${posts[i].id}" onclick="pegarpost(this.id)" style="background-image:url(${posts[i].image}};"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
        // listaposts.innerHTML+=`<div class='post' style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${posts[i].image});background-size: 100% 100%;"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
    }
}
function pegarpost(clicked_id) {
    document.querySelector(".posts").style.display = "none"
    document.querySelector(".pagina_quizz").style.display = "flex"
    const promisse = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${clicked_id}`)
    promisse.then(renderizarposts1)
    promisse.catch(atualizar)
}
function atualizar() {
    window.location.reload()
}
function criandoquizz() {
    document.querySelector(".posts").style.display = "none"
    document.querySelector(".criar-quizz").style.display = "inherit"
}
function renderizarposts1(response) {
    const posts = response.data
    console.log(posts)
    const quiztopo = document.querySelector(".quiz_topo")
    const quiz_conteudo = document.querySelector(".quiz_conteudo")
    quiztopo.innerHTML = `<img src="${posts.image}" alt="">`
    for (let i = 0; i < posts.questions.length; i++) {
        quiz_conteudo.innerHTML += `<div class="container_pergunta">
        <div class="pergunta" style="background-color:${posts.questions[i].color}"> 
             ${posts.questions[i].title} 
        </div>
        <div class="container_respostas"> </div>
        </div>`
    }
    const containerrespostas = document.querySelectorAll(".container_respostas")
    for (let i = 0; i < containerrespostas.length; i++) {
        console.log(posts.questions[i].answers)
        for (let j = 0; j < posts.questions[i].answers.length; j++) {
            containerrespostas[i].innerHTML += `<div class="resposta">
        <img class="imagens_resposta" src="${posts.questions[i].answers[j].image}" alt="">
        <p> ${posts.questions[i].answers[j].text} </p>
        </div>`
        }
    }
}
/* Funções que estou utilizando */
function pegarInformacoesBasicas() {
    titulo = document.dados.titulo;
    urlImagem = document.dados.urlImagem;
    qtdPerguntas = document.dados.qtdPerguntas;
    qtdNiveis = document.dados.qtdNiveis;

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
