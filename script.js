// Botões
const numerosBtn = document.querySelectorAll("[data-numeros]")
const operadoresBtn = document.querySelectorAll("[data-operador]")
const igualBtn = document.querySelector("[data-igual]")
const deletarBtn = document.querySelector("[data-deletar]")
const limparBtn = document.querySelector("[data-limpar]")
// Display
const operacaoText = document.querySelector("[data-operacaoText]")
const resultadoText = document.querySelector("[data-resultadoText]")
// Histórico
const historicoBtn = document.querySelector("[data-historico]")
const janelaHistorico = document.querySelector("[data-janelaHistorico]")
const operacaoTextHistorico = document.querySelector("[data-operacaoTextHistorico]")
const resultadoTextHistorico = document.querySelector("[data-resultadoTextHistorico]")

class Calculadora {
    constructor(operacaoText, resultadoText, operacaoTextHistorico, resultadoTextHistorico) {
        this.operacaoText = operacaoText
        this.resultadoText = resultadoText

        this.operacaoTextHistorico = operacaoTextHistorico
        this.resultadoTextHistorico = resultadoTextHistorico

        this.historico = [] // Array com a lista vazia do histórico.
        this.limpar() // Vai limpar sempre a calculadora quando abrir.

        this.igualPressionado = false // Igual não foi apertado.
    }
    limpar() {
        this.operacaoValue = "" // Limpa os valores das operaçoes
        this.resultadoValue = "" // Limpa os valores dos resultados
        this.operador = undefined
        this.igualPressionado = false // Quando eu limpar vai resetar e falar que o igual não foi pressionado.
    }
    deletar() {
        this.resultadoValue = this.resultadoValue.toString().slice(0, -1) // Retira o último número
    }
    atualizarDisplay() {
        // Atualiza no display a operação e mostra o operador ou nada para não mostrar undefined
        this.operacaoText.innerText = `${this.formatNum(this.operacaoValue)} ${this.operador || ""}`
        // Mostra o resultado da operação
        this.resultadoText.innerText = this.formatNum(this.resultadoValue)
    }
    tecladoNum(numero) {
        // Impedir o flood de "," e verfica se já tem uma "," no resultadoValue
        if (this.resultadoValue.toString().includes(".") && numero === ".") return
        // Se o botão de igual não foi pressionado anteriormente, o número digitado é adicionado ao resultado
        if (this.igualPressionado === false) {
            this.resultadoValue += numero.toString()
            // Caso o resultado esteja vazio, ou seja, não há nenhum número digitado ainda o número vai ser adicionado
        } else if (this.resultadoValue === "") {
            this.resultadoValue = numero.toString()
            // Caso o botão de igual tenha sido pressionado anteriormente, o número digitado é definido como o novo resultado, e as variáveis são resetadas, já que a calculadora entrará em um novo cálculo.
        } else {
            this.resultadoValue = numero.toString()
            this.igualPressionado = false
            this.operacaoValue = ""
            this.operador = undefined
        }
    }
    mudarOperador(novoOperador) {
        this.operador = novoOperador
        this.atualizarDisplay()
    }
    tecladoOperador(operador) {
        this.igualPressionado = false // Quando aperto algum operador, fala que igual não foi apertado, pois se não limpará o resultado e a operação
        if (this.resultadoValue === "") return
        if (this.operacaoValue !== "") {
            this.calculo()
        }
        this.operacaoValue = this.resultadoValue
        this.operador = operador
        this.resultadoValue = ""
        this.atualizarDisplay()
    }
    igual() {
        this.calculo() // Incrivelmente calculco tem que ser na frente do atualizar, pois se não atualiza e não mostra o calculo =)
        this.operacaoValue = ""
        this.operador = undefined
        this.atualizarDisplay()
        this.igualPressionado = true
    }
    calculo() {

        let resultado
        const operacaoValueFloat = parseFloat(this.operacaoValue)
        const resultadoValueFloat = parseFloat(this.resultadoValue)

        if (isNaN(operacaoValueFloat) || isNaN(resultadoValueFloat)) return // Medida de segurança, se não for um número nada acontece.

        switch (this.operador) {
            case "+":
                resultado = operacaoValueFloat + resultadoValueFloat
                break
            case "-":
                resultado = operacaoValueFloat - resultadoValueFloat
                break
            case "*":
                resultado = operacaoValueFloat * resultadoValueFloat
                break
            case "÷":
                resultado = operacaoValueFloat / resultadoValueFloat
                break
            case "=":
                this.igual()
                break
            default:
                return
        }
        this.historico.push({
            operacao: this.operacaoValue + this.operador + this.resultadoValue, resultado: resultado,
        })
        this.resultadoValue = resultado // O resultado vai ficar sendo mostrado
        this.operador = this.operador
        this.atualizarHistorico()
    }
    formatNum(numero) {
        const stringNumero = numero.toString()

        const numerosInteiros = parseFloat(stringNumero.split(".")[0]) // Pega os números antes da virgula.
        const numerosDecimais = stringNumero.split(".")[1] // Pega os números depois da virgula

        let inteirosDisplay

        if (isNaN(numerosInteiros)) {
            // Se números inteiros não for números ex .56 = nada
            inteirosDisplay = ""
        } else {
            inteirosDisplay = numerosInteiros.toLocaleString("pt-BR", {
                maximumFractionDigits: 0,
            })
        }
        if (numerosDecimais != null) { // Se numeros decimais não for vazio
            return `${inteirosDisplay},${numerosDecimais}` // Retorna os números inteiros virgula decimais. Coloquei virugla por que queria uma calculadora nas normas brasileira, e não na americana igual todos os videos do youtube.
        } else {
            return inteirosDisplay // Se numeros decimais for vazio, retorna somente os números inteiros.
        }
    }

