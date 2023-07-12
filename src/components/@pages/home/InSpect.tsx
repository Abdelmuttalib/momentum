import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  HandRaisedIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/20/solid";
import { type FC, type MouseEvent, useRef, useState } from "react";

import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

import { type TDefect } from "./data";

interface InSpectProps {
  selectedImage: string;
  selectedDefect: TDefect;
}

const InSpect: FC<InSpectProps> = ({ selectedImage, selectedDefect }) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const [isDragging, setIsDragging] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.1);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => (prevZoom > 0.1 ? prevZoom - 0.1 : 0.1));
  };

  const handleMouseDown = () => {
    if (isDraggable) {
      setIsDragging(true);
      if (imageRef.current) {
        imageRef.current.style.cursor = "grabbing";
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (isDraggable) {
      if (imageRef.current) {
        imageRef.current.style.cursor = "grab";
      }
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLImageElement>) => {
    if (isDragging) {
      setPosition((prevPosition) => ({
        x: prevPosition.x + e.movementX,
        y: prevPosition.y + e.movementY,
      }));
    }
  };

  const handleHandIconClick = () => {
    setIsDraggable((prevIsDraggable) => !prevIsDraggable);
    if (imageRef.current) {
      imageRef.current.style.cursor = isDraggable ? "grab" : "default";
    }
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });

    if (imageRef.current) {
      imageRef.current.style.transform = "scale(1)";
      imageRef.current.style.cursor = "default";
    }

    setIsDragging(false);
    setIsDraggable(false);
  };

  return (
    <div className="w-full flex-grow">
      <section className="rounded-lg">
        {/*  shadow-2xl */}
        <div className="relative w-full">
          <div className="flex gap-3 rounded-lg">
            {/* <!-- large image on slides --> */}
            <div
              className={cn(
                "relative h-[75svh] min-h-full w-full overflow-hidden rounded-md bg-slate-100",
                {
                  "fixed inset-0 z-50 h-full w-full": fullScreen,
                }
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                // style={{ transform: `scale(${zoom})`, overflow: 'hidden' }}
                ref={imageRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{
                  cursor: isDraggable ? "grab" : "default",
                  transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: "top left",
                  transition: "cursor 0.3s ease",
                }}
                className="description relative h-full w-full object-contain"
                src={selectedImage}
                alt={selectedDefect.description}
                // layout='fill'
                // objectFit='contain'
              />
              {/* <!-- image description --> */}
              {/* <div className='body-md rounded-bl-lg rounded-br-lg bg-gray-800 py-2 text-center font-medium tracking-wider text-white'>
                  <p>Main Building</p>
                </div> */}

              <Button
                onClick={handleReset}
                className="absolute bottom-2 right-14 px-2.5 py-2"
                variant="outline"
              >
                {/* {t('buttons.reset')} */}
                重置
              </Button>

              <div className="absolute bottom-2 right-2 flex w-10 flex-col gap-1 rounded-lg bg-white">
                <IconButton
                  className={cn(
                    "w-full rounded-none rounded-t-lg border-0 bg-transparent"
                  )}
                  variant={isDraggable ? "secondary" : "outline"}
                  onClick={handleHandIconClick}
                >
                  <HandRaisedIcon key="handraisedicon" className="w-5" />
                </IconButton>
                {/* <IconButton className={cn('border-0 bg-transparent rounded-none')} variant='outline'>
                    <RectangleStackIcon
                      key='rectanglestackicon'
                      className='w-5'
                    />
                  </IconButton> */}
                <IconButton
                  className={cn("w-full rounded-none border-0 bg-transparent")}
                  variant="outline"
                  onClick={zoomIn}
                >
                  <MagnifyingGlassPlusIcon
                    key="magnifyingglassplusicon"
                    className="w-5"
                  />
                </IconButton>
                <IconButton
                  className={cn("w-full rounded-none border-0 bg-transparent")}
                  variant="outline"
                  onClick={zoomOut}
                >
                  <MagnifyingGlassMinusIcon
                    key="magnifyingglassminusicon"
                    className="w-5"
                  />
                </IconButton>
                {/* <IconButton className={cn('border-0 bg-transparent rounded-none')} variant='outline'>
                    <BookmarkIcon key='bookmarkicon' className='w-5' />
                  </IconButton> */}
                {/* <IconButton className={cn('border-0 bg-transparent rounded-none')} variant='outline'>
                    <TrashIcon key='trashicon' className='w-5' />
                  </IconButton> */}
                <IconButton
                  className={cn(
                    "w-full rounded-none rounded-b-lg border-0 bg-transparent"
                  )}
                  variant={fullScreen ? "secondary" : "outline"}
                  onClick={() => setFullScreen((prevValue) => !prevValue)}
                >
                  {fullScreen ? (
                    <ArrowsPointingInIcon
                      key="arrowspointinginicon"
                      className="w-5"
                    />
                  ) : (
                    <ArrowsPointingOutIcon
                      key="arrowspointingouticon"
                      className="w-5"
                    />
                  )}
                </IconButton>
                {/* {[
                    <HandRaisedIcon key='handraisedicon' className='w-5' />,
                    <RectangleStackIcon
                      key='rectanglestackicon'
                      className='w-5'
                    />,
                    <MagnifyingGlassPlusIcon
                      key='magnifyingglassplusicon'
                      className='w-5'
                    />,
                    <MagnifyingGlassMinusIcon
                      key='magnifyingglassminusicon'
                      className='w-5'
                    />,
                    <BookmarkIcon key='bookmarkicon' className='w-5' />,
                    <TrashIcon key='trashicon' className='w-5' />,
                    <ArrowsPointingOutIcon
                      key='arrowspointingouticon'
                      className='w-5'
                    />,
                  ].map((icon) => (
                    <IconButton className={cn('border-0 bg-transparent rounded-none')} key={icon.key} variant='outline'>
                      {icon}
                    </IconButton>
                  ))} */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InSpect;
