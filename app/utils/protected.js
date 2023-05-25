const { verify } = require('jsonwebtoken')
const { User } = require('../models/user')
const { auth } = require('../../settings')

// Middleware for protected routes
// Checks if the user is authenticated and adds the user to the request
const protected = async (req, res, next) => {
  const authorization = req.headers["authorization"]
  if (!authorization) // There's no access tokein in the headers
    return res.status(401).json({ error: 'Unauthorized' });

  // Verify the token 
  const token = authorization.split(' ')[1];
  let id;
  try {
    id = verify(token, auth.access_token_secret).id;
  } catch (err) {
    return res.status(500).json({ message: 'Invalid token', type: 'error' });
  }

  if (!id) // Invalid tpken 
    return res.status(401).json({ message: 'Invalid token', type: 'error' });

  // Check if the user exists
  const user = await User.findById(id);
  if (!user) // The user doesn't exist
    return res.status(500).json({ message: 'User does not exist', type: 'error' });

  // Add the user to the request
  req.user = user;
  next();
}

module.exports = { protected };
