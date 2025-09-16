import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: string;
  noDecimal?: boolean;
  usePeso?: boolean;
}

export const NumberInput = ({
  className,
  type = "number",
  currency,
  noDecimal,
  usePeso,
  onChange,
  ...props
}: InputProps) => {
  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    if (!onChange) return;

    if (noDecimal) {
      if (e.currentTarget.value.includes(".")) {
        return;
      }
    }

    onChange(e);
  }

  if (currency || usePeso)
    return (
      <div className="relative rounded-md">
        <div className="absolute top-0 left-0 flex h-full min-w-9 items-center justify-center rounded-l p-1 text-center">
          <span className="text-muted-foreground text-sm">
            {usePeso ? "₱" : currency}
          </span>
        </div>
        <Input
          className={cn("pl-7", className)}
          type={type}
          inputMode="numeric"
          onWheel={(e) => {
            e.currentTarget?.blur();
          }}
          {...props}
          onChange={handleOnChange}
        />
      </div>
    );

  return (
    <Input
      className={className}
      type="number"
      inputMode="numeric"
      onWheel={(e) => {
        e.currentTarget?.blur();
      }}
      {...props}
      onChange={handleOnChange}
    />
  );
};
