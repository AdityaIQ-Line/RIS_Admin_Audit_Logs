import svgPaths from "./svg-jlrm47a1k";
import { imgVector } from "./svg-noyte";

function Container1() {
  return <div className="absolute h-[764px] left-0 top-0 w-[48px]" data-name="Container" />;
}

function CardTitle() {
  return (
    <div className="h-[20px] relative shrink-0 w-[82.484px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Total Reports</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[43px] relative shrink-0 w-[243px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <CardTitle />
        <Icon />
      </div>
    </div>
  );
}

function ReportsList() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[0.5px]">6</p>
    </div>
  );
}

function CardContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-[1] content-stretch flex flex-col gap-[4px] h-[94px] items-start justify-self-stretch p-px relative rounded-[11.2px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardHeader />
      <CardContent />
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[99.586px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Average TAT</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_8037_2995)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_8037_2995">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="h-[43px] relative shrink-0 w-[243px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <CardTitle1 />
        <Icon1 />
      </div>
    </div>
  );
}

function ReportsList1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#e7000b] text-[16px] top-[0.5px]">287.0 hours</p>
    </div>
  );
}

function CardContent1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList1 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-[2] content-stretch flex flex-col gap-[4px] h-[94px] items-start justify-self-stretch p-px relative rounded-[11.2px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardHeader1 />
      <CardContent1 />
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[65.875px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Reports per Day</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M5.33333 1.33333V4" id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 1.33333V4" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3ee34580} id="Vector_3" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2 6.66667H14" id="Vector_4" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function CardHeader2() {
  return (
    <div className="h-[43px] relative shrink-0 w-[244px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <CardTitle2 />
        <Icon2 />
      </div>
    </div>
  );
}

function ReportsList2() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[0.5px]">30.9</p>
    </div>
  );
}

function CardContent2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList2 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-[3] content-stretch flex flex-col gap-[4px] h-[94px] items-start justify-self-stretch p-px relative rounded-[11.2px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardHeader2 />
      <CardContent2 />
    </div>
  );
}

function CardTitle3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[59.938px]" data-name="CardTitle">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Quality Score</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_8037_3879)" id="Icon">
          <path d={svgPaths.p15b9e680} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_8037_3879">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="h-[43px] relative shrink-0 w-[243px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <CardTitle3 />
        <Icon3 />
      </div>
    </div>
  );
}

function ReportsList3() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[16px] top-[0.5px]">21.3%</p>
    </div>
  );
}

function CardContent3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList3 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-[4] content-stretch flex flex-col gap-[4px] h-[94px] items-start justify-self-stretch p-px relative rounded-[11.2px] row-[1] shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardHeader3 />
      <CardContent3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(4,_minmax(0,_1fr))] grid-rows-[repeat(1,_fit-content(100%))] relative shrink-0 w-[1053px]" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.0005 14L11.1338 11.1333" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Icon4 />
      <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#737373] text-[14px]">{`Search `}</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[5.2px] top-0 w-[192px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[12px] pr-[20px] py-[4px] relative rounded-[inherit] size-full">
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[192px]" data-name="Container">
      <Input />
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="h-[20px] relative shrink-0 w-[82.477px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Modalities</p>
      </div>
    </div>
  );
}

