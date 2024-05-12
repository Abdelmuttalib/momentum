import { Menu, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

import { ALargeSmall } from "lucide-react";
import { useFontSize } from "@/hooks/use-font-size";

import { iconButtonVariants } from "@/components/ui/icon-button";
import { FONT_SIZES } from "@/utils/fonts";
import { cn } from "@/utils/cn";

export function FontSizeSelect() {
  const [fontSize, setFontSize] = useFontSize();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          as="button"
          className={cn(
            iconButtonVariants({
              variant: "ghost",
            }),
            "hidden sm:flex"
          )}
        >
          A{/* <ALargeSmall className="w-6 text-foreground-light" /> */}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-layer p-1.5 text-sm text-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="relative">
            {FONT_SIZES?.map((fontS) => {
              const fontClass = `font-${fontS}`;

              return (
                <Menu.Item key={`${fontS}`}>
                  <button
                    onClick={() => {
                      setFontSize({
                        fontSize: fontS,
                      });
                    }}
                    className={cn(
                      "flex w-full items-center rounded px-3 py-2 font-medium capitalize text-foreground",
                      {
                        "bg-primary-500 text-white":
                          fontS === fontSize.fontSize,
                        "hover:bg-gray-hover": fontS !== fontSize.fontSize,
                      },
                      fontClass
                    )}
                  >
                    {/* <span className={cn('w-4 h-4 rounded-full mr-2')}></span> */}
                    <>{fontS}</>
                    {fontS === fontSize.fontSize && (
                      <CheckIcon className="absolute right-2 h-4 w-4 text-current" />
                    )}
                  </button>
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
