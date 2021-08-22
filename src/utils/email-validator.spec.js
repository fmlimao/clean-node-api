const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  test('Deve retornar true se o validator retornar true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@emai.com')

    expect(isEmailValid).toBe(true)
  })

  test('Deve retornar false se o validator retornar false', () => {
    const sut = makeSut()
    validator.isEmailValid = false

    const isEmailValid = sut.isValid('invalid_email@emai.com')

    expect(isEmailValid).toBe(false)
  })
})
