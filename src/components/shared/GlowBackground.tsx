interface GlowBackgroundProps {
  variant?: 'default' | 'hero' | 'accent';
  className?: string;
}

export default function GlowBackground({
  variant = 'default',
  className = '',
}: GlowBackgroundProps) {
  const configs = {
    default: [
      { size: 600, x: '70%', y: '20%', opacity: 0.08 },
      { size: 400, x: '20%', y: '70%', opacity: 0.05 },
    ],
    hero: [
      { size: 800, x: '75%', y: '15%', opacity: 0.12 },
      { size: 600, x: '15%', y: '75%', opacity: 0.06 },
      { size: 500, x: '50%', y: '50%', opacity: 0.04 },
    ],
    accent: [
      { size: 500, x: '80%', y: '30%', opacity: 0.1 },
    ],
  };

  const blobs = configs[variant];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(ellipse, rgba(102, 153, 204, ${blob.opacity}), transparent 70%)`,
            filter: 'blur(120px)',
          }}
        />
      ))}
    </div>
  );
}
