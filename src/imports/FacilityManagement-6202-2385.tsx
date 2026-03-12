import svgPaths from "./svg-66m9x7zr1b";

function Input() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[5.2px] top-0" data-name="Input">
      <div className="content-stretch flex h-full items-center overflow-clip pl-[36px] pr-[20px] py-[4px] relative rounded-[inherit]">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#737373] text-[14px]">Search by facility name, code, or city...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14.0005L11.1333 11.1338" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[36px] relative shrink-0 w-[295px]" data-name="Container">
      <Input />
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p12824f00} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="content-stretch flex h-[20px] items-center overflow-clip relative shrink-0 w-[56.547px]" data-name="Primitive.span">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">All Types</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-[111.273px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative w-full">
        <Icon1 />
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex gap-[38.727px] h-[36px] items-center px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[200px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <Frame1 />
      <Icon2 />
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[59.141px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">All Status</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[180px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan1 />
      <Icon3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 top-0 w-[1034px]">
      <Container />
      <PrimitiveButton />
      <PrimitiveButton1 />
    </div>
  );
}

export default function FacilityManagement() {
  return (
    <div className="relative size-full" data-name="FacilityManagement">
      <Frame />
    </div>
  );
}