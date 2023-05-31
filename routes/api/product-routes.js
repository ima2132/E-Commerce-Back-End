const sequelize = require('../../config/connection');
const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint


// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    include: [
      { model: Category },
      { model: Tag, through: ProductTag }
    ]
  })
    .then((products) => res.json(products))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: { id: req.params.id },
    include: [
      { model: Category },
      { model: Tag, through: ProductTag }
    ]
  })
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: 'No product found with this id' });
        return;
      }
      res.json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      // find all associated tags for the product
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const currentTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newTagIds = req.body.tagIds.filter((tagId) => !currentTagIds.includes(tagId));
      // figure out which ones to remove
      const tagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions as a transaction
      return sequelize.transaction((t) => {
        return ProductTag.destroy({ where: { id: tagsToRemove } }, { transaction: t })
          .then(() => {
            const newProductTags = newTagIds.map((tagId) => ({
              product_id: req.params.id,
              tag_id: tagId,
            }));
            return ProductTag.bulkCreate(newProductTags, { transaction: t });
          });
      });
    })
    .then(() => {
      // get the updated product
      return Product.findOne({
        where: { id: req.params.id },
        include: [
          { model: Category },
          { model: Tag, through: ProductTag },
        ],
      });
    })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        res.status(404).json({ message: 'No product found with this id' });
        return;
      }
      res.json(updatedProduct);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// delete one product by its `id` value
router.delete('/:id', (req, res) => {

  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedProduct) => {
      if (!deletedProduct) {
        res.status(404).json({ message: 'No product found with this ID.' });
        return;
      }
      res.json({ message: 'Product deleted successfully.' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