    atualizarHistorico() {
        /** Transforma cada objeto em uma string */
        const historicoText = this.historico
            .map((item) =>
                `<div>
            <span class="operacao2">${item.operacao} = </span>
            <span class="resultado2">${item.resultado} </span>
            </div>`
            )
            .join("") /** Junta todas as strings em uma única string. */
        janelaHistorico.innerHTML = historicoText
    }
}

const calculadora = new Calculadora(operacaoText, resultadoText, operacaoTextHistorico, resultadoTextHistorico)

for (const numeroBtn of numerosBtn) {
    // Serve para pegar o número apertado no tecladoNum e retornar para o display.
    // Muito importante que aqui adiciona UM(numerBtn) número dos botões(numerosBtn)
    // note que tem um "s" separando as duas constantes!
    numeroBtn.addEventListener("click", () => {
        calculadora.tecladoNum(numeroBtn.innerText)
        calculadora.atualizarDisplay()
    })
}
for (const operadorBtn of operadoresBtn) {
    operadorBtn.addEventListener("click", () => {
        calculadora.tecladoOperador(operadorBtn.innerText) // Recebe o primeiro operador. E mostra na operacaoValue a operacao completa 
        calculadora.mudarOperador(operadorBtn.innerText) // Se tiver mudado o operador vai mostrar o novo
        calculadora.atualizarDisplay()
    })
}
limparBtn.addEventListener("click", () => {
    calculadora.limpar()
    calculadora.atualizarDisplay()
})

igualBtn.addEventListener("click", () => {
    calculadora.igual()
})
deletarBtn.addEventListener("click", () => {
    calculadora.deletar()
    calculadora.atualizarDisplay()
})

historicoBtn.addEventListener("click", () => {
    if (janelaHistorico.style.display === "block") { // Verifica se a janela já esta aberta
        janelaHistorico.style.display = "none" // none esconde
    } else { // Se não estiver, ele vai abrir.
        janelaHistorico.style.display = "block" // block mostra
    }
})