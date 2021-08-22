const LoginRouter = require('./login-router.js')
const { MissingParanError, UnauthorizedError, ServerError, InvalidParamError } = require('../errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()

  const emailValidatorSpy = makeEmailValidator()

  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true

  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid (email) {
      throw new Error()
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()

  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'

  return authUseCaseSpy
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Deve retornar 400 se o email não for enviado', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParanError('email'))
  })

  test('Deve retornar 400 se o password não for enviado', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParanError('password'))
  })

  test('Deve retornar 400 se um email inválido for enviado', async () => {
    const { sut, emailValidatorSpy } = makeSut()

    emailValidatorSpy.isEmailValid = false

    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Deve retornar 500 se o httpRequest não for enviado', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o httpRequest não tiver body', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route({})

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve chamar o AuthUseCase com os parametros corretos', async () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Deve retornar 401 quando credenciais inválidas forem passadas', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null

    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Deve retornar 500 se o AuthUseCase não for enviado', async () => {
    const sut = new LoginRouter()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o AuthUseCase não tiver o método auth', async () => {
    const sut = new LoginRouter({})

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 200 quando credenciais válidas forem passadas', async () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Deve retornar 500 se o AuthUseCase ter uma exceção', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()

    const sut = new LoginRouter(authUseCaseSpy)

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve retornar 500 se o EmailValidator não for enviado', async () => {
    const authUseCaseSpy = makeAuthUseCase()

    const sut = new LoginRouter(authUseCaseSpy)

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o EmailValidator não tiver o método isValid', async () => {
    const authUseCaseSpy = makeAuthUseCase()

    const sut = new LoginRouter(authUseCaseSpy, {})

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Deve retornar 500 se o EmailValidator ter uma exceção', async () => {
    const authUseCaseSpy = makeAuthUseCase()

    const emailValidatorSpy = makeEmailValidatorWithError()

    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Deve chamar o EmailValidator com os parametros corretos', async () => {
    const { sut, emailValidatorSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)

    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
