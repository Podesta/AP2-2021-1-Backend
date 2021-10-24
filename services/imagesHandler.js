const imagesSplit = files => {

  const mainImg = files['mainImage'].map(image => image.location);
  const secImg = files['secImages'].map(image => image.location);

  return [mainImg, secImg];
};

module.exports = imagesSplit;
