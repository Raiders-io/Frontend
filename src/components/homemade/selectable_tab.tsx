import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import CheckBoxTab from "./checkbox_tab"
import React, { createContext, useContext, useState } from "react"
import { create } from "axios"
import { Search } from "lucide-react"
import SearchBar, { SearchBarInput } from "./search_bar"

type Key = string | number

//TODO className is not working for the table, need to fix it

interface SelectableTabProps<T, K extends Key> {
  data: T[]
  getKey: (item: T) => K
  getLabel: (item: T) => React.ReactNode
  selected: Set<K>
  onSelectionChanged: (selection: Set<K>) => void
  className?: string
  children?: React.ReactNode
}

export default function SelectableTab<T, K extends Key>({
  data,
  getKey,
  getLabel,
  selected,
  onSelectionChanged,
  className,
  children,
}: SelectableTabProps<T, K>) {
  // return (
  //   <SelectableTabContext.Provider
  //     value={{
  //       data,
  //       getKey,
  //       getLabel,
  //       selected,
  //       onSelectionChanged,
  //       className,
  //       children,
  //     }}
  //   >
  //     <Popover>{children}</Popover>
  //   </SelectableTabContext.Provider>
  // )
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{children}</Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverHeader>
          <SearchBar search="" onSearch={console.log("shearch")}>
            <SearchBarInput
              onClick={(e) => {
                e.preventDefault()
              }}
            />
          </SearchBar>
        </PopoverHeader>
        <CheckBoxTab
          data={data}
          getKey={getKey}
          getLabel={getLabel}
          selected={selected}
          onSelectionChanged={onSelectionChanged}
          className={className}
        />
      </PopoverContent>
    </Popover>
  )
}