function Icon5() {
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
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[135px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan />
      <Icon5 />
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[73.906px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Priorities</p>
      </div>
    </div>
  );
}

function Icon6() {
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
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[135px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan1 />
      <Icon6 />
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="h-[20px] relative shrink-0" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center overflow-clip relative rounded-[inherit]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Radiologists</p>
      </div>
    </div>
  );
}

function Icon7() {
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

function PrimitiveButton2() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[136px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan2 />
      <Icon7 />
    </div>
  );
}

function Upload01Filled() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="upload-01-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="upload-01-filled">
          <g id="fill">
            <path d={svgPaths.p136bdc00} fill="var(--fill-0, #334155)" />
            <path d={svgPaths.p3526070} fill="var(--fill-0, #334155)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Upload01Filled />
      <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-center">Export</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[960px] p-[10px] rounded-[5.2px] top-0 w-[93px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <Frame2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Container5 />
      <PrimitiveButton />
      <PrimitiveButton1 />
      <PrimitiveButton2 />
      <Button />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[134.5px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.pcaa3f40} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.3333 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p216cf1e0} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[32px] left-[-4px] rounded-[5.2px] top-[1.75px] w-[160.5px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[65.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Radiologist Name</p>
      <Icon8 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[174.148px]" data-name="Header Cell">
      <Button1 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[106.48px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.pcaa3f40} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.3333 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p216cf1e0} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[32px] left-[-4px] rounded-[5.2px] top-[1.75px] w-[132.484px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[51.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Total Reports</p>
      <Icon9 />
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute h-[36px] left-[174.15px] top-0 w-[144.492px]" data-name="Header Cell">
      <Button2 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[123.86px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.pcaa3f40} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.3333 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p216cf1e0} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[32px] left-[-4px] rounded-[5.2px] top-[1.75px] w-[149.859px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[60px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Avg TAT (hours)</p>
      <Icon10 />
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute h-[36px] left-[318.64px] top-0 w-[162.883px]" data-name="Header Cell">
      <Button3 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[101.81px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d={svgPaths.pcaa3f40} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M11.3333 13.3333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p216cf1e0} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.66667 2.66667V13.3333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[32px] left-[-4px] rounded-[5.2px] top-[1.75px] w-[127.813px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Reports/Day</p>
      <Icon11 />
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute h-[36px] left-[481.52px] top-0 w-[139.547px]" data-name="Header Cell">
      <Button4 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[32px] left-[-4px] rounded-[5.2px] top-[1.75px] w-[159.703px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[36.43px] not-italic text-[#0a0a0a] text-[14px] text-center top-[5.75px]">Modality</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute h-[36px] left-[621.07px] top-0 w-[173.305px]" data-name="Header Cell">
      <Button5 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-[136.82px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 3.33333V12.6667" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc0e6f00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[32px] left-[-4px] rounded-[5.2px] top-[1.75px] w-[162.82px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[66.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Revision Rate (%)</p>
      <Icon12 />
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute h-[36px] left-[794.38px] top-0 w-[176.625px]" data-name="Header Cell">
      <Button6 />
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute h-[36px] left-[971px] top-0 w-[80px]" data-name="Header Cell">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[7.75px]">Actions</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[36px] left-0 top-0 w-[1051px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[1051px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[41px] left-0 top-0 w-[174.148px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">Dr. Michael Chen</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[41px] left-[174.15px] top-0 w-[144.492px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">284</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[41px] left-[318.64px] top-0 w-[162.883px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">12.3</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[41px] left-[481.52px] top-0 w-[139.547px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">21.4</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[41px] left-[621.07px] top-0 w-[173.305px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">CT</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[41px] left-[794.38px] top-0 w-[176.625px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">9.4%</p>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[32px] left-[8px] rounded-[5.2px] top-[4.5px] w-[36px]" data-name="Button">
      <Icon13 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[41px] left-[971px] top-0 w-[80px]" data-name="Table Cell">
      <Button7 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[41px] left-0 top-0 w-[1051px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[41px] left-0 top-0 w-[174.148px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">Dr. Emily Williams</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[41px] left-[174.15px] top-0 w-[144.492px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">252</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[41px] left-[318.64px] top-0 w-[162.883px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">12.0</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[41px] left-[481.52px] top-0 w-[139.547px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">20.5</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[41px] left-[621.07px] top-0 w-[173.305px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">X-RAY</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[41px] left-[794.38px] top-0 w-[176.625px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">8.2%</p>
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[32px] left-[8px] rounded-[5.2px] top-[4.5px] w-[36px]" data-name="Button">
      <Icon14 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[41px] left-[971px] top-0 w-[80px]" data-name="Table Cell">
      <Button8 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[41px] left-0 top-[41px] w-[1051px]" data-name="Table Row">
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[41px] left-0 top-0 w-[174.148px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">Dr. Maria Garcia</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[41px] left-[174.15px] top-0 w-[144.492px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">230</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[41px] left-[318.64px] top-0 w-[162.883px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">35.4</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[41px] left-[481.52px] top-0 w-[139.547px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">13.6</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[41px] left-[621.07px] top-0 w-[173.305px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">MRI</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[41px] left-[794.38px] top-0 w-[176.625px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">7.4%</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[32px] left-[8px] rounded-[5.2px] top-[4.5px] w-[36px]" data-name="Button">
      <Icon15 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[41px] left-[971px] top-0 w-[80px]" data-name="Table Cell">
      <Button9 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[41px] left-0 top-[82px] w-[1051px]" data-name="Table Row">
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[41px] left-0 top-0 w-[174.148px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">Dr. Sarah Johnson</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[41px] left-[174.15px] top-0 w-[144.492px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">255</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[41px] left-[318.64px] top-0 w-[162.883px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">12.8</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[41px] left-[481.52px] top-0 w-[139.547px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">22.7</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[41px] left-[621.07px] top-0 w-[173.305px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">Ultrasound</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[41px] left-[794.38px] top-0 w-[176.625px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">6.9%</p>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[32px] left-[8px] rounded-[5.2px] top-[4.5px] w-[36px]" data-name="Button">
      <Icon16 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[41px] left-[971px] top-0 w-[80px]" data-name="Table Cell">
      <Button10 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[41px] left-0 top-[123px] w-[1051px]" data-name="Table Row">
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[41px] left-0 top-0 w-[174.148px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">Dr. James Anderson</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[41px] left-[174.15px] top-0 w-[144.492px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">234</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[41px] left-[318.64px] top-0 w-[162.883px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">26.0</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[41px] left-[481.52px] top-0 w-[139.547px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">16.7</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[41px] left-[621.07px] top-0 w-[173.305px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">CT</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[41px] left-[794.38px] top-0 w-[176.625px]" data-name="Table Cell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[10.5px]">6.9%</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pad05c0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[32px] left-[8px] rounded-[5.2px] top-[4.5px] w-[36px]" data-name="Button">
      <Icon17 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[41px] left-[971px] top-0 w-[80px]" data-name="Table Cell">
      <Button11 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[41px] left-0 top-[164px] w-[1051px]" data-name="Table Row">
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[205px] left-0 top-[36px] w-[1051px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
    </div>
  );
}

function Table() {
  return (
    <div className="h-[241.5px] overflow-clip relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[243.5px] relative rounded-[5.2px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="content-stretch flex flex-col items-start p-px relative size-full">
        <Table />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[287.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame1 />
      <Container6 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[24px] top-[113px] w-[1053px]">
      <Container2 />
      <Container4 />
    </div>
  );
}

function Icon18() {
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

function Button12() {
  return (
    <div className="relative rounded-[5.2px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon18 />
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

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-center relative shrink-0 w-[341.414px]" data-name="Container">
      <Button12 />
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

function Frame4() {
  return (
    <div className="relative shrink-0 w-[1068px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative w-full">
        <Container8 />
        <DateRange />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-white content-stretch flex h-[48px] items-center justify-between left-0 pb-px px-[24px] top-[41px] w-[1116px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <Frame4 />
    </div>
  );
}

function Link() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#737373] text-[14px] top-0">Home</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-0 top-0 w-[37.352px]" data-name="List Item">
      <Link />
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="absolute left-[47.35px] size-[14px] top-[3px]" data-name="List Item">
      <Icon19 />
    </div>
  );
}

function Link1() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#737373] text-[14px] top-0">Admin</p>
      </div>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[71.35px] top-0 w-[39.688px]" data-name="List Item">
      <Link1 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="absolute left-[121.04px] size-[14px] top-[3px]" data-name="List Item">
      <Icon20 />
    </div>
  );
}

function Link2() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#737373] text-[14px] top-0">Analytics</p>
      </div>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[145.04px] top-0 w-[56.023px]" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-0 size-[14px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="absolute left-[211.06px] size-[14px] top-[3px]" data-name="List Item">
      <Icon21 />
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Radiologist Performance</p>
      </div>
    </div>
  );
}

function ListItem6() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[235.06px] top-0 w-[153.297px]" data-name="List Item">
      <Text />
    </div>
  );
}

function NumberedList() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Numbered List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <ListItem />
        <ListItem1 />
        <ListItem2 />
        <ListItem3 />
        <ListItem4 />
        <ListItem5 />
        <ListItem6 />
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="h-[20px] relative shrink-0 w-[388.359px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <NumberedList />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Navigation />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return <div className="absolute bg-[#e5e5e5] h-0 left-[44px] top-[18px] w-px" data-name="Primitive.div" />;
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_8037_5445)" id="Icon">
          <path d={svgPaths.p3adb3b00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 1.33333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 13.3333V14.6667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p11bc9dc0} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p191ca260} id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H2.66667" id="Vector_6" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 8H14.6667" id="Vector_7" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pe73b76f} id="Vector_8" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1df25380} id="Vector_9" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_8037_5445">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[53px] rounded-[5.2px] size-[36px] top-0" data-name="Button">
      <Icon22 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[#e5e5e5] h-0 left-[97px] top-[18px] w-px" data-name="Primitive.div" />;
}

function Text1() {
  return (
    <div className="absolute h-[20px] left-[44px] overflow-clip top-[8px] w-[73.914px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[37px] not-italic text-[#0a0a0a] text-[14px] text-center top-0">James Park</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[71.32%_27.14%_0_27.14%]" data-name="Group">
      <div className="absolute inset-[71.32%_27.14%_0_27.14%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-7.6px_-199.69px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8 80.31">
          <path d={svgPaths.p1c804300} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[88.57%_30%_7.86%_30%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-8.399px_-248px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.2 10">
          <path d={svgPaths.p6241980} fill="var(--fill-0, #F4F4F4)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[51.79%_42.86%_36.43%_42.85%]" data-name="Group">
      <div className="absolute inset-[51.79%_42.86%_40.71%_42.85%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-11.998px_-145px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.00215 21">
          <path clipRule="evenodd" d={svgPaths.p29d3c880} fill="var(--fill-0, black)" fillOpacity="0.7" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[51.79%_45.05%_46.43%_45.22%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-12.662px_-145px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.724 5">
          <path d={svgPaths.p82bbd40} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[56.79%_43.57%_36.43%_43.57%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-12.2px_-159px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.6 19">
          <path d={svgPaths.p11626c40} fill="var(--fill-0, #7BB24B)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[56.79%_43.57%_36.79%_43.57%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-12.2px_-159px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.6 18">
          <path d={svgPaths.p1c39ee00} fill="var(--fill-0, #88C553)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[46.43%_45.71%_50.71%_45.71%]" data-name="Group">
      <div className="absolute inset-[46.43%_45.71%_50.71%_45.71%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-12.8px_-130px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.4 8">
          <path clipRule="evenodd" d={svgPaths.p1c4ec00} fill="var(--fill-0, black)" fillOpacity="0.16" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[37.86%_35.71%_57.14%_35.71%]" data-name="Group">
      <div className="absolute inset-[37.86%_35.71%_57.14%_35.71%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-10px_-106px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.00005 14.0017">
          <path d={svgPaths.p3bb54370} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[30.2%_34.24%_62.8%_34.27%]" data-name="Group">
      <div className="absolute inset-[30.2%_34.24%_62.8%_34.27%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-9.596px_-84.571px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.81566 19.5858">
          <path d={svgPaths.p1dc81900} fill="var(--fill-0, black)" fillOpacity="0.6" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[3.57%_11.42%_28.88%_11.43%]" data-name="Group">
      <div className="absolute inset-[9.29%_26.43%_62.49%_26.43%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-7.4px_-26px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2 79.0408">
          <path d={svgPaths.p39b880c0} fill="var(--fill-0, black)" fillOpacity="0.16" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[3.57%_11.42%_28.88%_11.43%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-3.2px_-10.006px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.6022 189.145">
          <path d={svgPaths.p39043e80} fill="var(--fill-0, #F59797)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[3.57%_11.42%_0_11.43%]" data-name="Group">
      <div className="absolute inset-[12.86%_14.29%_0_14.29%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-4px_-36px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 244.01">
          <path d={svgPaths.p90e22b0} fill="var(--fill-0, #AE5D29)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[64.5%_41.43%_30.71%_41.43%] mask-intersect mask-luminance mask-no-clip mask-no-repeat mask-position-[-11.6px_-180.61px] mask-size-[2.8px_28px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.8 13.3901">
          <path d={svgPaths.p3a3d6900} fill="var(--fill-0, black)" fillOpacity="0.1" id="Vector" />
        </svg>
      </div>
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[3.57%_11.42%_0_11.43%]" data-name="Group">
      <Group1 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-[0_90%_90%_0]" data-name="Mask group">
      <Group />
    </div>
  );
}

function PrimitiveImg() {
  return (
    <div className="flex-[1_0_0] h-[280px] min-h-px min-w-px relative" data-name="Primitive.img">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <MaskGroup />
      </div>
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="absolute content-stretch flex items-start left-[8px] overflow-clip rounded-[16777200px] size-[28px] top-[4px]" data-name="Primitive.span">
      <PrimitiveImg />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[36px] left-[106px] rounded-[5.2px] top-0 w-[125.914px]" data-name="Button">
      <Text1 />
      <PrimitiveSpan3 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute bg-[#df2225] left-[24px] rounded-[5.2px] size-[16px] top-[-4px]" data-name="Text">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[14.286px] not-italic relative shrink-0 text-[10px] text-center text-white">3</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute left-0 rounded-[5.2px] size-[36px] top-0" data-name="Button">
      <Icon23 />
      <Text2 />
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[36px] relative shrink-0 w-[231.914px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PrimitiveDiv />
        <Button13 />
        <PrimitiveDiv1 />
        <Button14 />
        <Button15 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] content-stretch flex flex-col h-[41px] items-start left-0 pb-px top-0 w-[1116px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <Container9 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute bg-white h-[766px] left-[48px] overflow-clip top-0 w-[1116px]" data-name="Main Content">
      <Frame3 />
      <Container7 />
      <Header />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] h-[766px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container1 />
        <MainContent />
      </div>
    </div>
  );
}

function Pq() {
  return (
    <div className="absolute bg-white content-stretch flex h-[766px] items-start left-0 top-0 w-[1164px]" data-name="pq">
      <Container />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[18px] left-0 top-[-20000px] w-[20.023px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#0a0a0a] text-[12px] top-0">140</p>
    </div>
  );
}

function SvgLogo() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SvgLogo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g clipPath="url(#clip0_8037_3967)" id="SvgLogo">
          <path d={svgPaths.pb4f5570} fill="var(--fill-0, #4A4C60)" id="Vector" />
          <path d={svgPaths.p159b4380} fill="var(--fill-0, #4A4C60)" id="Vector_2" />
          <path d={svgPaths.p2870ff80} fill="var(--fill-0, #3AA9A0)" id="Vector_3" />
          <path d={svgPaths.p28e40600} fill="var(--fill-0, #3AA9A0)" id="Vector_4" />
          <path d={svgPaths.p1efc7df2} fill="var(--fill-0, #2E8981)" id="Vector_5" />
        </g>
        <defs>
          <clipPath id="clip0_8037_3967">
            <rect fill="white" height="28" width="28" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 rounded-[5.2px] size-[32px] top-0" data-name="Container">
      <SvgLogo />
    </div>
  );
}

function ListItem7() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[31px]" data-name="List Item">
      <Container15 />
    </div>
  );
}

function List() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[31px]" data-name="List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <ListItem7 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[48px] relative shrink-0 w-[47px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[8px] py-[8px] relative size-full">
        <List />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Home</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon24 />
      <Text4 />
    </div>
  );
}

function ListItem8() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[31px]" data-name="List Item">
      <Link3 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p368df400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3a53aa80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 7.33333H10.6667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H10.6667" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 7.33333H5.34" id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 10.6667H5.34" id="Vector_6" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Imaging Worklist</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon25 />
      <Text5 />
    </div>
  );
}

function ListItem9() {
  return (
    <div className="absolute h-[32px] left-0 top-[36px] w-[31px]" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">User Management</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon26 />
      <Text6 />
    </div>
  );
}

function ListItem10() {
  return (
    <div className="absolute h-[32px] left-0 top-[72px] w-[31px]" data-name="List Item">
      <Link5 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_8037_2812)" id="Icon">
          <path d={svgPaths.pda21400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1be36900} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa8d100} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 4H9.33333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6.66667H9.33333" id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 9.33333H9.33333" id="Vector_6" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 12H9.33333" id="Vector_7" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_8037_2812">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Facility Details</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon27 />
      <Text7 />
    </div>
  );
}

function ListItem11() {
  return (
    <div className="absolute h-[32px] left-0 top-[108px] w-[31px]" data-name="List Item">
      <Link6 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p90824c0} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12 11.3333V6" id="Vector_2" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8.66667 11.3333V3.33333" id="Vector_3" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 11.3333V9.33333" id="Vector_4" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#171717] text-[14px] top-0">{`Analyzing & Monitoring`}</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute bg-[#f5f5f5] content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon28 />
      <Text8 />
    </div>
  );
}

function ListItem12() {
  return (
    <div className="absolute h-[32px] left-0 top-[144px] w-[31px]" data-name="List Item">
      <Link7 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_8037_3612)" id="Icon">
          <path d={svgPaths.p3227a460} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_8037_3612">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Audit Logs</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon29 />
      <Text9 />
    </div>
  );
}

function ListItem13() {
  return (
    <div className="absolute h-[32px] left-0 top-[180px] w-[31px]" data-name="List Item">
      <Link8 />
    </div>
  );
}

function List1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[31px]" data-name="List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <ListItem8 />
        <ListItem9 />
        <ListItem10 />
        <ListItem11 />
        <ListItem12 />
        <ListItem13 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col h-[228px] items-start left-0 pl-[8px] py-[8px] top-0 w-[47px]" data-name="Container">
      <List1 />
    </div>
  );
}

function Container16() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[47px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container17 />
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p37f49070} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">James Park</p>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[16px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Admin</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text10 />
        <Text11 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-center pr-[-8px] relative shrink-0 w-full" data-name="Container">
      <Icon30 />
      <Container22 />
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[5.2px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] px-[8px] relative size-full">
        <Container21 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex items-center left-0 overflow-clip rounded-[5.2px] size-[32px] top-0" data-name="Container">
      <Container20 />
    </div>
  );
}

function ListItem14() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[31px]" data-name="List Item">
      <Container19 />
    </div>
  );
}

function List2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[31px]" data-name="List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <ListItem14 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[48px] relative shrink-0 w-[47px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[8px] py-[8px] relative size-full">
        <List2 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex flex-col h-[764px] items-start left-0 top-0 w-[47px]" data-name="Container">
      <Container14 />
      <Container16 />
      <Container18 />
    </div>
  );
}

function Button16() {
  return <div className="absolute h-[764px] left-[39px] top-0 w-[16px]" data-name="Button" />;
}

function Container12() {
  return (
    <div className="absolute border-[#e5e5e5] border-r border-solid h-[764px] left-0 top-0 w-[48px]" data-name="Container">
      <Container13 />
      <Button16 />
    </div>
  );
}

export default function RadiologyV2Admin() {
  return (
    <div className="bg-white relative size-full" data-name="Radiology V2 (Admin)">
      <Pq />
      <Text3 />
      <Container12 />
    </div>
  );
}