const { User } = require('../../database/models');

// Get logged in user
const getUserProfile = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.email);

    const foundUser = await User.findOne({
      where: { email: req.user },
      attributes: { exclude: ['password', 'refreshToken'] },
    });
    
    if (!foundUser) {
      console.log('User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Found user:', foundUser);

    res.json(foundUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.destroy();
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'refreshToken'] },
    });
    if (!users.length) {
      return res.status(204).json({ msg: 'No Users found' });
    }
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { getUserProfile, deleteUser, getAllUsers };
