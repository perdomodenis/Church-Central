const middleware = require('./[middlewareName]');

describe('[Middleware Name]', () => {
  
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();
  });

  test('passes request on valid conditions', () => {
    req.headers.authorization = 'Bearer valid-token';

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('returns error on invalid conditions', () => {
    // No authorization header

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});