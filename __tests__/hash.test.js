const bcrypt = require('bcryptjs');

test('hash and verify password', () => {
  const pass = 'secret';
  const hash = bcrypt.hashSync(pass, 8);
  expect(bcrypt.compareSync(pass, hash)).toBe(true);
});
