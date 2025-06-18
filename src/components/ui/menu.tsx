// import { Menu, Transition } from "@headlessui/react";
// import { CheckIcon, LanguageIcon } from "@heroicons/react/20/solid";
// import { Fragment } from "react";

import { cn } from "@/utils/cn";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

// import { useFont } from "@/hooks/use-font";

// import { iconButtonVariants } from "@/components/ui/icon-button";
// import { cn } from "@/utils/cn";
// import { FONTS } from "@/utils/fonts";

// export function FontSelect() {
//   const [font, setFont] = useFont();

//   return (
//     <Menu as="div" className="relative inline-block text-left">
//       <div>
//         <Menu.Button
//           as="button"
//           className={cn(
//             iconButtonVariants({
//               variant: "ghost",
//             }),
//             "hidden sm:flex"
//           )}
//         >
//           <LanguageIcon className="w-5 text-foreground-light" />
//         </Menu.Button>
//       </div>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-popover p-1.5 text-sm text-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//           <div className="relative">
//             {FONTS?.map(({ name, value }) => {
//               const fontClass = `font-${value}`;

//               return (
//                 <Menu.Item key={`${name}`}>
//                   <button
//                     onClick={() => {
//                       setFont({
//                         font: value,
//                       });
//                     }}
//                     className={cn(
//                       "flex w-full items-center rounded px-3 py-2.5 font-medium capitalize text-foreground",
//                       {
//                         "bg-primary/50 text-white": value === font.font,
//                         "hover:bg-accent": value !== font.font,
//                       },
//                       fontClass
//                     )}
//                   >
//                     {/* <span className={cn('w-4 h-4 rounded-full mr-2')}></span> */}
//                     <>{name}</>
//                     {value == font.font && (
//                       <CheckIcon className="absolute right-2 h-4 w-4 text-current" />
//                     )}
//                   </button>
//                 </Menu.Item>
//               );
//             })}
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// }

// // abstract the Menu component parts to be reusable in other parts of the application

export const MenuButton = Menu.Button;
export const MenuItem = Menu.Item;
const MenuItems = Menu.Items;
const TransitionComponent = Transition;

type CustomMenuProps = {
  items: React.ReactNode[];
  menuButton: React.ReactNode;
  className?: string;
  menuItemsClassName?: string;
};

export function CustomMenu({
  items,
  menuButton,
  className,
  menuItemsClassName,
}: CustomMenuProps) {
  return (
    <Menu as="div" className={cn("relative inline-block text-left", className)}>
      <div>
        {/* <MenuButton
          as="button"
          className={cn(
            iconButtonVariants({
              variant: "ghost",
            }),
            "hidden sm:flex"
          )}
        >
          <LanguageIcon className="w-5 text-foreground-light" />
        </MenuButton> */}

        {menuButton}
      </div>
      <TransitionComponent
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            "absolute right-0 mt-2 w-40 origin-top-right overflow-hidden rounded bg-popover text-sm text-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            menuItemsClassName
          )}
        >
          {/* wrap each item in a menu item */}
          {items.map((item: React.ReactNode, index: number) => (
            <MenuItem
              key={index}
              // @ts-expect-error - TODO: fix types
              className="relative flex cursor-default select-none items-center rounded-sm px-2.5 py-2 text-sm text-muted-foreground outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              {item}
            </MenuItem>
          ))}
          {/* <div className="relative">{<>{items}</>}</div> */}
        </MenuItems>
      </TransitionComponent>
    </Menu>
  );
}
