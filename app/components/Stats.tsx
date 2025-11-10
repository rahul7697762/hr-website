import React from 'react';

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl lg:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">{value}</p>
    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">{label}</p>
  </div>
);

const Stats: React.FC = () => {
  const stats = [
    { value: '10K+', label: 'Students Helped' },
    { value: '500+', label: 'Companies Covered' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'AI Support' },
  ];

  return (
    <section className="py-20 sm:py-24 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;