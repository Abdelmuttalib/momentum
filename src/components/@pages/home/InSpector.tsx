import { Tab } from "@headlessui/react";
import { PrinterIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { type FC, useState } from "react";
import useTranslation from "next-translate/useTranslation";

import cn from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { inspections, type TBuilding, type TDefect } from "./data";
import InSpect from "./InSpect";

interface InSpectorProps {
  onPrint: () => void;
}

const InSpector: FC<InSpectorProps> = ({ onPrint }) => {
  const { t } = useTranslation("common");
  const [selectedDefect, setSelectedDefect] = useState<TDefect>(
    inspections["Main Building"][0] as TDefect
  );
  const [selectedImage, setSelectedImage] = useState(
    inspections["Main Building"][0]?.images[0] as string
  );

  const [selectedBuilding, setSelectedBuilding] =
    useState<TBuilding>("Main Building");

  const Tabs = () => {
    const buildings: TBuilding[] = Object.keys(inspections) as TBuilding[];
    return (
      <div className="h-full overflow-auto rounded">
        <Tab.Group>
          <Tab.List className="flex h-full items-center gap-2">
            {buildings.map((building) => (
              <Tab
                key={building}
                as="button"
                onClick={() => {
                  setSelectedBuilding(building);
                }}
                className={({ selected }) =>
                  cn(
                    "lg:label-sm h-fit w-full rounded-md px-4 py-3 text-left leading-5 sm:px-5",
                    "whitespace-nowrap focus:outline-none",
                    selected
                      ? "border-gray-800 bg-primary-100"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-50"
                  )
                }
              >
                {building}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    );
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col">
      {/* <div className='my-3 flex h-16 w-full items-center justify-between'>
        <h6 className='h5'>Main Building Inspection</h6>
        <Button size='sm' className='inline-flex h-fit gap-1'>
          <PlusIcon className='w-6' /> Upload image
        </Button>
      </div> */}

      <div className="flex flex-col print:hidden">
        {/* Header */}
        <div className="flex w-full items-center justify-between gap-6 rounded-lg px-4 py-2">
          <h6 className="h5 whitespace-nowrap">Main Building Inspection</h6>
          {/* <Tabs /> */}
          <Button
            onClick={onPrint}
            type="button"
            className="inline-flex items-center gap-2"
          >
            <PrinterIcon className="w-5" />
            {t("buttons.printFullReport")}
          </Button>
        </div>
        <div className="flex flex-col bg-slate-100 py-8">
          <div className="mx-auto mb-4 flex h-16 w-full max-w-4xl rounded-lg border-2 bg-slate-50 px-6">
            <div className="flex w-full items-center gap-3 px-4 pl-2">
              <h4 className="label-md">Buildings:</h4>
              <Tabs />
            </div>
            <div className="flex w-full items-center gap-3">
              <Input placeholder={t("labels.defectType")} />
              <Button className="whitespace-nowrap">Add more</Button>
            </div>
          </div>
          {/* <!-- smaller images under description --> */}
          <div className="flex h-full max-h-[75svh] gap-2 bg-slate-100">
            <div className="flex w-full max-w-[17rem]">
              <div className="flex w-full max-w-[17rem] flex-col gap-2 overflow-hidden overflow-y-scroll rounded-md border-2 border-l-0 bg-slate-50 px-5 py-7">
                {inspections[selectedBuilding].map((inspect) => (
                  <div key={inspect.defectId}>
                    {inspect.images.map((image) => (
                      <div key={image} className="relative h-[8rem] w-full">
                        <Image
                          className={cn(
                            "image1 description cursor-pointer opacity-50 hover:opacity-80",
                            {
                              "opacity-100": image === selectedImage,
                            }
                          )}
                          src={image}
                          alt={inspect.description}
                          onClick={() => {
                            setSelectedDefect(inspect);
                            setSelectedImage(image);
                          }}
                          layout="fill"
                        />
                      </div>
                    ))}
                  </div>
                ))}
                T
              </div>
            </div>

            {/* main */}
            <InSpect
              selectedImage={selectedImage}
              selectedDefect={selectedDefect}
            />

            {/* Info & Controls */}
            <div className="flex min-h-full max-w-[20rem] flex-col gap-6 overflow-y-scroll rounded-md border-2 bg-slate-50 px-5 py-3">
              <div className="flex h-full flex-col">
                <h3 className="body-lg mb-2 font-bold">
                  {/* {t('headings.information')} */}
                  {t("headings.defectInformation")}
                </h3>

                <div className="flex flex-col gap-3">
                  {[
                    { label: "defectID", value: selectedDefect.defectId },
                    { label: "imageType", value: selectedDefect.imageType },
                    {
                      label: "visibleImageID",
                      value: selectedDefect.visibleImageId,
                    },
                    {
                      label: "buildingNumber",
                      value: selectedDefect.buildingNumber,
                    },
                    {
                      label: "specificLocation",
                      value: selectedDefect.specificLocation,
                    },
                    { label: "defectType", value: selectedDefect.defectType },
                    { label: "description", value: selectedDefect.description },
                  ].map((item) => {
                    const label = t(`labels.${item.label}`);
                    return (
                      <div key={item.label}>
                        <div className="flex flex-col justify-between">
                          <p className="body-sm font-medium text-gray-500">
                            {label}
                          </p>
                          <p className="label-sm text-gray-800">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Airplane Mode</Label>
                  </div> */}
                  <div className="flex flex-col justify-between">
                    <p className="body-sm font-medium text-gray-500">
                      {/* Defect Type */}
                      {t("labels.defectType")}
                    </p>
                    <div className="flex w-full flex-col justify-between gap-2">
                      <Input
                        id="defectType"
                        type="text"
                        placeholder="Defect Type"
                        value="Blowing"
                        className={cn("flex-grow")}
                      />
                      <Button size="sm">Change</Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className='pb-10'>
            <h3 className='body-lg mb-2 font-bold'>Inspection Notes</h3>
            <div className='mt-2 space-y-2'>
              <textarea className='input h-20' placeholder='description' />
              <Input type='text' placeholder='remarks' className='h-10' />
              <Button size='sm' className='inline-flex w-full gap-1'>
                Save Info
              </Button>
            </div>
          </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InSpector;
