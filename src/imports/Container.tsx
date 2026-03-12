import svgPaths from "./svg-y9b43qti1k";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[5.2px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.5px]">Radiologist Performance Analytics</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-center relative shrink-0 w-[341.414px]" data-name="Container">
      <Button />
      <Heading />
    </div>
  );
}

function LeadIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Lead Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Lead Icon">
          <path clipRule="evenodd" d={svgPaths.pdd62e30} fill="var(--fill-0, #334155)" fillRule="evenodd" id="fill" />
        </g>
      </svg>
    </div>
  );
}

function Field() {
  return (
    <div className="bg-[#f8fafc] h-[32px] relative rounded-[6px] shrink-0 w-full" data-name=".Field">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <LeadIcon />
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px not-italic relative text-[#64748b] text-[14px] whitespace-pre-wrap">From</p>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function InputDate() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[131px]" data-name="Input/Date">
      <Field />
    </div>
  );
}

function LeadIcon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Lead Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Lead Icon">
          <path clipRule="evenodd" d={svgPaths.pdd62e30} fill="var(--fill-0, #334155)" fillRule="evenodd" id="fill" />
        </g>
      </svg>
    </div>
  );
}

function Field1() {
  return (
    <div className="bg-[#f8fafc] h-[32px] relative rounded-[6px] shrink-0 w-full" data-name=".Field">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <LeadIcon1 />
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px not-italic relative text-[#64748b] text-[14px] whitespace-pre-wrap">To</p>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.06)]" />
    </div>
  );
}

function InputDate1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[131px]" data-name="Input/Date">
      <Field1 />
    </div>
  );
}

function DateRange() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Date Range">
      <InputDate />
      <div className="h-0 relative shrink-0 w-[9px]">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 1">
            <path d="M0 0.5H9" id="Vector 1" stroke="var(--stroke-0, #CBD5E1)" />
          </svg>
        </div>
      </div>
      <InputDate1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 w-[1068px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative w-full">
        <Container1 />
        <DateRange />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pb-px px-[24px] relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <Frame />
    </div>
  );
}