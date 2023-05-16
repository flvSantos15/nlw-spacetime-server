import fastify from 'fastify'

const app = fastify()

app.post('/hello', () => {
  return 'Hello world'
})

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
