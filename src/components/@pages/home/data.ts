export type TBuilding = "Main Building" | "Building 1";

export type TDefect = {
  defectId: string;
  imageType: string;
  visibleImageId: string;
  buildingNumber: string;
  specificLocation: string;
  defectType: string;
  description: string;
  images: string[];
};

export type TDefectData = {
  [K in TBuilding]: TDefect[];
};

export const inspections: TDefectData = {
  "Main Building": [
    {
      defectId: "D0012",
      imageType: "Visible",
      visibleImageId: "D0012A",
      buildingNumber: "No.19-20, Building 1",
      specificLocation: "West Facade",
      defectType: "Manual Repair",
      description: "There are many patching marks on the facade.",
      images: ["/images/inspect/d0012.png"],
    },
    {
      defectId: "D0023",
      imageType: "Visible",
      visibleImageId: "D0023A",
      buildingNumber: "No.15-16, Building 3",
      specificLocation: "25F-26F, East Facade",
      defectType: "Local cracking/ Water Seepage",
      description:
        "There are some local crack and water seepage marks on the surface layer.",
      images: ["/images/inspect/d0023.png"],
    },
    {
      defectId: "D0044",
      imageType: "Visible",
      visibleImageId: "D0044A",
      buildingNumber: "No.17-18, Building 2",
      specificLocation: "40/H~K, 3F-4F, East Facade",
      defectType: "Water Seepage",
      description:
        "There is local seepage and mildew marks on the surface layer.",
      images: ["/images/inspect/d0044.png"],
    },
    {
      defectId: "E0132",
      imageType: "Visible / Thermal",
      visibleImageId: "E0132A",
      buildingNumber: "No.15-16, Building 3",
      specificLocation: "5F-9F, West Facade",
      defectType: "Blowing/ Cracking/ Manual Repair",
      description:
        "There are blowing and some cracking marks with manual repair marks on the surface.",
      images: [
        "/images/inspect/e0132.png",
        "/images/inspect/e0132-thermal.png",
      ],
    },
  ],

  "Building 1": [
    {
      defectId: "E0034",
      imageType: "Visible / Thermal",
      visibleImageId: "E0034A",
      buildingNumber: "No.17-18, Building 2",
      specificLocation: "8F-12F, North Facade",
      defectType: "Blowing/ Water Seepage",
      description:
        "There is blowing on the outer wall surface and construction reserved hole. And there are also some water seepage marks on the surface.",
      images: [
        "/images/inspect/e0034.png",
        "/images/inspect/e0034-thermal.png",
      ],
    },
    {
      defectId: "E0002",
      imageType: "Visible / Thermal",
      visibleImageId: "E0002A",
      buildingNumber: "No.19-20, Building 1",
      specificLocation: "25F-26F, East Facade",
      defectType: "Blowing",
      description: "There is blowing on the outer wall surface.",
      images: [
        "/images/inspect/e0002.png",
        "/images/inspect/e0002-thermal.png",
      ],
    },
    {
      defectId: "E0008",
      imageType: "Visible / Thermal",
      visibleImageId: "E0008A",
      buildingNumber: "No.19-20, Building 1",
      specificLocation: "10F-11F, East Facade",
      defectType: "Blowing/ Cracking",
      description:
        "There is blowing on the outer wall surface and construction reserved hole. And there are also some cracking marks on the surface.",
      images: [
        "/images/inspect/e0008.png",
        "/images/inspect/e0008-thermal.png",
      ],
    },
    {
      defectId: "E0013",
      imageType: "Visible / Thermal",
      visibleImageId: "E0013A",
      buildingNumber: "No.19-20, Building 1",
      specificLocation: "25F-26F, East Facade",
      defectType: "Blowing/ Cracking",
      description: "There are blowing and some cracking marks on the surface.",
      images: [
        "/images/inspect/e0013.png",
        "/images/inspect/e0013-thermal.png",
      ],
    },
  ],
};
