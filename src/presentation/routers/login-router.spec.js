class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) {
      return HttpResponse.badRequest('email')
    }

    if (!password) {
      return HttpResponse.badRequest('password')
    }
  }
}

class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParanError(paramName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}

class MissingParanError extends Error {
  constructor (paramName) {
    super(`Parametro "${paramName}" obrigatorio`)
    this.name = 'MissingParanError'
  }
}

describe('Login Router', () => {
  test('Deve retornar 400 se o email não for enviado', () => {
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParanError('email'))
  })

  test('Deve retornar 400 se o password não for enviado', () => {
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParanError('password'))
  })

  test('Deve retornar 500 se o httpRequest não for enviado', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve retornar 500 se o httpRequest não tiver body', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route({})

    expect(httpResponse.statusCode).toBe(500)
  })
})
