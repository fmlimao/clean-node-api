const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

describe('Email Validator', () => {
  test('Deve retornar true se o validator retornar true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@emai.com')

    expect(isEmailValid).toBe(true)
  })

  test('Deve retornar false se o validator retornar false', () => {
    const sut = new EmailValidator()
    validator.isEmailValid = false

    const isEmailValid = sut.isValid('invalid_email@emai.com')

    expect(isEmailValid).toBe(false)
  })
})
