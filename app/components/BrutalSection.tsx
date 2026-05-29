import React from "react";

interface BrutalSectionProps {
  label: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function BrutalSection({ label, title, children, className = "" }: BrutalSectionProps) {
  return (
    <section className={`py-16 px-6 bg-black ${className}`}>
      <div className="max-w-7xl mx-auto">
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: "var(--accent)" }}
        >
          {label}
        </p>
        <h2 className="text-5xl font-bold text-white tracking-tight mb-10">{title}</h2>
        {children}
      </div>
    </section>
  );
}
