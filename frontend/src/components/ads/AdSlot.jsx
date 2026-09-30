
const AdSlot = ({ label, className = "", minHeight = "h-24" }) => {
  return (
    <div
      className={`border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center p-3 text-center transition-colors ${minHeight} ${className}`}
    >
      <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded mb-1">
        ADVERTISEMENT
      </span>
      <span className="text-xs text-slate-500 font-mono">{label}</span>
    </div>
  );
};

export default AdSlot;