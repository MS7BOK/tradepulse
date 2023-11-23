const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tag) {
      res.status(404).json({ error: 'Tag not found' });
      return;
    }

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);

    // If there are productIds provided, associate the products with the tag
    if (req.body.productIds && req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          product_id,
          tag_id: newTag.id,
        };
      });

      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Similar structure for update and delete operations

module.exports = router;
