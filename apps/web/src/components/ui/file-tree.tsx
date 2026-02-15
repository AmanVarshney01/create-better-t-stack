"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type TreeViewElement = {
  id: string;
  name: string;
  isSelectable?: boolean;
  children?: TreeViewElement[];
};

type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  direction: "rtl" | "ltr";
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

type Direction = "rtl" | "ltr" | undefined;

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  dir?: Direction;
} & React.HTMLAttributes<HTMLDivElement>;

function Tree({
  className,
  elements,
  initialSelectedId,
  initialExpandedItems,
  children,
  indicator = true,
  openIcon,
  closeIcon,
  dir,
  ...props
}: TreeViewProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
  const [expandedItems, setExpandedItems] = useState<string[] | undefined>(initialExpandedItems);

  const selectItem = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleExpand = useCallback((id: string) => {
    setExpandedItems((prev) => {
      if (prev?.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...(prev ?? []), id];
    });
  }, []);

  const expandSpecificTargetedElements = useCallback(
    (elements?: TreeViewElement[], selectId?: string) => {
      if (!elements || !selectId) return;
      const findParent = (currentElement: TreeViewElement, currentPath: string[] = []) => {
        const isSelectable = currentElement.isSelectable ?? true;
        const newPath = [...currentPath, currentElement.id];
        if (currentElement.id === selectId) {
          if (isSelectable) {
            setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
          } else {
            if (newPath.includes(currentElement.id)) {
              newPath.pop();
              setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
            }
          }
          return;
        }
        if (isSelectable && currentElement.children && currentElement.children.length > 0) {
          currentElement.children.forEach((child) => {
            findParent(child, newPath);
          });
        }
      };
      elements.forEach((element) => {
        findParent(element);
      });
    },
    [],
  );

  useEffect(() => {
    if (initialSelectedId) {
      expandSpecificTargetedElements(elements, initialSelectedId);
    }
  }, [initialSelectedId, elements, expandSpecificTargetedElements]);

  const direction = dir === "rtl" ? "rtl" : "ltr";

  return (
    <TreeContext.Provider
      value={{
        selectedId,
        expandedItems,
        handleExpand,
        selectItem,
        setExpandedItems,
        indicator,
        openIcon,
        closeIcon,
        direction,
      }}
    >
      <div className={cn("size-full", className)} {...props}>
        <ScrollArea className="relative h-full px-2">
          <div className="flex flex-col gap-1">{children}</div>
        </ScrollArea>
      </div>
    </TreeContext.Provider>
  );
}

Tree.displayName = "Tree";

function TreeIndicator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { direction } = useTree();

  return (
    <div
      dir={direction}
      className={cn(
        "bg-muted absolute left-1.5 h-full w-px rounded-md py-3 duration-300 ease-in-out hover:bg-border rtl:right-1.5",
        className,
      )}
      {...props}
    />
  );
}

TreeIndicator.displayName = "TreeIndicator";

type FolderProps = {
  element: string;
  value: string;
  isSelectable?: boolean;
  isSelect?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

function Folder({
  className,
  element,
  value,
  isSelectable = true,
  isSelect,
  children,
  ...props
}: FolderProps) {
  const { handleExpand, expandedItems, indicator, openIcon, closeIcon } = useTree();

  const isExpanded = expandedItems?.includes(value);

  return (
    <AccordionPrimitive.Root
      className="relative h-full overflow-hidden"
      value={isExpanded ? [value] : []}
      onValueChange={() => handleExpand(value)}
    >
      <AccordionPrimitive.Item value={value} {...props}>
        <AccordionPrimitive.Header>
          <AccordionPrimitive.Trigger
            className={cn(`flex items-center gap-1 rounded-md text-sm`, className, {
              "bg-muted rounded-md": isSelect && isSelectable,
              "cursor-pointer": isSelectable,
              "cursor-not-allowed opacity-50": !isSelectable,
            })}
            disabled={!isSelectable}
          >
            {isExpanded
              ? (openIcon ?? <FolderOpenIcon className="size-4" />)
              : (closeIcon ?? <FolderIcon className="size-4" />)}
            <span>{element}</span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Panel
          className={cn(
            "relative h-full overflow-hidden text-sm",
            "data-[open]:animate-accordion-down data-[closed]:animate-accordion-up",
          )}
        >
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <div className="ml-5 flex flex-col gap-1 py-1 rtl:mr-5">{children}</div>
        </AccordionPrimitive.Panel>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
}

Folder.displayName = "Folder";

type FileProps = {
  value: string;
  handleSelect?: (id: string) => void;
  isSelectable?: boolean;
  isSelect?: boolean;
  fileIcon?: React.ReactNode;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function File({
  value,
  className,
  handleSelect: _handleSelect,
  isSelectable = true,
  isSelect,
  fileIcon,
  children,
  ...props
}: FileProps) {
  const { direction, selectedId, selectItem } = useTree();
  const isSelected = isSelect ?? selectedId === value;
  return (
    <button
      type="button"
      disabled={!isSelectable}
      className={cn(
        "flex w-fit items-center gap-1 rounded-md pr-1 text-sm duration-200 ease-in-out rtl:pr-0 rtl:pl-1",
        {
          "bg-muted": isSelected && isSelectable,
        },
        isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
        direction === "rtl" ? "rtl" : "ltr",
        className,
      )}
      onClick={() => selectItem(value)}
      {...props}
    >
      {fileIcon ?? <FileIcon className="size-4" />}
      {children}
    </button>
  );
}

File.displayName = "File";

type CollapseButtonProps = {
  elements: TreeViewElement[];
  expandAll?: boolean;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function CollapseButton({ elements, expandAll = false, children, ...props }: CollapseButtonProps) {
  const { expandedItems, setExpandedItems } = useTree();

  const expendAllTree = useCallback(
    (elements: TreeViewElement[]) => {
      const expandTree = (element: TreeViewElement) => {
        const isSelectable = element.isSelectable ?? true;
        if (isSelectable && element.children && element.children.length > 0) {
          setExpandedItems?.((prev) => [...(prev ?? []), element.id]);
          element.children.forEach(expandTree);
        }
      };

      elements.forEach(expandTree);
    },
    [setExpandedItems],
  );

  const closeAll = useCallback(() => {
    setExpandedItems?.([]);
  }, [setExpandedItems]);

  useEffect(() => {
    if (expandAll) {
      expendAllTree(elements);
    }
  }, [expandAll, elements, expendAllTree]);

  return (
    <Button
      variant={"ghost"}
      className="absolute right-2 bottom-1 h-8 w-fit p-1"
      onClick={expandedItems && expandedItems.length > 0 ? closeAll : () => expendAllTree(elements)}
      {...props}
    >
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  );
}

CollapseButton.displayName = "CollapseButton";

export { CollapseButton, File, Folder, Tree, type TreeViewElement };
