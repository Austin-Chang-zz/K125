import PhaseBadge from '../PhaseBadge';

export default function PhaseBadgeExample() {
  return (
    <div className="p-4 flex flex-wrap gap-2">
      <PhaseBadge phase="Y" />
      <PhaseBadge phase="A1" />
      <PhaseBadge phase="A2" />
      <PhaseBadge phase="A3" />
      <PhaseBadge phase="X" />
      <PhaseBadge phase="B1" />
      <PhaseBadge phase="B2" />
      <PhaseBadge phase="B3" />
    </div>
  );
}
