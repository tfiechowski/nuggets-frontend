'use client';

import { useOpenWindow } from '@/app/popup/useOpenWindow';
import { DEFAULT_URL } from '@/app/utils/config';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type CCall = {
  id: string;
  title: string;
  scheduledAt: string;
};

const columnHelper = createColumnHelper<CCall>();

function AssistantOpener({ link }: { link: string }) {
  console.log('🚀 ~ AssistantOpener ~ link:', link);
  const openWindow = useOpenWindow();

  return <Button onClick={() => openWindow(link, false)}>Open Assistant</Button>;
}

const columns: ColumnDef<CCall>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'scheduledAt',
    header: 'Date',
  },
  columnHelper.display({
    id: 'open-assistant',
    header: 'Assistant',
    cell: (props) => (
      <div>
        <AssistantOpener link={`${DEFAULT_URL}/call/${props.row.original.id}`}></AssistantOpener>
      </div>
    ),
  }),
];

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<CCall, TValue>[];
}

export function CallsTable({ data }: any) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
