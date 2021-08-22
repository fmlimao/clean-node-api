module.exports = class InvalidParamError extends Error {
  constructor (paramName) {
    super(`Parametro "${paramName}" inválido`)
    this.name = 'InvalidParamError'
  }
}
