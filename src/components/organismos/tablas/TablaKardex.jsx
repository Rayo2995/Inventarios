import styled from "styled-components";
import { ContentAccionesTabla, Paginacion } from "../../../index";
import { v } from "../../../styles/variables";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaArrowsAltV } from "react-icons/fa";

export function TablaKardex({ data, refrescar }) {
  if (!data || data.length === 0) return null;

  const [columnFilters, setColumnFilters] = useState([]);

  const columns = [
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: (info) => (
        <span>{new Date(info.getValue()).toLocaleDateString("es-CO")}</span>
      ),
    },
    {
      accessorKey: "nro_documento",
      header: "Nro. Doc",
      cell: (info) => <span>{info.getValue() || "-"}</span>,
    },
    {
      accessorKey: "producto",
      header: "Producto",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (info) => (
        <TipoBadge $tipo={info.getValue()}>
          {info.getValue() === "entrada" ? "⬆ Entrada" : "⬇ Salida"}
        </TipoBadge>
      ),
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "precio_unitario",
      header: "Precio Unit.",
      cell: (info) => <span>${Number(info.getValue()).toFixed(2)}</span>,
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: (info) => <span>${Number(info.getValue()).toFixed(2)}</span>,
    },
    {
      accessorKey: "proveedor",
      header: "Proveedor",
      cell: (info) => <span>{info.getValue() || "-"}</span>,
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
      cell: (info) => <span>{info.getValue() || "-"}</span>,
    },
    {
      accessorKey: "usuario",
      header: "Usuario",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: (info) => <span>{info.getValue() || "-"}</span>,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <Container>
      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.column.columnDef.header}
                    {header.column.getCanSort() && (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FaArrowsAltV />
                      </span>
                    )}
                    {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()]}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((item) => (
              <tr key={item.id}>
                {item.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginacion
        table={table}
        irinicio={() => table.setPageIndex(0)}
        pagina={table.getState().pagination.pageIndex + 1}
        maximo={table.getPageCount()}
      />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  margin: 2%;
  overflow-x: auto;

  .table-wrapper {
    overflow-x: auto;
    width: 100%;
  }

  .responsive-table {
    width: 100%;
    border-spacing: 0;
    font-size: 0.9em;

    thead {
      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: 600;
        text-align: center;
        padding: 10px 8px;
        color: ${({ theme }) => theme.text};
        white-space: nowrap;
      }
    }

    tbody {
      tr {
        &:nth-of-type(even) {
          background-color: rgba(78, 78, 78, 0.12);
        }
        &:hover {
          background-color: rgba(103, 93, 241, 0.1);
          transition: 0.2s;
        }
      }
      td {
        padding: 10px 8px;
        text-align: center;
        border-bottom: 1px solid rgba(161, 161, 161, 0.2);
        white-space: nowrap;
      }
    }
  }
`;

const TipoBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85em;
  background-color: ${(props) =>
    props.$tipo === "entrada"
      ? "rgba(34, 197, 94, 0.2)"
      : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) =>
    props.$tipo === "entrada" ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"};
`;