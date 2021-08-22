const HttpResponse = require('../helpers/http-response')
const MissingParanError = require('../helpers/missing-param-error')
const InvalidParanError = require('../helpers/invalid-param-error')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      if (!httpRequest || !httpRequest.body) {
        return HttpResponse.serverError()
      }

      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParanError('email'))
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParanError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParanError('password'))
      }

      const accessToken = await this.authUseCase.auth(email, password)

      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ accessToken })
    } catch (error) {
      // console.error(error)
      return HttpResponse.serverError()
    }
  }
}
