interface PestImages {
  [key: string]: any; // Index signature
  whiteflies: any;
  fruitworm: any;
  thrips: any;
}

 
 const pestImages : PestImages ={
    whiteflies: require('../assets/images/Pests/whiteflies.jpg'),
    fruitworm: require('../assets/images/Pests/fruitworm.jpg'),
    thrips: require('../assets/images/Pests/thrips.jpg'),
    // Add more images...
  };


export {pestImages}