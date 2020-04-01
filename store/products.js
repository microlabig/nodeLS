module.exports.getProducts = db => {
  return db
    .get('products')
    .value();
};

module.exports.setProduct = (db, obj) => {
  // obj = {src, name, price}
  db.get('products')
    .push(obj)
    .write();
};
