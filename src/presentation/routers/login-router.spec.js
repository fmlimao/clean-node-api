const LoginRouter = require('./login-router.js')
const MissingParanError = require('../helpers/missing-param-error')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()

  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut,
    authUseCaseSpy
  }
}

describe('Login Router', () => {
  test('Deve retornar 400 se o email não for enviado', () => {
    const { sut } = makeSut()

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
    const { sut } = makeSut()

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
    const { sut } = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve retornar 500 se o httpRequest não tiver body', () => {
    const { sut } = makeSut()

    const httpResponse = sut.route({})

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve chamar o AuthUseCase com os parametros corretos', () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Deve retornar 401 quando credenciais inválidas forem passadas ', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })
})
