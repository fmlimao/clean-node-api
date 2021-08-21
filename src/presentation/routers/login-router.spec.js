class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500
      }
    }

    const { email, password } = httpRequest.body

    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
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
