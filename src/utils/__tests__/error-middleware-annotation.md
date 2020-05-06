v1:
```js
import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'
// Testing Middleware
test('responds with 401 for express-jwt UnauthorizedError', () => {
  // setup
  /*whatever code or message and check from error to make it very clear our intention in this test*/
  const code = 'some_error_code'
  const message = 'some error message'
  // create stubs
  const error = new UnauthorizedError(code, {message})
  const req = {} // just the right type
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  } // stubs of .status() and .json() middleware. implementation doesn't metter
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

// 🐨 Write a test for the else case (responds with a 500)

/*
const myFn = jest.fn(() => 42)
const result = myFn({message: 'hello'})

expect(result).toBe(42)
expect(myFn).toHaveBeenCalledWith({message: 'hello'})
expect(myFn).toHaveBeenCalledTimes(1)
*/
```
