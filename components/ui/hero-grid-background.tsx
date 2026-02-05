'use client';

export const HeroGridBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),
              linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)]
          bg-[size:64px_64px]
          [transform:perspective(1000px)_rotateX(60deg)]
          origin-top
          opacity-40
          animate-grid-move
        "
      />

      {/* fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  );
};
