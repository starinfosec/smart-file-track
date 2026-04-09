import React from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { FileRecord } from '../types';

interface DashboardChartsProps {
  files: FileRecord[];
}

export default function DashboardCharts({ files }: DashboardChartsProps) {
  // Status Data
  const statusCounts = files.reduce((acc: any, file) => {
    acc[file.status] = (acc[file.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  // Department Data
  const deptCounts = files.reduce((acc: any, file) => {
    acc[file.department] = (acc[file.department] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(deptCounts).map(dept => ({
    name: dept,
    count: deptCounts[dept]
  }));

  // Timeline Data (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const timelineData = last7Days.map(date => {
    const count = files.filter(f => f.createdAt.startsWith(date)).length;
    return { date, count };
  });

  const COLORS = ['#FACC15', '#000000', '#4B5563', '#9CA3AF', '#E5E7EB', '#FDE047', '#1F2937'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Status Distribution */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6">File Status Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department-wise Files */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6">Department-wise Files</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6B7280' }} 
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#F9FAFB' }} />
              <Bar dataKey="count" fill="#FACC15" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Movement Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
        <h3 className="text-lg font-bold mb-6">Daily Movement Timeline</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#000000" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#FACC15', strokeWidth: 2, stroke: '#000000' }}
                activeDot={{ r: 6, fill: '#FACC15' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
