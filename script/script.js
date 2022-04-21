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

        let currentValidations = form.querySelectorAll("form .error-validation");

        if (currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }

        let inputs = form.getElementsByTagName("input");
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

        let email = input.value;

        let mensagemErro = "Insira uma URL válida!";

        if (!expressaoValidaUrl.test(email)) {
            this.printMensagem(input, mensagemErro);
        }
    }

    hexvalidate(input) {
        const expressaoValidaHex = /^#([0-9a-f]{3}){1,2}$/i;

        let cor = input.value;

        let mensagemErro = "Insira uma cor em hexadecimal válida!";

        if (!expressaoValidaHex.test(cor)) {
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

let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;


let perguntas = {
	title: titulo,
	image: urlImagem,
	questions: [
		{
			title: "Título da pergunta 1",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 2",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		},
		{
			title: "Título da pergunta 3",
			color: "#123456",
			answers: [
				{
					text: "Texto da resposta 1",
					image: "https://http.cat/411.jpg",
					isCorrectAnswer: true
				},
				{
					text: "Texto da resposta 2",
					image: "https://http.cat/412.jpg",
					isCorrectAnswer: false
				}
			]
		}
	],
	levels: [
		{
			title: "Título do nível 1",
			image: "https://http.cat/411.jpg",
			text: "Descrição do nível 1",
			minValue: 0
		},
		{
			title: "Título do nível 2",
			image: "https://http.cat/412.jpg",
			text: "Descrição do nível 2",
			minValue: 50
		}
	]
}

const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz/';
const formInfo = document.querySelector("form[name='infoBasica']");
const submit = formInfo.querySelector(".info-basica .botao");
const formPerguntas = document.querySelector("form[name='formPerguntas']");
const submitPerguntas = formPerguntas.querySelector(".info-basica .botao");

let validacao = new Validacao();

submit.addEventListener('click', function (event) {
    event.preventDefault();
    validacao.validar(formInfo);

    let validado = formInfo.querySelectorAll(".error-validation").length;

    if(validado === 0){
        pegarInformacoesBasicas();
    }
});

submitPerguntas.addEventListener('click', function (event) {
    event.preventDefault();
    validacao.validar(formPerguntas);

    let validado = formPerguntas.querySelectorAll(".error-validation").length;

    if(validado === 0){
        console.log(formPerguntas)
    }
});

function pegarInformacoesBasicas() {

        titulo = document.infoBasica.titulo;
        urlImagem = document.infoBasica.urlImagem;
        qtdPerguntas = document.infoBasica.qtdPerguntas.value;
        qtdNiveis = document.infoBasica.qtdNiveis.value;

        formInfo.classList.add("esconder");
        formPerguntas.classList.remove("esconder");

        renderizarPerguntas();

}

function renderizarPerguntas(){
    let secao = document.querySelector(".criar-quizz");

    for(let i=1; i<=qtdPerguntas.length; i++){
        secao.innerHTML += `<form class="info-basica perguntas" name="formPerguntas">
        <h2><strong>Crie suas perguntas</strong></h2>
        <div class="input">
            <h3>Pergunta ${i}</h3>
            <div class="campo">
                <input type="text" placeholder="Texto da pergunta" class="textoP${i}" minlength="20" required>
            </div>
            <div class="campo">
                <input type="text" placeholder="Cor de fundo da pergunta" class="corP${i}" hexvalidate required>
            </div>
            <h3>Resposta correta</h3>
            <div class="campo">
                <input type="text" placeholder="Resposta correta" class="corretaP${i}" required>
            </div>
            <div class="campo">
                <input type="url" placeholder="URL da imagem" class="corretaURL-P${i}" urlvalidate required>
            </div>
            <h3>Respostas incorretas</h3>
            <div class="incorreta">
                <div class="campo">
                    <input type="text" placeholder="Resposta incorreta ${i}" class="incorretaP${i}-1" required>
                </div>
                <div class="campo">
                    <input type="url" placeholder="URL da imagem ${i}" class="incorretaP${i}-1URL" urlvalidate required>
                </div>
            </div>
            <div class="incorreta">
                <div class="campo">
                    <input type="text" placeholder="Resposta incorreta 2" class="incorretaP${i}-2">
                </div>
                <div class="campo">
                    <input type="url" placeholder="URL da imagem 2" class="incorretaP${i}-2URL">
                </div>
            </div>
            <div class="incorreta">
                <div class="campo">
                    <input type="text" placeholder="Resposta incorreta 3" class="incorretaP${i}-3">
                </div>
                <div class="campo">
                    <input type="url" placeholder="URL da imagem 3" class="incorretaP${i}-3URL">
                </div>
            </div>
        </div>
        <input class="botao" type="submit" value="Prosseguir pra criar níveis">
    </form>`
    }
}

function pegarPerguntas(){
    for(let i=1; i<=qtdPerguntas.length; i++){
        perguntas.questions.title = formPerguntas.querySelector(`textoP${i}`).value;
        perguntas.questions.color = formPerguntas.querySelector(`corP${i}`).value;
    }
}



/* Funções que estou utilizando */

function pegarquizzes() {
    const promisse = axios.get(`${API}quizzes`)
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
    const promisse = axios.get(`${API}quizzes/${clicked_id}`)
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

