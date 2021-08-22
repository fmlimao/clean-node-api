class EmailValidator {
  isValid (email) {
    return true
  }
}

describe('Email Validator', () => {
  test('Deve retornar true se o validator retornar true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@emai.com')

    expect(isEmailValid).toBe(true)
  })
})
