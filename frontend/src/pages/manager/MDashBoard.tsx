import { useEffect, useReducer } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import MHeader from "../../widgets/M-header/M-header";
import MSidebar from "../../widgets/M-sidebar/M-sidebar";
import "./MDashboard.css";

// 차트 데이터 타입
interface ChartData {
  day: string;
  sales: number;
}

// 테이블의 한 행 데이터 타입
interface TableRow {
  [key: string]: string | number;
}

// 대시보드 상태 타입
interface DashboardState {
  salesData: ChartData[];
  userPurchases: TableRow[];
  productSales: TableRow[];
  loading: boolean;
  error: string | null;
}

type Action =
  | {
      type: "FETCH_SUCCESS";
      payload: {
        salesData: ChartData[];
        userPurchases: TableRow[];
        productSales: TableRow[];
      };
    }
  | { type: "FETCH_ERROR"; error: string };

const initialState: DashboardState = {
  salesData: [],
  userPurchases: [],
  productSales: [],
  loading: true,
  error: null,
};

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, ...action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

// 카드 컴포넌트
function DashboardCard({
  title,
  value,
  change,
  positive,
}: DashboardCardProps) {
  return (
    <div className="dashboard-card">
      <p className="card-title">{title}</p>
      <p className="card-value">{value}</p>
      <p className={`card-change ${positive ? "positive" : "negative"}`}>
        {change}
      </p>
    </div>
  );
}

// ChartContainer 컴포넌트의 Props 타입
interface ChartContainerProps {
  title: string;
  data: ChartData[];
}

// 차트 컴포넌트
function ChartContainer({ title, data }: ChartContainerProps) {
  return (
    <div className="chart-container">
      <p className="chart-title">{title}</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TableContainerProps {
  title: string;
  data: TableRow[];
}

function TableContainer({ title, data }: TableContainerProps) {
  if (!data || data.length === 0) {
    return <p>{title} 데이터가 없습니다.</p>;
  }

  const columnLabels: { [key: string]: string } = {
    id: "아이디",
    amount: "총 구매액",
    date: "최근 구매일",
    name: "제품명",
    revenue: "매출액",
    quantity: "판매수량",
    lastSale: "최근판매일",
  };

  return (
    <div className="table-container">
      <p className="table-title">{title}</p>
      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key: string) => (
              <th key={key}>{columnLabels[key] || key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const rowKey = JSON.stringify(row); 
            return (
              <tr key={rowKey}>
                {Object.entries(row).map(([key, value]) => (
                  <td key={`${rowKey}-${key}`}>
                    {typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// 메인 대시보드 컴포넌트
function MDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, usersRes, productsRes] = await Promise.all([
          axios.get("/api/orders/sales"),
          axios.get("/api/users/me/orders"),
          axios.get("/api/products"),
        ]);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            salesData: salesRes.data,
            userPurchases: usersRes.data,
            productSales: productsRes.data,
          },
        });
      } catch (error: unknown) {
        const errorMsg =
          error instanceof Error ? error.message : "에러가 발생했습니다.";
        dispatch({ type: "FETCH_ERROR", error: errorMsg });
      }
    };
    fetchData();
  }, []);

  if (state.loading) return <p>로딩 중...</p>;
  if (state.error) return <p>에러 발생: {state.error}</p>;

  return (
    <div className="dashboard-wrapper">
      <MHeader title="관리자 대시보드" />
      <div className="dashboard-layout">
        <MSidebar />
        <div className="dashboard-container">
          <div className="dashboard-grid">
            <DashboardCard
              title="오늘의 매출"
              value="₩2,456,000"
              change="전일 대비 12% 증가"
              positive={true}
            />
            <DashboardCard
              title="신규 주문"
              value="28건"
              change="전일 대비 8건 증가"
              positive={true}
            />
            <DashboardCard
              title="재고 부족"
              value="12개"
              change="5개 상품 긴급 입고 필요"
            />
            <DashboardCard
              title="신규 회원"
              value="15명"
              change="전일 대비 3명 증가"
              positive={true}
            />
          </div>

          <div className="dashboard-content">
            <ChartContainer title="일일 매출 추이" data={state.salesData} />
            <TableContainer
              title="사용자별 구매 현황"
              data={state.userPurchases}
            />
          </div>

          <TableContainer title="제품별 매출 현황" data={state.productSales} />
        </div>
      </div>
    </div>
  );
}

export default MDashboard;
