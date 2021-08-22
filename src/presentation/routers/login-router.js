const HttpResponse = require('../helpers/http-response')
const MissingParanError = require('../helpers/missing-param-error')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
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
