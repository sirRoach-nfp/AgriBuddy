interface PestImages {
  [key: string]: any; // Index signature
  whiteflies: any;
  fruitworm: any;
  thrips: any;
}
interface DiseaseImages {
  [key: string]: any; // Index signature
  nematodes: any;
  bacterialwilt: any;
  mosaicvirus: any;
}

interface SoilImage{
  [key: string]: any;
  loamy: any;
  sandy: any;
  clay: any;  
}
 const pestImages : PestImages ={
    whiteflies: require('../assets/images/Pests/whiteflies.jpg'),
    fruitworm: require('../assets/images/Pests/fruitworm.jpg'),
    thrips: require('../assets/images/Pests/thrips.jpg'),
    // Add more images...
  };


  const diseaseImages : DiseaseImages ={
    nematodes: require('../assets/images/Diseases/nematodes.jpg'),
    bacterialwilt: require('../assets/images/Diseases/bacterialWilt.jpg'),
    mosaicvirus: require('../assets/images/Diseases/mosaicVirus.jpg'),
    // Add more images...
  }

  const soilImages: SoilImage = {
    loamy: require('../assets/images/Soil/loam.jpg'),
    sandy: require('../assets/images/Soil/sandy.jpg'),
    clay: require('../assets/images/Soil/clay.jpg'),
    // Add more images...
  };


export {pestImages,diseaseImages,soilImages}