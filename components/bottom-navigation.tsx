"use client";

import {
  BookIcon,
  HomeIcon,
  InfoIcon,
  PlusIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Dock, DockIcon, DockItem, DockLabel } from "./dock";
import { AddDiscipleForm, CreateCellReportForm } from "./quick-actions";
import { Button } from "./ui/button";

const menuItems = [
  {
    name: "Home",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Disciples",
    url: "/disciples",
    icon: UsersIcon,
  },
  {
    name: "Reports",
    url: "/cell-reports",
    icon: BookIcon,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <Dock>
      {menuItems.map((menu) => (
        <DockItem key={menu.url} asChild active={pathname.startsWith(menu.url)}>
          <Link href={menu.url}>
            <DockIcon>
              <menu.icon />
            </DockIcon>
            <DockLabel>{menu.name}</DockLabel>
          </Link>
        </DockItem>
      ))}
      <MobileCreateDockItem />
    </Dock>
  );
}

type QuickActionType = "add-disciple" | "create-cell-report";

function MobileCreateDockItem() {
  const [open, setOpen] = useState(false);

  const [action, setAction] = useState<QuickActionType>();

  function reset() {
    setAction(undefined);
    setOpen(false);
  }

  function triggerAction(action: QuickActionType) {
    setAction(action);
    setOpen(false);
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <DockItem>
            <DockIcon>
              <PlusIcon />
            </DockIcon>
            <DockLabel>Create</DockLabel>
          </DockItem>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="!text-left border-b">
            <DrawerTitle className="text-sm">Create Actions</DrawerTitle>
            <DrawerDescription>Pick an action to do.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-1 px-2 py-2">
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => triggerAction("add-disciple")}
            >
              <UserPlusIcon /> Add a Disciple
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => triggerAction("create-cell-report")}
            >
              <PlusIcon /> Create Cell Report
            </Button>
          </div>
          <DrawerFooter className="flex-row items-center gap-2 border-t text-muted-foreground text-xs">
            <InfoIcon className="size-3" />
            <p>
              You can also add Disciple and create Cell Report in their
              respective pages.
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <AddDiscipleForm
        open={action === "add-disciple"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      />
      <CreateCellReportForm
        open={action === "create-cell-report"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            reset();
          }
        }}
      />
    </>
  );
}
