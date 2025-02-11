// import React from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import MHeader from "../../widgets/M-header/M-header";
// import MSidebar from "../../widgets/M-sidebar/M-sidebar";
// import "./MDashBoard.css";

// const salesData = [
//   { day: "월", sales: 800 },
//   { day: "화", sales: 900 },
//   { day: "수", sales: 950 },
//   { day: "목", sales: 1200 },
//   { day: "금", sales: 1300 },
//   { day: "토", sales: 1250 },
//   { day: "일", sales: 1270 },
// ];

// const userPurchases = [
//   { id: "user_123456", amount: 1250000, date: "2024-02-15" },
//   { id: "user_789012", amount: 875000, date: "2024-02-15" },
//   { id: "user_345678", amount: 750000, date: "2024-02-14" },
// ];

// const productSales = [
//   { name: "장난감 세트", revenue: 12500000, quantity: 250, lastSale: "2024-02-15" },
//   { name: "프리미엄 유기농 강아지 사료", revenue: 8750000, quantity: 175, lastSale: "2024-02-15" },
//   { name: "범퍼 침대", revenue: 15000000, quantity: 150, lastSale: "2024-02-14" },
// ];

// const MDashboard = () => {
//   return (
//     <div className="dashboard-wrapper">
//       <MHeader />
//       <div className="dashboard-layout">
//         <MSidebar />
//         <div className="dashboard-container">          
//           <div className="dashboard-grid">
//             <div className="dashboard-card">
//               <p className="card-title">오늘의 매출</p>
//               <p className="card-value">₩2,456,000</p>
//               <p className="card-change positive">전일 대비 12% 증가</p>
//             </div>
//             <div className="dashboard-card">
//               <p className="card-title">신규 주문</p>
//               <p className="card-value">28건</p>
//               <p className="card-change positive">전일 대비 8건 증가</p>
//             </div>
//             <div className="dashboard-card">
//               <p className="card-title">재고 부족</p>
//               <p className="card-value">12개</p>
//               <p className="card-change negative">5개 상품 긴급 입고 필요</p>
//             </div>
//             <div className="dashboard-card">
//               <p className="card-title">신규 회원</p>
//               <p className="card-value">15명</p>
//               <p className="card-change positive">전일 대비 3명 증가</p>
//             </div>
//           </div>

//           <div className="dashboard-content">
//             <div className="chart-container">
//               <p className="chart-title">일일 매출 추이</p>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={salesData}>
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="table-container">
//               <p className="table-title">사용자별 구매 현황</p>
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>사용자 ID</th>
//                     <th>총 구매액</th>
//                     <th>최근 구매일</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {userPurchases.map((user) => (
//                     <tr key={user.id}>
//                       <td>{user.id}</td>
//                       <td>₩{user.amount.toLocaleString()}</td>
//                       <td>{user.date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="product-sales-container">
//             <p className="table-title">제품별 매출 현황</p>
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>제품명</th>
//                   <th>매출액</th>
//                   <th>판매수량</th>
//                   <th>최근 판매일</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {productSales.map((product) => (
//                   <tr key={product.name}>
//                     <td>{product.name}</td>
//                     <td>₩{product.revenue.toLocaleString()}</td>
//                     <td>{product.quantity}</td>
//                     <td>{product.lastSale}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MDashboard;


import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import MHeader from "../../widgets/M-header/M-header";
import MSidebar from "../../widgets/M-sidebar/M-sidebar";
import "./MDashBoard.css";

interface SalesData {
  day: string;
  sales: number;
}

interface UserPurchase {
  id: string;
  amount: number;
  date: string;
}

interface ProductSale {
  name: string;
  revenue: number;
  quantity: number;
  lastSale: string;
}

const salesData: SalesData[] = [
  { day: "월", sales: 800 },
  { day: "화", sales: 900 },
  { day: "수", sales: 950 },
  { day: "목", sales: 1200 },
  { day: "금", sales: 1300 },
  { day: "토", sales: 1250 },
  { day: "일", sales: 1270 },
];

const userPurchases: UserPurchase[] = [
  { id: "user_123456", amount: 1250000, date: "2024-02-15" },
  { id: "user_789012", amount: 875000, date: "2024-02-15" },
  { id: "user_345678", amount: 750000, date: "2024-02-14" },
];

const productSales: ProductSale[] = [
  { name: "장난감 세트", revenue: 12500000, quantity: 250, lastSale: "2024-02-15" },
  { name: "프리미엄 유기농 강아지 사료", revenue: 8750000, quantity: 175, lastSale: "2024-02-15" },
  { name: "범퍼 침대", revenue: 15000000, quantity: 150, lastSale: "2024-02-14" },
];

const MDashboard: React.FC = () => {
  return (
    <div className="dashboard-wrapper">
      <MHeader />
      <div className="dashboard-layout">
        <MSidebar />
        <div className="dashboard-container">          
          <div className="dashboard-grid">
            <DashboardCard title="오늘의 매출" value="₩2,456,000" change="전일 대비 12% 증가" positive />
            <DashboardCard title="신규 주문" value="28건" change="전일 대비 8건 증가" positive />
            <DashboardCard title="재고 부족" value="12개" change="5개 상품 긴급 입고 필요" />
            <DashboardCard title="신규 회원" value="15명" change="전일 대비 3명 증가" positive />
          </div>

          <div className="dashboard-content">
            <ChartContainer title="일일 매출 추이" data={salesData} />
            <TableContainer title="사용자별 구매 현황" data={userPurchases} />
          </div>
          <TableContainer title="제품별 매출 현황" data={productSales} />
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, positive }) => (
  <div className="dashboard-card">
    <p className="card-title">{title}</p>
    <p className="card-value">{value}</p>
    <p className={`card-change ${positive ? "positive" : "negative"}`}>{change}</p>
  </div>
);

interface ChartContainerProps {
  title: string;
  data: SalesData[];
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, data }) => (
  <div className="chart-container">
    <p className="chart-title">{title}</p>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

interface TableContainerProps {
  title: string;
  data: any[];
}

const TableContainer: React.FC<TableContainerProps> = ({ title, data }) => {
  // 컬럼 라벨 매핑
  const columnLabels: Record<string, string> = {
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
            {Object.keys(data[0] || {}).map((key) => (
              <th key={key}>{columnLabels[key] || key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.entries(row).map(([key, value], idx) => (
                <td key={idx}>{typeof value === "number" ? value.toLocaleString() : value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MDashboard;
