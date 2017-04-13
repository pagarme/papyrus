const R = require('ramda')
const { test } = require('ava')
const { createMessageMasker } = require('../../src/message-masker')

test('messageMasker: mask url using a replacer function', t => {
  const messageMasker = createMessageMasker({
    url: {
      paths: ['url'],
      pattern: /"?session_id"?[=|:]"?(\w{60})"?|(ak_(live|test)_|ek_(live|test)_)(\w{30})/g,
      replacer: str => `${str.substring(0, 20)}${'*'.repeat(18)}${str.substring(38, str.length)}`
    }
  })

  const object = { 
    url: '/transactions/13243022/refuse_message?session_id=2e2ccb5fcabcdefghijklmnopq12345672289123456789012345678901234' 
  }

  const maskedObject = messageMasker(object)

  t.deepEqual(maskedObject, {
    url: '/transactions/13243022/refuse_message?session_id=2e2ccb5fc******************2345672289123456789012345678901234' 
  })
})

test('messageMasker: mask password with a regex', t => {
  const messageMasker = createMessageMasker({
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = { password: 'Papyrus' }  
  const maskedObject = messageMasker(object)
  t.deepEqual(maskedObject, { password: '*' })
})

test('messageMasker: mask password from an object without this property', t => {
  const messageMasker = createMessageMasker({
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })
  
  const object = { name: 'Pagar.me', library: 'Papyrus' }
  const maskedObject = messageMasker(object)
  t.deepEqual(maskedObject, object)
})

test('messageMasker: mask password value in differents paths', t => {
  const messageMasker = createMessageMasker({
    password: {
      paths: ['password', 'user.password', 'creditCard.password'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = {
    password: 'abc123',
    user: {
      password: '123abc'
    },
    creditCard: {
      password: '1a2b3c'
    }
  }

  const maskedObject = messageMasker(object)
  
  t.deepEqual(maskedObject, { 
    password: '*', 
    user: {
      password: '*',
    },
    creditCard: {
      password: '*' 
    }
  })
})

test('messageMasker: mask multiples differents values', t => {
  const messageMasker = createMessageMasker({
    password: {
      paths: ['password'],
      pattern: /\w.*/g,
      replacer: '*'
    },
    url: {
      paths: ['url', 'dashboard.url'],
      pattern: /\w.*/g,
      replacer: '*'
    }
  })

  const object = {
    password: '123abc',
    url: 'https://www.pagarme.com.br',
    dashboard: {
      url: 'https://api.pagar.me/1/status'
    }
  }

  const maskedObject = messageMasker(object)

  t.deepEqual(maskedObject, { 
    password: '*', 
    url: '*',
    dashboard: {
      url: '*' 
    }
  })
})
