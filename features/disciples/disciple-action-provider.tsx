"use client";

import React, { useState } from "react";
import type { Disciple } from "@/app/generated/prisma";

type RowAction = "edit" | "delete" | "change-status";

interface DiscipleActionContextState {
  action: RowAction | undefined;
  selectedDisciple: Disciple | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDisciple: React.Dispatch<React.SetStateAction<Disciple | null>>;
  handleAction: (action: RowAction) => void;
  resetState: VoidFunction;
}

const DiscipleActionContext =
  React.createContext<DiscipleActionContextState | null>(null);

export function DiscipleActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<RowAction>();
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(
    null,
  );

  const handleAction = (action: RowAction) => {
    setAction(action);
    setOpen(false);
  };

  const resetState = () => {
    setAction(undefined);
    setSelectedDisciple(null);
    setOpen(false);
  };

  return (
    <DiscipleActionContext.Provider
      value={{
        action,
        selectedDisciple,
        open,
        handleAction,
        resetState,
        setOpen,
        setSelectedDisciple,
      }}
    >
      {children}
    </DiscipleActionContext.Provider>
  );
}

export function useDiscipleAction() {
  const context = React.useContext(DiscipleActionContext);

  if (!context)
    throw new Error(
      `useDiscipleAction must be used inside a <DiscipleActionProvider />`,
    );

  return context;
}
