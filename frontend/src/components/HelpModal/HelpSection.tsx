import React from 'react';

interface HelpSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  colorClass?: string;
}

export default function HelpSection({ title, icon, children, colorClass = "text-blue-400" }: HelpSectionProps) {
  return (
    <section>
      <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
        <span className={colorClass}>{icon}</span>
        {title}
      </h3>
      <div className="text-gray-300">
        {children}
      </div>
    </section>
  );
}
