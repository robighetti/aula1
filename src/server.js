const express = require('express')
const { v4: uuid } = require('uuid')

const app = express()


//.use -> middleware (usado para executar alguma função), forço a aplicação a utilizar o JSON 
app.use(express.json())

//criação de carrinho de compra
/*
{
  restaurante: '',
  lanche: '',
  refrigerante: '',
  valor: 10.00
  }
*/
const cart = []

/*
  Aqui estamos usando o query params para realizar filtros e fazemos a verificação
  se existe o refrigerante na query para filtrar, se não tiver ele retorna o carrinho todo
  se não retorna o carrinho filtrado.
*/
app.get('/cart', (request, response) => {
  const { refrigerante } = request.query
  let cartFiltered;

  if (refrigerante) {
    cartFiltered = cart.filter(item => item.refrigerante === refrigerante)
  }

  return response.json({ data: refrigerante ? cartFiltered : cart })
})

/*
  Toda vez que tiver um parametro na rota isso é chamado de route-params
  parametro de rota
*/
app.get('/cart/:id', (request, response) => {
  const { id } = request.params

  const product = cart.find(item => item.id === id)

  return response.json({ data: product })
})

/*
  Toda vez que tivermos um ponto de interrogação "?" na url isso é um query params
  utilizado para realizar pesquisas, filtros, etc...
*/
app.get('/cart/filter/:id', (request, response) => {
  const { id } = request.params
  const { refrigerante } = request.query

  const index = cart.findIndex(item => item.id === id && item.refrigerante === refrigerante)

  cart[index]

  return response.json({ data: cart[index] })
})

app.post('/cart', (request, response) => {
  //Desestruturação de variavel
  const { restaurante, lanche, refrigerante, valor } = request.body

  const order = {
    id: uuid(),
    restaurante,
    lanche,
    refrigerante,
    valor
  }

  cart.push(order)

  return response.json({ data: order })
})

/*
  Alteração de dados
*/
app.put('/cart/:id', (request, response) => {
  const { id } = request.params

  const { restaurante, valor } = request.body

  const index = cart.findIndex(item => item.id === id)

  cart[index].restaurante = restaurante
  cart[index].valor = valor

  return response.json({ data: cart[index] })
})

/**
 * O metodo patch é igual ao put, a diferença é que atualizaremos um unico dado
 */
app.patch('/cart/:id', (request, response) => {
  const { id } = request.params

  const { restaurante, valor } = request.body

  const index = cart.findIndex(item => item.id === id)

  cart[index].restaurante = restaurante

  return response.json({ data: cart[index] })
})

/**
 * Remove a informação dentro do array
 */
app.delete('/cart/:id', (request, response) => {
  const { id } = request.params

  const index = cart.findIndex(item => item.id === id)

  cart.splice(index, 1)

  return response.json(cart)
})

app.delete('/cart/exe/:id', (request, response) => {
  const { id } = request.params

  const index = cart.findIndex(item => item.id === id)

  delete cart[index].restaurante

  return response.json(cart[index])
})

/**
 * VERBOS HTTP
 * 
 * CREATE   - POST  - utilizado para criar
 * READ     - GET   - utilizado para buscar informações 
 * UPDATE   - PUT   - atualização de informações 
 * DELETE   - DELETE - utilizado para excluir informações
 * PATCH    - ATUALIZAÇÃO DE UMA UNICA INFORMAÇÃO
 * 
 * CRUD - CREATE - READ - UPDATE - DELETE
 */

app.listen(3333, () => {
  console.log('Servidor rodando')
})