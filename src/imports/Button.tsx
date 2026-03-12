import svgPaths from "./svg-6p275y1f6b";

export default function Button() {
  return (
    <div className="bg-[#f8fafc] relative rounded-[4px] size-full" data-name="Button">
      <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#334155] text-[14px] text-center">Filter 4</p>
        <div className="relative shrink-0 size-[16px]" data-name="Right Icon">
          <div className="absolute inset-[33.33%_20.83%]" data-name="fill">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 5.33333">
              <path clipRule="evenodd" d={svgPaths.p23cd8f00} fill="var(--fill-0, #64748B)" fillRule="evenodd" id="fill" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_-2px_-2px_2px_0px_rgba(15,23,42,0.14),inset_2px_2px_2px_1px_rgba(255,255,255,0.9)]" />
      <div aria-hidden="true" className="absolute border border-[#cbd5e1] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}