const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../../auth/restricted-middleware.js');

router.get('/', restricted, onlyDept('finance'), (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

function onlyDept(dept) {
  return function(req, res, next) {
    console.log(req.user,'req in line 16');
    if(req.user && req.user.department && req.user.department.toLowerCase() === dept) {
      next();
    } else {
      res.status(403).json({ spell: 'Expelliarmus'})    
    }
  }
}

 //Delete user with specified id  /api/users/id

 router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Users.remove(id)
  .then(deleted => {
    if (deleted) {
      res.json({ removed: deleted });
    } else {
      res.status(404).json({ message: `Could not find user with id = ${id}` });
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete user' });
  });
});


module.exports = router;
