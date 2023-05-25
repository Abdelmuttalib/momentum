import { type FC } from "react";
import { type TDefect } from "./data";

const DefectReportTable: FC<{ data: TDefect }> = ({ data }) => {
  const {
    defectId,
    imageType,
    visibleImageId,
    buildingNumber,
    specificLocation,
    defectType,
    description,
  } = data;
  return (
    <table className="rounded-lg border border-gray-100">
      {/* <thead className='bg-gray-50 dark:bg-gray-800/60'> */}
      <tbody>
        <tr className="border-b border-gray-200 text-left text-gray-600 dark:border-gray-800 dark:text-gray-200">
          <th className="label-sm whitespace-nowrap px-2 py-2">Defect ID</th>
          <td className="px-2 py-2">{defectId}</td>
        </tr>
        <tr className="border-b border-gray-200 text-left text-gray-600 dark:border-gray-800 dark:text-gray-200">
          <th className="label-sm whitespace-nowrap px-2 py-2">Image Type</th>
          <td className="px-2 py-2">{imageType}</td>
        </tr>
        <tr className="border-b border-gray-200 text-left text-gray-600 dark:border-gray-800 dark:text-gray-200">
          <th className="label-sm whitespace-nowrap px-2 py-2">
            Visible Image ID
          </th>
          <td className="px-2 py-2">{visibleImageId}</td>
        </tr>
        <tr className="border-b border-gray-200 text-left text-gray-600 dark:border-gray-800 dark:text-gray-200">
          <th className="label-sm whitespace-nowrap px-2 py-2">
            Building Number
          </th>
          <td className="px-2 py-2">{buildingNumber}</td>
        </tr>
        <tr className="border-b border-gray-200 text-left text-gray-600 dark:border-gray-800 dark:text-gray-200">
          <th className="label-sm whitespace-nowrap px-2 py-2">
            Specific Location
          </th>
          <td className="px-2 py-2">{specificLocation}</td>
        </tr>
        <tr className="border-b border-gray-200 text-left text-gray-600 dark:border-gray-800 dark:text-gray-200">
          <th className="label-sm whitespace-nowrap px-2 py-2">Defect Type</th>
          <td className="px-2 py-2">{defectType}</td>
        </tr>
        <tr className="border-b border-gray-200 text-left text-gray-600 dark:border-gray-800 dark:text-gray-200">
          <th className="label-sm whitespace-nowrap px-2 py-2">Description</th>
          <td className="px-2 py-2">{description}</td>
        </tr>
      </tbody>
      {/* <th className='label-sm whitespace-nowrap px-2 py-4'>Images</th> */}
      {/* </tr> */}
      {/* </thead> */}
      {/* <tbody>
          <tr
            key={data.defectId}
            className='body-sm flex flex-col whitespace-nowrap border-b border-gray-200 bg-white text-gray-900 dark:border-gray-800/50 dark:bg-gray-800/40 dark:text-gray-200'
          > */}

      {/* <td className='px-2 py-5'>
                {item.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={item.defectId}
                    width={50}
                    height={50}
                  />
                ))}
              </td> */}
    </table>
  );
};

interface PrintableReportProps {
  data: TDefect[];
}

const PrintableReport: FC<PrintableReportProps> = ({ data }) => {
  return (
    <div className="hidden print:block">
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        <div className="relative h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/invix-logo-full.png"
            alt="invix logo"
            // layout='fill'
            // objectFit='cover'
            className="h-full w-full object-cover"
          />
          <hr className="my-5" />
          <h1 className="label-md text-center">Inspection Report</h1>
        </div>
      </div>
      {data.map((inspect: TDefect) => (
        <div
          className="relative flex h-full min-h-screen w-full break-after-page flex-col gap-8 pt-8"
          key={inspect.defectId}
        >
          {/* <Image
            src='/images/invix-logo.png'
            alt='invix logo'
            width='50'
            height='50'
            className='absolute right-0 top-0'
          /> */}
          <DefectReportTable data={inspect} />
          <div>
            {inspect.images.map((image) => (
              <div key={image} className="relative h-[40%] w-[80%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={inspect.description}
                  // layout='fill'
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintableReport;
