const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// get all categories
router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [{ model: Product }],
  })
    .then((categories) => res.json(categories))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// get a single category by id
router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findByPk(req.params.id, {
    include: [{ model: Product }],
  })
    .then((category) => {
      if (!category) {
        res.status(404).json({ message: 'No category found with this ID.' });
        return;
      }
      res.json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// create new category
router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
    .then((category) => res.status(201).json(category))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// update category
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: { id: req.params.id },
  })
    .then((category) => {
      if (!category[0]) {
        res.status(404).json({ message: 'No category found with this ID.' });
        return;
      }
      res.json({ message: 'Category updated successfully.' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// delete one category by its `id` value
router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: { id: req.params.id },
  })
    .then((category) => {
      if (!category) {
        res.status(404).json({ message: 'No category found with this ID.' });
        return;
      }
      res.json({ message: 'Category deleted successfully.' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
