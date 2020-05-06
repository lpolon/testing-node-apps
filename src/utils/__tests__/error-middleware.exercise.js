import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'
// Testing Middleware

// stubs of .status() and .json() middleware. implementation doesn't metter
const buildRes = overrides => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    ...overrides,
  }
  return res
}

test('responds with 401 for express-jwt UnauthorizedError', () => {
  // setup
  /*whatever code or message and check from error to make it very clear our intention in this test*/
  const code = 'some_error_code'
  const message = 'some error message'
  // create stubs
  const error = new UnauthorizedError(code, {message})
  const req = {} // just the right type
  const res = buildRes()
  const next = jest.fn() // implementation doesn't metter. just whether it was called or not.
  errorMiddleware(error, req, res, next)
  // defensive testing: next() should no be called in a error middleware
  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledTimes(1) // good practice to check number of times mock function as called
  expect(res.status).toHaveBeenCalledWith(401)
  expect(res.json).toHaveBeenCalledWith({
    code: error.code,
    message: error.message,
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

// 🐨 Write a test for the headersSent case
test('calls next if headersSent is true', () => {
  // a lot of repetition:
  const error = new Error(`doesn't matter in this test`)
  const req = {}
  const res = buildRes({headersSent: true})
  const next = jest.fn()
  errorMiddleware(error, req, res, next)
  expect(next).toHaveBeenCalledTimes(1)
  expect(next).toHaveBeenCalledWith(error)
  expect(res.status).not.toHaveBeenCalled()
  expect(res.json).not.toHaveBeenCalled()
})

test('responds with 500 and the error object', () => {
  const error = new Error('whatever')
  const req = {}
  const res = buildRes()
  const next = jest.fn()

  errorMiddleware(error, req, res, next)

  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(500)
  expect(res.json).toHaveBeenCalledWith({
    message: error.message,
    stack: error.stack,
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})
