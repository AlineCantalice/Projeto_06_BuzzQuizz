class Validacao {
    constructor() {
        this.validacoes = [
            'required',
            'minlength',
            'maxlength',
            'urlvalidate',
            'hexvalidate',
            'minquantidade',
            'minvalue',
            'maxvalue'
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

        let urlImagem = input.value;

        let mensagemErro = "Insira uma URL de imagem válida!";

        if (urlImagem.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) === null) {
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

    minvalue(input, minvalue){
        let inputvalue = input.value;

        let classeInput = input.classList;

        let mensagemErro = `O valor minimo é ${minvalue}%`;

        if((classeInput.value === "acerto1" || classeInput.value === "acerto2" || classeInput.value === "acerto3") && inputvalue !== 0){
            mensagemErro = `Pelo menos um dos campos precisa ter porcentagem ${minvalue}%`;
        }

        if (inputvalue < minvalue) {
            this.printMensagem(input, mensagemErro);
        }
    }

    maxvalue(input, maxvalue) {
        let inputvalue = input.value;

        let mensagemErro = `O valor maximo é ${maxvalue}%`;

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

let quizz = {};
let titulo;
let urlImagem;
let qtdPerguntas;
let qtdNiveis;

let textoP1;
let corfundoP1;
let corretaP1;
let urlCorretaP1;
let incorretaP1_1;
let incorretaP1_1URL;

let textoP2;
let corfundoP2;
let corretaP2;
let urlCorretaP2;
let incorretaP2_1;
let incorretaP2_1URL;

let textoP3;
let corfundoP3;
let corretaP3;
let urlCorretaP3;
let incorretaP3_1;
let incorretaP3_1URL;

let tituloLevel1;
let acerto1;
let url1;
let desc1;
let tituloLevel2;
let acerto2;
let url2;
let desc2;

const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz/';
const formInfo = document.querySelector("form[name='infoBasica']");
const submit = formInfo.querySelector(".info-basica .botao");
const formPerguntas = document.querySelector("form[name='formPerguntas']");
const formNiveis = document.querySelector("form[name='formNiveis']");
const submitNiveis = formNiveis.querySelector(".info-basica .botao");
const telaSucesso = document.querySelector(".sucesso-quizz.sucesso");

let validacao = new Validacao();

submit.addEventListener('click', function (event) {
    event.preventDefault();
    validacao.validar(formInfo);

    let erroEncontrado = formInfo.querySelectorAll(".error-validation").length;

    if (erroEncontrado === 0) {
        pegarInformacoesBasicas();
    }
});

submitNiveis.addEventListener('click', function (event) {
    event.preventDefault();
    validacao.validar(formNiveis);

    let erroEncontrado = formNiveis.querySelectorAll(".error-validation").length;

    if (erroEncontrado === 0) {
        pegarNiveis();
    }
});

function pegarInformacoesBasicas() {

    titulo = document.infoBasica.titulo.value;
    urlImagem = document.infoBasica.urlImagem.value;
    qtdPerguntas = document.infoBasica.qtdPerguntas.value;
    qtdNiveis = document.infoBasica.qtdNiveis.value;

    formInfo.classList.add("esconder");
    formPerguntas.classList.remove("esconder");

    renderizarPerguntas();

}

function pegarPerguntas() {

    textoP1 = document.querySelector(".textoP1").value;
    corfundoP1 = document.querySelector(".corP1").value;
    corretaP1 = document.querySelector(".corretaP1").value;
    urlCorretaP1 = document.querySelector(".corretaURL-P1").value;
    incorretaP1_1 = document.querySelector(".incorretaP1-1").value;
    incorretaP1_1URL = document.querySelector(".incorretaP1-1URL").value;

    textoP2 = document.querySelector(".textoP2").value;
    corfundoP2 = document.querySelector(".corP2").value;
    corretaP2 = document.querySelector(".corretaP2").value;
    urlCorretaP2 = document.querySelector(".corretaURL-P2").value;
    incorretaP2_1 = document.querySelector(".incorretaP2-1").value;
    incorretaP2_1URL = document.querySelector(".incorretaP2-1URL").value;

    textoP3 = document.querySelector(".textoP3").value;
    corfundoP3 = document.querySelector(".corP3").value;
    corretaP3 = document.querySelector(".corretaP3").value;
    urlCorretaP3 = document.querySelector(".corretaURL-P3").value;
    incorretaP3_1 = document.querySelector(".incorretaP3-1").value;
    incorretaP3_1URL = document.querySelector(".incorretaP3-1URL").value;

    formPerguntas.classList.add("esconder");
    formNiveis.classList.remove("esconder");
}

function pegarNiveis() {

    tituloLevel1 = document.querySelector(".lvlTitle1").value;
    acerto1 = document.querySelector(".acerto1").value;
    url1 = document.querySelector(".URLlvl1").value;
    desc1 = document.querySelector(".descLVL1").value;
    tituloLevel2 = document.querySelector(".lvlTitle2").value;
    acerto2 = document.querySelector(".acerto2").value;
    url2 = document.querySelector(".URLlvl2").value;
    desc2 = document.querySelector(".descLVL2").value;

    finalizarQuizz();
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
                                        <input type="text" placeholder="Texto da pergunta" class="textoP${i + 1}" minlength="20" required>
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

        let erroEncontrado = formPerguntas.querySelectorAll(".error-validation").length;

        if (erroEncontrado === 0) {
            pegarPerguntas();
        }
    });
}

function finalizarQuizz() {

    quizz = {
        title: titulo,
        image: urlImagem,
        questions: [
            {
                title: textoP1,
                color: corfundoP1,
                answers: [
                    {
                        text: corretaP1,
                        image: urlCorretaP1,
                        isCorrectAnswer: true
                    },
                    {
                        text: incorretaP1_1,
                        image: incorretaP1_1URL,
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: textoP2,
                color: corfundoP2,
                answers: [
                    {
                        text: corretaP2,
                        image: urlCorretaP2,
                        isCorrectAnswer: true
                    },
                    {
                        text: incorretaP2_1,
                        image: incorretaP2_1URL,
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: textoP3,
                color: corfundoP3,
                answers: [
                    {
                        text: corretaP3,
                        image: urlCorretaP3,
                        isCorrectAnswer: true
                    },
                    {
                        text: incorretaP3_1,
                        image: incorretaP3_1URL,
                        isCorrectAnswer: false
                    }
                ]
            }
        ],
        levels: [
            {
                title: tituloLevel1,
                image: url1,
                text: desc1,
                minValue: 0
            },
            {
                title: tituloLevel2,
                image: url2,
                text: desc2,
                minValue: 50
            }
        ]
    }

    const promisse = axios.post(`${API}quizzes`, quizz);
    promisse.then(enviarQuizz);
}

function enviarQuizz(response) {
    alert(response.data.id)
    console.log(response.data);
    formNiveis.classList.add("esconder");
    telaSucesso.classList.remove("esconder");
    telaSucesso.innerHTML = "";
    telaSucesso.innerHTML += `<h2>Seu quizz está pronto!</h2>
    <div class="card2">
        <img src="${urlImagem}">
        <div class="titulo">
            <span>${titulo}</span>
        </div>
    </div>
    <input class="botao" type="submit" value="Acessar quizz">
    <a href="" onclick="atualizar();">Voltar para home</a>`
    // let quizz_usuario = quizz.data;
    // const localQuizz = localStorage.getItem("quizz");
    // if (localQuizz !== null) {
    //     let arrayQuizz = JSON.parse(localQuizz);
    //     arrayQuizz.push(quizz_usuario);
    //     let arrayString = JSON.stringify(arrayQuizz);
    //     localStorage.setItem("quizz", arrayString);
    // }
    // else {
    //     let arrayQuizz = [quizz_usuario];
    //     let arrayString = JSON.stringify(arrayQuizz);
    //     localStorage.setItem("quizz", arrayString);
    // }
    // const localID = localStorage.getItem("id");
    // if (localID !== null) {
    //     let posts_ID = JSON.parse(localID);
    //     posts_ID.push(response.data.id);
    //     let postString = JSON.stringify(posts_ID);
    //     localStorage.setItem("id", postString);
    // }
    // else {
        let posts_ID = response.data.id;
        console.log(posts_ID)
        let postString = JSON.stringify(posts_ID);
        console.log(postString)
        localStorage.setItem("id", postString);
    // }
    let submitSucesso = telaSucesso.querySelector(".botao");

    submitSucesso.addEventListener('click', function(){
        telaSucesso.classList.add("esconder");
        pegarpost(response.data.id);
    })

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
    const quizzes_criados = localStorage.getItem("id");
    if(quizzes_criados !==null){
        meusQuizzes()
    }
    promisse.then(renderizarposts)
    promisse.catch(atualizar)
}
pegarquizzes()
function renderizarposts(response) {
    const posts = response.data
    const listaposts = document.querySelector(".lista_posts")
    for (let i = 0; i < posts.length; i++) {
        listaposts.innerHTML += `<div class='post' id="${posts[i].id}" onclick="pegarpost(this.id)" style="background-image:url(${posts[i].image}};"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
        // listaposts.innerHTML+=`<div class='post' style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${posts[i].image});background-size: 100% 100%;"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
    }
}
function meusQuizzes() {
    document.querySelector(".nossos_quizzes").classList.add("esconder")
    document.querySelector(".nossos_quizzes_ativado").classList.remove("esconder")
    const quizzes_criados = localStorage.getItem("id");
    const promisse = axios.get(`${API}quizzes/${quizzes_criados}`)
    promisse.then(renderizarNossosposts)
    promisse.catch(atualizar)
    
}
function renderizarNossosposts(response){
    const posts = response.data
    const nossos_quizzes = document.querySelector(".nossos_quizzes_lista")
    nossos_quizzes.innerHTML += `<div class='post' id="${posts.id}" onclick="pegarpost(this.id)" style="background-image:url(${posts.image}};"> <div class="texto_posts"> ${posts.title} </div> </div>`
    // listaposts.innerHTML+=`<div class='post' style="background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url(${posts[i].image});background-size: 100% 100%;"> <div class="texto_posts"> ${posts[i].title} </div> </div>`
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
    document.querySelector(".posts").classList.add("esconder");
    infoBasica.classList.remove("esconder");
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
        respostas = posts.questions[i].answers
        respostas = randomize()
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
    for (let i = 0; i < respostas.length; i++) {
        respostas_aleatorias[i] = respostas[i]
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
function checarResposta(clicked) {
    if (clicked.parentNode.querySelectorAll(".errada").length > 1) {
        return;
    }
    else {
        if (clicked.id === "true") {
            container = clicked.parentNode.querySelectorAll('[id=false]');
            for (let i = 0; i < container.length; i++) {
                container[i].classList.add("opacidade")
                texto = container[i].querySelector("p")
                texto.classList.add("errada")
            }
            texto = clicked.querySelector("p")
            texto.classList.add("certa")
            respostacerta ++
            contador++
            // setTimeout(scrolle, 2000)
        } else {
            contador++
            container = clicked.parentNode.querySelectorAll(".resposta");
            for (let i = 0; i < container.length; i++) {
                container[i].classList.add("opacidade")
                texto = container[i].querySelector("p")
                texto.classList.add("errada")
            }
            texto = clicked.parentNode.querySelector('[id=true]')
            console.log(texto)
            texto.querySelector("p").classList.remove("errada")
            texto.querySelector("p").classList.add("certa")
            clicked.classList.remove("opacidade")
            // setTimeout(scrolle1, 2000)
        }
    }
    const qntd_perguntas=document.querySelectorAll(".container_pergunta")
    if (contador==qntd_perguntas.length){
        criarResultado()

    }

}

// function scrolle() {
//     document.querySelectorAll(".container_respostas")[1].scrollIntoView();
// }
// function scrolle1() {
//     document.querySelectorAll(".container_respostas")[2].scrollIntoView();
// }
 function criarResultado (){
    let acerto =(Number(respostacerta/posts.questions.length)*100).toFixed(0)
    let valorMin
    let levels= posts.levels.length
    quiz_conteudo.innerHTML +=
    `<div class="container_final"></div>
    <button class="reiniciar" onclick="reiniciar()" >
    Reiniciar Quiz
    </button>
    <p class="voltar_home" onclick="voltarParaHome()">
    Voltar para home
    </p>`  
    const container_final= document.querySelector(".container_final")
    for (let i =0; i<levels;i++){
        valorMin=posts.levels[i].minValue
        if(acerto>=valorMin) {
        container_final.innerHTML=`
        <div>
            <div class="pergunta1"> 
            ${acerto}% de acerto:  ${posts.levels[i].title} 
            </div>
            <div class="container_final_imagens"> 
                    <div class="esquerda"> 
                        <img class="imagem_resultado" src="${posts.levels[i].image}" alt="">
                    </div>
                    <div class="direita"> 
                    ${posts.levels[i].text}
                    </div>
            </div>
        </div>
        `
    }
 }
}
function reiniciar () {
    alert("entrou aqui")
    const certas= document.querySelectorAll(".certa")
    for(i=0;i<certas.length;i++){
        certas[i].classList.remove("certa")
    }
    const erradas= document.querySelectorAll(".errada")
    for(i=0;i<erradas.length;i++){
        erradas[i].classList.remove("errada")
    }
    const opacos=document.querySelectorAll(".opacidade")
    for(i=0;i<opacos.length;i++){
        opacos[i].classList.remove("opacidade")
    }
    document.querySelector(".container_final").remove()
    document.querySelector(".reiniciar").remove()
    document.querySelector(".voltar_home").remove()
    contador=0
    respostacerta=0
    document.documentElement.scrollTop = 0
}
function voltarParaHome (){
    document.location.reload()
    document.documentElement.scrollTop = 0
}
