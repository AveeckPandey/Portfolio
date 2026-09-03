export default function TearDivider() {
  return (
    <div className="pointer-events-none relative h-16 w-full overflow-hidden" aria-hidden="true">
      <img
        src="/assets/paper-tear-clean.webp"
        alt=""
        className="block h-full w-full object-fill"
      />
    </div>
  );
}
