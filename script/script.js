class Validacao {
    constructor() {
        this.validacoes = [
            'required',
            'minlength',
            'maxlength',
            'urlvalidate',
            'hexvalidate',
            'minquantidade',
            'maxquantidade'
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
        if (classeInput.value === 'porcentagem') {
            mensagemErro = `Precisa preencher o campo com um valor entre 0 e 100%`;
        }

        if (inputvalue < minvalue) {
            this.printMensagem(input, mensagemErro);
        }
    }

    maxquantidade(input, maxvalue) {
        let inputvalue = input.value;

        let mensagemErro = `Precisa preencher o campo com um valor entre 0 e 100%`;

        if (inputvalue > maxvalue) {
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

const API = 'https://mock-api.driven.com.br/api/v4/buzzquizz/';
const formInfo = document.querySelector("form[name='infoBasica']");
const submit = formInfo.querySelector(".info-basica .botao");
const formPerguntas = document.querySelector("form[name='formPerguntas']");
const formNiveis = document.querySelector("form[name='formNiveis']");
const submitNiveis = formNiveis.querySelector(".info-basica .botao");

let validacao = new Validacao();

submit.addEventListener('click', function (event) {
    event.preventDefault();
    validacao.validar(formInfo);

    let validado = formInfo.querySelectorAll(".error-validation").length;

    if (validado === 0) {
        pegarInformacoesBasicas();
    }
}); 

submitNiveis.addEventListener('click', function (event) {
    event.preventDefault();
    validacao.validar(formNiveis);

    let validado = formNiveis.querySelectorAll(".error-validation").length;

    if (validado === 0) {
        console.log(formNiveis)
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

function pegarPerguntas() {
    formPerguntas.classList.add("esconder");
    formNiveis.classList.remove("esconder");
}

function renderizarPerguntas() {
    let secao = formPerguntas;

    for (let i = 1; i < qtdPerguntas; i++) {
        secao.innerHTML += `<div class="input">
                                <div class="titulo-pergunta">
                                    <h3>Pergunta ${i + 1}</h3>
                                    <img src="assets/Vector.png" onclick="abrirPergunta(this);">
                                </div>
                                <div class="question esconder">
                                    <div class="campo">
                                        <input type="text" placeholder="Texto da pergunta" class="textP${i + 1}" minlength="20" required>
                                    </div>
                                    <div class="campo">
                                        <input type="text" placeholder="Cor de fundo da pergunta" class="corP${i + 1}" hexvalidate required>
                                    </div>
                                    <h3>Resposta correta</h3>
                                    <div class="campo">
                                        <input type="text" placeholder="Resposta correta" class="corretaP${i + 1}" required>
                                    </div>
                                    <div class="campo">
                                        <input type="url" placeholder="URL da imagem" class="corretaURL-P${i + 1}" urlvalidate required>
                                    </div>
                                    <h3>Respostas incorretas</h3>
                                    <div class="incorreta">
                                        <div class="campo">
                                            <input type="text" placeholder="Resposta incorreta 1" class="incorretaP${i + 1}-1" required>
                                        </div>
                                        <div class="campo">
                                            <input type="url" placeholder="URL da imagem 1" class="incorretaP${i + 1}-1URL" urlvalidate
                                                required>
                                        </div>
                                    </div>
                                    <div class="incorreta">
                                        <div class="campo">
                                            <input type="text" placeholder="Resposta incorreta 2" class="incorretaP${i + 1}-2">
                                        </div>
                                        <div class="campo">
                                            <input type="url" placeholder="URL da imagem 2" class="incorretaP${i + 1}-2URL">
                                        </div>
                                    </div>
                                    <div class="incorreta">
                                        <div class="campo">
                                            <input type="text" placeholder="Resposta incorreta 3" class="incorretaP${i + 1}-3">
                                        </div>
                                        <div class="campo">
                                            <input type="url" placeholder="URL da imagem 3" class="incorretaP${i + 1}-3URL">
                                        </div>
                                    </div>
                                </div>
                            </div>`
    }
    secao.innerHTML += `<input class="botao" type="submit" value="Prosseguir pra criar níveis">`;
    let submitPerguntas = formPerguntas.querySelector(".info-basica .botao");

    submitPerguntas.addEventListener('click', function (event) {
        event.preventDefault();
        validacao.validar(formPerguntas);
    
        let validado = formPerguntas.querySelectorAll(".error-validation").length;
    
        if (validado === 0) {
            pegarPerguntas();
        }
    });
}

function abrirLVL(lvl) {
    const div = lvl.parentNode;
    const pai = div.parentNode;
    const nivel = pai.querySelector(".nivel");
    nivel.classList.toggle("esconder");
}

function abrirPergunta(pergunta) {
    const div = pergunta.parentNode;
    const pai = div.parentNode;
    const question = pai.querySelector(".question");
    question.classList.toggle("esconder");
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
    document.querySelector(".posts").classList.add("esconder")
    // const promisse = axios.get(`${API}quizzes/84`)
    const promisse = axios.get(`${API}quizzes/${clicked_id}`)
    promisse.then(renderizarposts1)
    promisse.catch(atualizar)
}
function atualizar() {
    window.location.reload()
}
function criandoquizz() {
    document.querySelector(".posts").classList.add("esconder")
    document.querySelector(".criar-quizz").classList.remove("esconder")
}
let respostas
let posts
const quiz_conteudo = document.querySelector(".quiz_conteudo")
function renderizarposts1(response) {
    posts = response.data
    console.log(posts)
    const pagina_quizz = document.querySelector(".pagina_quizz.esconder")
    const quiztopo = document.querySelector(".quiz_topo.esconder")
    pagina_quizz.classList.remove("esconder")
    quiztopo.classList.remove("esconder")
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
        respostas=posts.questions[i].answers
        respostas=randomize()
        for (let j = 0; j < posts.questions[i].answers.length; j++) {
            containerrespostas[i].innerHTML += `<div class="resposta" id="${respostas[j].isCorrectAnswer}"onclick="checarResposta(this)">
        <img class="imagens_resposta" src="${respostas[j].image}" alt="">
        <p> ${respostas[j].text} </p>
        </div>`
        }
    }
}
 const randomize = () => {
    let respostas_aleatorias = []
     for (let i=0;i<respostas.length;i++) {
         respostas_aleatorias[i]=  respostas[i]
     }
          for (let i = 0; i < (respostas_aleatorias.length); i++) {
        let x = respostas_aleatorias[i];
        let y = Math.floor(Math.random() * (i + 1));
        respostas_aleatorias[i] = respostas_aleatorias[y];
        respostas_aleatorias[y] = x;
    }
    return respostas_aleatorias
 }
 let texto
 let contador=0
 let container
 let respostacerta=0
 function checarResposta(clicked){
     if(clicked.parentNode.querySelectorAll(".errada").length>1){
         return ;
     }
     else{
            if (clicked.id === "true"){
                container = clicked.parentNode.querySelectorAll('[id=false]');
                for (let i=0;i<container.length;i++){
                    container[i].classList.add("opacidade")
                    texto = container[i].querySelector("p")
                    texto.classList.add("errada")
                }
                texto= clicked.querySelector("p")
                texto.classList.add("certa")
                respostacerta ++
                contador ++
                setTimeout(scrolle,2000)
            } else{
                contador ++
                container = clicked.parentNode.querySelectorAll(".resposta");
                for (let i=0;i<container.length;i++){
                    container[i].classList.add("opacidade")
                    texto = container[i].querySelector("p")
                    texto.classList.add("errada")
                }   
                texto= clicked.parentNode.querySelector('[id=true]')
                console.log(texto)
                texto.querySelector("p").classList.remove("errada")
                texto.querySelector("p").classList.add("certa")
                clicked.classList.remove("opacidade")
                setTimeout(scrolle1,2000)
            }
    }
    const qntd_perguntas=document.querySelectorAll(".container_pergunta")
    alert(respostacerta)
    alert(contador)
    alert(qntd_perguntas.length)
    if (contador==qntd_perguntas.length){
        criarResultado()

    }

    }

 function scrolle() {
    document.querySelectorAll(".container_respostas")[1].scrollIntoView();
}
function scrolle1() {
    document.querySelectorAll(".container_respostas")[2].scrollIntoView();
}
 function criarResultado (){
    let acerto =(Number(respostacerta/posts.questions.length)*100).toFixed(0)
    let valorMin
    let levels= posts.levels.length
    quiz_conteudo.innerHTML +=
    `<div class="container_final">
    </div>`  
    const container_final= document.querySelector(".container_final")
    for (let i =0; i<levels;i++){
        valorMin=posts.levels[i].minValue
        if(acerto>valorMin)
        container_final.innerHTML=`
        <div>
            <div class="pergunta1"> 
            ${acerto}% de acerto:  ${posts.levels[i].title} 
            </div>
            <div class="container_final_imagens"> 
                    <div class="esquerda"> 
                        <img class="stewart" src="${posts.levels[i].image}" alt="">
                    </div>
                    <div class="direita"> 
                    ${posts.levels[i].text}
                    </div>
            </div>
        </div>
        `
    }
    
 }
/* Funções que estou utilizando */
