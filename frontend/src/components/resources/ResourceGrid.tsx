import type { Resource } from "@/types";
import { ResourceCard } from "./ResourceCard";
import { cn } from "@/lib/utils";

interface ResourceGridProps {
  resources: Resource[];
  className?: string;
}

export function ResourceGrid({ resources, className }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No resources found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {resources.map((resource) => (
        <ResourceCard key={resource._id} resource={resource} />
      ))}
    </div>
  );
}
