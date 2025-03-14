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

interface CropsImage {
  [key: string]: any;
  TomatoDef0001_sol: any;
  EggplantDef0002_sol: any;
  BellPepperDef0003_sol: any;
  PotatoDef0004_sol: any;
  ChilliPepperDef0005_sol: any;
  SquashDef0001_cuc: any;
  BottleGourdDef0002_cuc: any;
  SpongeGourdDef0003_cuc: any;
  CucumberDef0004_cuc: any;
  BitterGourdDef0005_cuc: any;
  MungBeansDef0001_fab: any;
  SitawDef0002_fab: any;
  PeanutDef0003_fab: any;
}

const cropsImages: CropsImage = {
  TomatoDef0001_sol: require('../assets/images/Crops/Tomato.jpg'),
  EggplantDef0002_sol: require('../assets/images/Crops/Eggplant.jpg'),
  BellPepperDef0003_sol: require('../assets/images/Crops/BellPepper.jpg'),
  PotatoDef0004_sol: require('../assets/images/Crops/Potato.jpg'),
  ChilliPepperDef0005_sol: require('../assets/images/Crops/ChilliPepper.jpg'),
  SquashDef0001_cuc: require('../assets/images/Crops/Squash.jpg'),
  BottleGourdDef0002_cuc: require('../assets/images/Crops/BottleGourd.jpg'),
  SpongeGourdDef0003_cuc: require('../assets/images/Crops/SpongeGourd.jpg'),
  CucumberDef0004_cuc: require('../assets/images/Crops/Cucumber.jpg'),
  BitterGourdDef0005_cuc: require('../assets/images/Crops/BitterGourd.jpg'),
  MungBeansDef0001_fab: require('../assets/images/Crops/MungBeans.jpg'),
  SitawDef0002_fab: require('../assets/images/Crops/Sitaw.jpg'),
  PeanutDef0003_fab: require('../assets/images/Crops/Peanut.jpg'),
};
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


export {pestImages,diseaseImages,soilImages,cropsImages}