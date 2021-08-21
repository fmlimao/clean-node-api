const LoginRouter = require('./login-router.js')
const MissingParanError = require('../helpers/missing-param-error')

const makeSut = () => {
  return new LoginRouter()
}

describe('Login Router', () => {
  test('Deve retornar 400 se o email não for enviado', () => {
    const sut = makeSut()

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
    const sut = makeSut()

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
    const sut = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve retornar 500 se o httpRequest não tiver body', () => {
    const sut = makeSut()

    const httpResponse = sut.route({})

    expect(httpResponse.statusCode).toBe(500)
  })
})
