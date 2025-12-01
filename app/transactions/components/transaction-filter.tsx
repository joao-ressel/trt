"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChevronDown } from "lucide-react";

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface PropsFilter {
  month: number;
  year: number;
  years: number[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function TransactionsFilter({ month, year, years }: PropsFilter) {
  const router = useRouter();

  function update(m: number, y: number) {
    router.push(`/transactions?month=${m}&year=${y}`);
  }

  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  return (
    <div className="flex gap-3">
      <Popover open={openMonth} onOpenChange={setOpenMonth}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {MONTHS[month - 1]}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-40">
          <Command>
            <CommandList>
              <CommandGroup heading="Months">
                {MONTHS.map((label, idx) => (
                  <CommandItem
                    key={idx}
                    onSelect={() => {
                      update(idx + 1, year);
                      setOpenMonth(false);
                    }}
                  >
                    {label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openYear} onOpenChange={setOpenYear}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {year}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-40">
          <Command>
            <CommandList>
              <CommandGroup heading="Years">
                {years.map((y) => (
                  <CommandItem
                    key={y}
                    onSelect={() => {
                      update(month, y);
                      setOpenYear(false);
                    }}
                  >
                    {y}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
