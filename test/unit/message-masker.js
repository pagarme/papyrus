const R = require('ramda')
const { test } = require('ava')
const { createMessageMasker } = require('../../src/message-masker')

let messageMasker = {}

test.before(() => {
  messageMasker = createMessageMasker({
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })
})


test('messageMasker: mask password property from JSON object', t => {
  const { password } = messageMasker({ password: 'Papyrus' })
  t.is(password, '*')
})
