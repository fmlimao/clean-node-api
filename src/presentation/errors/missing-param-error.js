module.exports = class MissingParanError extends Error {
  constructor (paramName) {
    super(`Parametro "${paramName}" obrigatorio`)
    this.name = 'MissingParanError'
  }
}
