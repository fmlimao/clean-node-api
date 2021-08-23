module.exports = class MissingParamError extends Error {
  constructor (paramName) {
    super(`Parametro "${paramName}" obrigatorio`)
    this.name = 'MissingParamError'
  }
}
