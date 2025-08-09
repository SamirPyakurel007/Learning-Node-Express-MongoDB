module.exports = (temp, product) => {
  let output = temp.replace(/{%product-name%}/g, product.productName);
  output = output.replace(/{%image%}/g, product.image);
  output = output.replace(/{%price%}/g, product.price);
  output = output.replace(/{%nutrients%}/g, product.nutrients);
  output = output.replace(/{%location%}/g, product.from);
  output = output.replace(/{%quantity%}/g, product.quantity);
  output = output.replace(/{%description%}/g, product.description);
  output = output.replace(/{%id%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%not-organic%}/g, "not-organic");
  return output;
};
