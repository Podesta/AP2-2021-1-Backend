const imagesSplit = files => {
  let mainImg = [];
  let secImg = [];

  if (files['mainImage']) {
    mainImg = files['mainImage'].map(image => image.location);
  }

  if (files['secImages']) {
    secImg = files['secImages'].map(image => image.location);
  }

  return [mainImg, secImg];
};

module.exports = imagesSplit;
