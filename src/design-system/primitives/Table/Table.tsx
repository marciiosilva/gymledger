import * as React from "react";
import { cn } from "../../utils/cn";

type Density = "comfortable" | "compact";

interface TableContextValue {
  density: Density;
}

const TableContext = React.createContext<TableContextValue>({ density: "comfortable" });

export interface TableRootProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: Density;
}

const TableRoot = React.forwardRef<HTMLDivElement, TableRootProps>(
  ({ className, density = "comfortable", children, ...props }, ref) => (
    <TableContext.Provider value={{ density }}>
      <div ref={ref} className={cn("w-full overflow-x-auto", className)} {...props}>
        <table className="w-full border-collapse">{children}</table>
      </div>
    </TableContext.Provider>
  )
);
TableRoot.displayName = "Table";

const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("border-b border-[var(--color-border)]", className)} {...props} />
));
TableHead.displayName = "Table.Head";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "Table.Body";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[var(--color-border)] transition-colors duration-[var(--duration-fast)]",
      "hover:bg-[var(--color-surface-soft)]",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "Table.Row";

const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-3 py-3 text-left",
      "font-body text-[var(--text-xs)] font-[800] uppercase tracking-[0.06em] text-[var(--color-text-muted)]",
      "whitespace-nowrap",
      className
    )}
    {...props}
  />
));
TableHeaderCell.displayName = "Table.HeaderCell";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { density } = React.useContext(TableContext);
  return (
    <td
      ref={ref}
      className={cn(
        "px-3 font-body text-[var(--text-sm)] text-[var(--color-text-primary)]",
        density === "comfortable" ? "py-4" : "py-2",
        className
      )}
      {...props}
    />
  );
});
TableCell.displayName = "Table.Cell";

export interface TableEmptyProps extends React.HTMLAttributes<HTMLTableRowElement> {
  colSpan?: number;
  message?: string;
}

const TableEmpty = React.forwardRef<HTMLTableRowElement, TableEmptyProps>(
  ({ colSpan = 999, message = "Nenhum registro encontrado.", className, ...props }, ref) => (
    <tr ref={ref} className={className} {...props}>
      <td
        colSpan={colSpan}
        className="px-3 py-12 text-center font-body text-[var(--text-sm)] text-[var(--color-text-muted)]"
      >
        {message}
      </td>
    </tr>
  )
);
TableEmpty.displayName = "Table.Empty";

export const Table = Object.assign(TableRoot, {
  Head:       TableHead,
  Body:       TableBody,
  Row:        TableRow,
  HeaderCell: TableHeaderCell,
  Cell:       TableCell,
  Empty:      TableEmpty,
});
