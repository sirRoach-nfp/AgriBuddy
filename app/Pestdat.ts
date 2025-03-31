/*

interface PestImages {
  [key: string]: any; // Index signature
  whiteflies: any;
  fruitworm: any;
  thrips: any;
}

*/

interface PestImages {
  [key: string]: any; // Index signature
  aphids: any;
  beanfly: any;
  cutworms: any;
  fruitborer: any;
  //fruitfly: any;
  fruitworm: any;
  leafhoppers: any;
  podborer: any;
  //spidermites: any;
  spottedladybeetle: any;
  squashbeetle: any;
  thrips: any;
  whiteflies: any;
  //yellowbeetle: any;
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
  TomatoDef0001_sol: any; //goods
  EggplantDef0002_sol: any; // goods
  BellPepperDef0003_sol: any; // pass 
  PotatoDef0004_sol: any; // goods
  ChilliPepperDef0005_sol: any; // goods
  SquashDef0001_cuc: any; //goods
  BottleGourdDef0002_cuc: any; //goods
  SpongeGourdDef0003_cuc: any;//goods
  CucumberDef0004_cuc: any; //goods
  BitterGourdDef0005_cuc: any; //goods
  MungBeansDef0001_fab: any; // goods
  SitawDef0002_fab: any; //goods
  PeanutDef0003_fab: any;// goods
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

/*
 const pestImages : PestImages ={
    whiteflies: require('../assets/images/Pests/whiteflies.jpg'),
    fruitworm: require('../assets/images/Pests/fruitworm.jpg'),
    thrips: require('../assets/images/Pests/thrips.jpg'),
    // Add more images...
  };

  */

  const pestImages: PestImages = {
    aphids: require('../assets/images/Pests/aphids.jpg'),
    beanfly: require('../assets/images/Pests/beanfly.jpg'),
    cutworms: require('../assets/images/Pests/cutworms.jpg'),
    fruitborer: require('../assets/images/Pests/fruitborer.jpg'),
    //fruitfly: require('../assets/images/Pests/fruitfly.jpg'),
    fruitworm: require('../assets/images/Pests/fruitworm.jpg'),
    leafhoppers: require('../assets/images/Pests/leafhoppers.jpg'),
    podborer: require('../assets/images/Pests/podborer.jpg'),
    //spidermites: require('../assets/images/Pests/spidermites.jpg'),
    spottedladybeetle: require('../assets/images/Pests/spottedladybeetle.jpg'),
    squashbeetle: require('../assets/images/Pests/squashbeetle.jpg'),
    thrips: require('../assets/images/Pests/thrips.jpg'),
    whiteflies: require('../assets/images/Pests/whiteflies.jpg'),
    //yellowbeetle: require('../assets/images/Pests/yellowbeetle.jpg'),
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