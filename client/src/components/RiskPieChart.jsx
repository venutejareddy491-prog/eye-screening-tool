import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

export default function RiskPieChart({ riskFactors = [] }) {
  const data = riskFactors.slice(0, 6).map((f) => ({
    name: f.name,
    value: f.weight,
  }));

  if (!data.length) {
    return (
      <div className="glass-card p-6 h-64 flex items-center justify-center text-slate-500">
        No significant risk factors detected
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Risk Factor Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
