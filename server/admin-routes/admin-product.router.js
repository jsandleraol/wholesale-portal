const express = require('express')
const router = express.Router()
const uploadProductPhotos = require('../middleware/uploadphotosAWS')
const { rejectNonAdmin } = require('../modules/authentication-middleware')

const Product = require('../schemas/productSchema')

//getList
router.get('/', rejectNonAdmin, (req, res) => {
  console.log('Product List backend hit')
  const sortQuery = JSON.parse(req.query.sort)
  let sort = {}
  sort[sortQuery[0]] = sortQuery[1] === 'ASC' ? 1 : -1

  Product.find()
    .sort(sort)
    .then(products => {
      res.set('content-range', JSON.stringify(products.length))
      //  each object needs to have an 'id' field in order for
      //  reactAdmin to parse
      products = JSON.parse(
        JSON.stringify(products)
          .split('"_id":')
          .join('"id":')
      )
      res.json(products)
    })
    .catch(error => {
      console.log(error)
      res.status(500).send('no users found')
    })
})

//getOne
router.get('/:id', rejectNonAdmin, (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then(product => {
      product = JSON.parse(
        JSON.stringify(product)
          .split('"_id":')
          .join('"id":')
      )
      res.json(product)
    })
    .catch(err => {
      console.log('error: ', err)
      res.status(500).send('user not found.')
    })
})

// {!}  WRITE REJECTADMINUNAUTHENTICATED AND ADD TO ALL ADMIN ROUTES
// @route   POST /admin-products
// @desc    Posts new product
// @access  Private
router.post('/', rejectNonAdmin, uploadProductPhotos, async (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    priceTiers: req.body.priceTiers,
    metaData: req.body.metaData,
    imageData: req.imageMetaData,
    draft: req.body.draft
  })
  newProduct
    .save()
    .then(product => {
      product = JSON.parse(
        JSON.stringify(product)
          .split('"_id":')
          .join('"id":')
      )
      return res.json(product)
    })
    .catch(err => console.log(err))
})

// @route   PUT /admin-products/edit/:id
// @desc    Edit a product
// @access  Private
router.put('/:id', rejectNonAdmin, async (req, res) => {
  console.log('update hit', req.params.id)
  await Product.updateOne({ _id: req.params.id }, req.body)
    .then(product => {
      product = JSON.parse(
        JSON.stringify(product)
          .split('"_id":')
          .join('"id":')
      )
      return res.json(product)
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('Failed to update.')
    })
})
// router.post("/edit/:id", (req, res) => {
//   Product.updateOne({_id: req.user.id}, req.body)
//   .then((product) => res.json(product))
//   .catch((error) => {
//     console.log(error);
//     res.status(500).send("error editing product");
//   })
// });

// @route   DELETE /admin-products/:id
// @id      id of product
// @desc    Delete a Product
// @access  Private
router.delete('/:id', rejectNonAdmin, async (req, res) => {
  console.log('Delete backend hit')
  console.log('params: ', req.params)
  console.log('id: ', req.params._id)
  Product.deleteOne({ _id: req.params._id })
    .then(res => {
      console.log(res)
      res.status(200).send('item deleted')
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('Deletion failed!')
    })
})
// router.delete("/:id", (req, res) => {
//   console.log("delete backend hit")
//   console.log("id: ", req.user.id)
//   Product.findById(req.user.id)
//     .then((product) => product.remove().then(() => res.status(200).send("Product sucessfully deleted")))
//     // .then((product) => product.remove().then(() => res.json({ success: true })))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json("Can't delete product");
//     })
// });

module.exports = router
