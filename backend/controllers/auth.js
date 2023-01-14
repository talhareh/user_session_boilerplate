const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({
        where: {
          email: email
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword
      });

      const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true }).json({ message: 'User created successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email: email
        }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true }).json({ message: 'User logged in successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }
};
