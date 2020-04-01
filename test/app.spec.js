const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200', () => {
    return supertest(app)
      .get('/recipe')
      .expect(200)
  })
  it('GET / responds with 200', () => {
    return supertest(app)
      .get('/:recipeId')
      .expect(200)
  })
})