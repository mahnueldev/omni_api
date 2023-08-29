// controllers/web/userController.js
const { User } = require('../../database/models');

const showUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['lastName'],
    });

    const usersData = users.map(user => user.get({ plain: true }));

    res.render('index', { users: usersData });
  } catch (err) {
    console.error('Error fetching data from the database:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { showUser};
