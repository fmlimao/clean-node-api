module.exports = class ServerError extends Error {
  constructor (paramName) {
    super('Erro interno')
    this.name = 'ServerError'
  }
}
