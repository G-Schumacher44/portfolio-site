interface ChipListProps {
  items: { label: string; href?: string }[];
  className?: string;
}

export default function ChipList({ items, className = '' }: ChipListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <span
          key={item.label}
          className="
            inline-block rounded-full border border-line
            bg-card px-3 py-1 text-sm text-muted
            transition-all duration-200
            hover:border-brand/30 hover:text-text hover:shadow-[0_0_12px_rgba(102,153,204,0.1)]
          "
        >
          {item.href ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          ) : (
            item.label
          )}
        </span>
      ))}
    </div>
  );
}
