import styled from "styled-components";
import { Header } from "../../index";
import { useState } from "react";
import { useReportesStore } from "../../store/ReportesStore";
import { useEmpresaStore } from "../../store/EmpresaStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function ReportesTemplate() {
  const [state, setState] = useState(false);
  const { datamovimientosmes, datastockbajo, datatotales } = useReportesStore();
  const { dataempresa } = useEmpresaStore();

  const totalEntradas = datatotales?.total_entradas ?? 0;
  const totalSalidas = datatotales?.total_salidas ?? 0;
  const balance = datatotales?.balance ?? 0;

  return (
    <Container>
      <header className="header">
        <Header stateConfig={{ state, setState: () => setState(!state) }} />
      </header>

      <section className="area1">
        <h1 className="titulo">Reportes — {dataempresa?.empresa}</h1>
      </section>

      {/* Tarjetas de totales */}
      <section className="tarjetas">
        <Tarjeta $color="#22c55e">
          <span className="label">💰 Total Entradas</span>
          <strong>${Number(totalEntradas).toLocaleString("es-CO")}</strong>
        </Tarjeta>
        <Tarjeta $color="#ef4444">
          <span className="label">📤 Total Salidas</span>
          <strong>${Number(totalSalidas).toLocaleString("es-CO")}</strong>
        </Tarjeta>
        <Tarjeta $color={balance >= 0 ? "#6366f1" : "#f97316"}>
          <span className="label">⚖️ Balance</span>
          <strong>${Number(balance).toLocaleString("es-CO")}</strong>
        </Tarjeta>
      </section>

      {/* Gráfica entradas vs salidas por mes */}
      <section className="grafica">
        <h2>Entradas vs Salidas por mes</h2>
        {datamovimientosmes?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={datamovimientosmes}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) =>
                  `$${Number(value).toLocaleString("es-CO")}`
                }
              />
              <Legend />
              <Bar dataKey="entradas" name="Entradas" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="salidas" name="Salidas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyMsg>No hay movimientos registrados aún.</EmptyMsg>
        )}
      </section>

      {/* Tabla stock bajo */}
      <section className="stockbajo">
        <h2>⚠️ Productos con stock bajo</h2>
        {datastockbajo?.length > 0 ? (
          <TablaStock>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {datastockbajo.map((item) => (
                <tr key={item.id}>
                  <td>{item.descripcion}</td>
                  <td>{item.stock}</td>
                  <td>{item.stock_minimo}</td>
                  <td>
                    <Badge $critico={item.stock === 0}>
                      {item.stock === 0 ? "🔴 Sin stock" : "🟡 Stock bajo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaStock>
        ) : (
          <EmptyMsg>✅ Todos los productos tienen stock suficiente.</EmptyMsg>
        )}
      </section>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 80px
    "tarjetas" auto
    "grafica" auto
    "stockbajo" auto;
  gap: 20px;

  .header { grid-area: header; display: flex; align-items: center; }
  .area1 { grid-area: area1; display: flex; align-items: center; }
  .titulo { font-size: 24px; font-weight: 700; }
  .tarjetas { grid-area: tarjetas; display: flex; flex-wrap: wrap; gap: 15px; }
  .grafica {
    grid-area: grafica;
    background: ${({ theme }) => theme.bg};
    border-radius: 16px;
    padding: 20px;
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
  }
  .stockbajo {
    grid-area: stockbajo;
    background: ${({ theme }) => theme.bg};
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 30px;
    h2 { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
  }
`;

const Tarjeta = styled.div`
  flex: 1;
  min-width: 200px;
  background: ${({ theme }) => theme.bg};
  border-radius: 16px;
  padding: 20px;
  border-left: 4px solid ${(props) => props.$color};
  display: flex;
  flex-direction: column;
  gap: 8px;

  .label {
    font-size: 13px;
    opacity: 0.7;
  }
  strong {
    font-size: 26px;
    font-weight: 700;
    color: ${(props) => props.$color};
  }
`;

const TablaStock = styled.table`
  width: 100%;
  border-spacing: 0;
  font-size: 0.9em;

  th {
    text-align: left;
    padding: 10px 8px;
    border-bottom: 2px solid rgba(115, 115, 115, 0.3);
    font-weight: 600;
    opacity: 0.8;
  }
  td {
    padding: 10px 8px;
    border-bottom: 1px solid rgba(161, 161, 161, 0.15);
  }
  tr:hover td {
    background: rgba(103, 93, 241, 0.08);
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  background: ${(props) =>
    props.$critico ? "rgba(239,68,68,0.15)" : "rgba(249,115,22,0.15)"};
  color: ${(props) => (props.$critico ? "#ef4444" : "#f97316")};
`;

const EmptyMsg = styled.p`
  opacity: 0.6;
  font-size: 14px;
  padding: 20px 0;
`;