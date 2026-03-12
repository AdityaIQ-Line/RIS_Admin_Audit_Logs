import svgPaths from "./svg-inlp3ugqm1";

export default function Input() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Input">
      <div className="content-stretch flex items-center min-h-[inherit] overflow-clip px-[12px] py-[7.5px] relative rounded-[inherit] size-full">
        <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[21px] items-center min-h-px min-w-px overflow-clip relative" data-name="AL">
          <div className="relative shrink-0 size-[20px]" data-name="Decoration left">
            <div className="absolute left-[2px] size-[0.01px] top-[2px]" data-name="Pixel override hack">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6669 14.6669">
                <path d={svgPaths.p22417810} fill="var(--fill-0, #64748B)" id="Pixel override hack" />
              </svg>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] gap-px items-center min-h-px min-w-px relative" data-name="AL">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#64748b] text-[14px] tracking-[0.07px]">Search by name or email</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}