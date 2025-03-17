import React, { createContext, useState, useContext } from "react";

interface CropType {
  CropId: string;
  CropFamily: string;
  CropName: string;
  CropRoot:string
  
}

type CropContextType = {
  selectedCrops: CropType[]; 
  addCrop: (crop: CropType) => void; // Accepts a CropType object
  removeCrop: (cropId: string) => void; // Removes by CropId
  clearCrops: () => void;
};

const CropContext = createContext<CropContextType | undefined>(undefined);

export const CropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCrops, setSelectedCrops] = useState<CropType[]>([]);

  const addCrop = (crop: CropType) => {
    if (selectedCrops.length < 4) {
      setSelectedCrops((prev) => [...prev, crop]); // ✅ Now correctly adding CropType
    }
  };

  const removeCrop = (cropId: string) => {
    setSelectedCrops((prev) => prev.filter((crop) => crop.CropId !== cropId)); // ✅ Now removing by CropId
  };

  const clearCrops = () => {
    setSelectedCrops([]);
    console.log("cleared crops")
    console.log(selectedCrops)
  };

  return (
    <CropContext.Provider value={{ selectedCrops, addCrop, removeCrop, clearCrops }}>
      {children}
    </CropContext.Provider>
  );
};

export const useCropContext = () => {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error("useCropContext must be used within a CropProvider");
  }
  return context;
};