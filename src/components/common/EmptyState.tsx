
import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
}
