const despesaList = []
let graficoInstancia = null

/**
 * 
 * @param {string} descricao 
 * @param {number} valor 
 */
const Despesa = function (descricao = "Não informado", valor = 0) {
    this.descricao = descricao
    this.valor = valor
}


const gerarGrafico = () => {
    if (despesaList.length === 0) return
    
    const canvas = document.getElementById('myChart')
    if (!canvas) return
    
    if (graficoInstancia) {
        graficoInstancia.destroy()
    }
    
    const descricoes = despesaList.map(despesa => despesa.descricao)
    const valores = despesaList.map(despesa => despesa.valor)
    
    graficoInstancia = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: descricoes,
            datasets: [{
                label: 'Despesas',
                data: valores,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

const criarDespesa = () => {
    const descricao = document.querySelector("#descricao").value
    const valor = parseFloat(document.querySelector("#valor").value)
    const novaDespesa = new Despesa(descricao, valor)
    despesaList.push(novaDespesa)
}


const removerDespesa = (indice) => {
    despesaList.splice(indice, 1)
    carregarLista()
    gerarEstatisticas()
    gerarGrafico()
}


const carregarLista = () => {
    const listaElemento = document.querySelector("#lista")
    listaElemento.innerHTML = ''
    
    despesaList.forEach((despesa, indice) => {
        const itemDiv = document.createElement("div")
        itemDiv.classList.add("item-lista")
        
        const textoSpan = document.createElement("span")
        textoSpan.textContent = `${despesa.descricao} - R$${despesa.valor.toFixed(2)}`
        
        const botaoRemover = document.createElement("button")
        botaoRemover.textContent = "Remover"
        botaoRemover.classList.add("btn-remover")
        botaoRemover.onclick = () => removerDespesa(indice)
        
        itemDiv.appendChild(textoSpan)
        itemDiv.appendChild(botaoRemover)
        listaElemento.appendChild(itemDiv)
    })
}


const gerarEstatisticas = () => {
    if (despesaList.length === 0) return
    
    const totalGasto = despesaList.reduce((acumulador, despesa) => {
        return acumulador + despesa.valor
    }, 0)
    
    const valores = despesaList.map(despesa => despesa.valor)
    const maiorGasto = Math.max(...valores)
    const menorGasto = Math.min(...valores)
    const mediaGastos = totalGasto / despesaList.length
    const despesasAcimaCem = despesaList.filter(despesa => despesa.valor > 100)
    
    const estatisticasElemento = document.querySelector("#estatisticas")
    const estatisticasDiv = document.createElement("div")
    
    estatisticasElemento.innerHTML = ""
    estatisticasDiv.classList.add("item")
    estatisticasDiv.innerHTML = `
        Maior gasto: R$${maiorGasto.toFixed(2)} <br>
        Menor gasto: R$${menorGasto.toFixed(2)} <br>
        Média de gastos: R$${mediaGastos.toFixed(2)} <br>
        Gastos acima de R$100: ${despesasAcimaCem.length} <br>
        Total gasto: R$${totalGasto.toFixed(2)}`
    
    estatisticasElemento.appendChild(estatisticasDiv)
}


const botaoAdicionar = document.querySelector("#btnAdicionar")
botaoAdicionar.addEventListener("click", () => {
    const descricao = document.querySelector("#descricao").value.trim()
    const valor = parseFloat(document.querySelector("#valor").value)
    
    if (descricao && !isNaN(valor) && valor > 0) {
        criarDespesa()
        carregarLista()
        gerarEstatisticas()
        gerarGrafico()
        
       
        document.querySelector("#descricao").value = ""
        document.querySelector("#valor").value = ""
    } else {
        alert("Por favor, preencha a descrição e insira um valor válido!")
    }
})