import svgPaths from "./svg-tepb76eu8b";
import imgPrimitiveImg from "figma:asset/16339439ebd5ccb4ec0198e5cb47e3241b211fbd.png";

function Sidebar() {
  return <div className="absolute h-[764px] left-0 top-0 w-[48px]" data-name="Sidebar" />;
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
    <div className="h-[52px] relative shrink-0 w-[243.25px]" data-name="CardHeader">
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
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px]">6</p>
    </div>
  );
}

function ReportsList1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Finalized reports</p>
    </div>
  );
}

function CardContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList />
        <ReportsList1 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-[1] content-stretch flex flex-col gap-[24px] items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
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
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Critical Findings</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6126_1361)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1361">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CardHeader1() {
  return (
    <div className="h-[52px] relative shrink-0 w-[243.25px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <CardTitle1 />
        <Icon1 />
      </div>
    </div>
  );
}

function ReportsList2() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#e7000b] text-[24px] top-[0.5px]">2</p>
    </div>
  );
}

function ReportsList3() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Require urgent attention</p>
    </div>
  );
}

function CardContent1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList2 />
        <ReportsList3 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-[2] content-stretch flex flex-col gap-[24px] items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
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
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">This Week</p>
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
    <div className="h-[52px] relative shrink-0 w-[243.25px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <CardTitle2 />
        <Icon2 />
      </div>
    </div>
  );
}

function ReportsList4() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px]">6</p>
    </div>
  );
}

function ReportsList5() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Recent reports</p>
    </div>
  );
}

function CardContent2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList4 />
        <ReportsList5 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-[3] content-stretch flex flex-col gap-[24px] items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
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
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Amended</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6126_1326)" id="Icon">
          <path d={svgPaths.p15b9e680} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f2c5400} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1326">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function CardHeader3() {
  return (
    <div className="h-[52px] relative shrink-0 w-[243.25px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] relative size-full">
        <CardTitle3 />
        <Icon3 />
      </div>
    </div>
  );
}

function ReportsList6() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px]">1</p>
    </div>
  );
}

function ReportsList7() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Updated reports</p>
    </div>
  );
}

function CardContent3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] relative size-full">
        <ReportsList6 />
        <ReportsList7 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-[4] content-stretch flex flex-col gap-[24px] items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardHeader3 />
      <CardContent3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(4,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[150px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
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

function Container2() {
  return (
    <div className="h-[36px] relative shrink-0 w-[192px]" data-name="Container">
      <Input />
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="h-[20px] relative shrink-0 w-[73.93px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Status</p>
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
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[136px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan />
      <Icon5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M13.3333 4.66667H7.33333" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M9.33333 11.3333H3.33333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2badb400} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p79fe00} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Icon6 />
      <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#0a0a0a] text-[12px] text-center">Columns</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[1211px] p-[10px] rounded-[5.2px] top-0 w-[93px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <Frame2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Container2 />
      <PrimitiveButton />
      <Button />
    </div>
  );
}

function TableHead() {
  return (
    <div className="absolute h-[48px] left-0 top-0 w-[167.586px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[13.75px]">Patient</p>
    </div>
  );
}

function TableHead1() {
  return (
    <div className="absolute h-[48px] left-[167.59px] top-0 w-[259.531px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[13.75px]">Study</p>
    </div>
  );
}

function TableHead2() {
  return (
    <div className="absolute h-[48px] left-[427.12px] top-0 w-[111.617px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[13.75px]">Report Date</p>
    </div>
  );
}

function TableHead3() {
  return (
    <div className="absolute h-[48px] left-[538.73px] top-0 w-[139.961px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[13.75px]">Radiologist</p>
    </div>
  );
}

function TableHead4() {
  return (
    <div className="absolute h-[48px] left-[678.7px] top-0 w-[83.367px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[13.75px]">Priority</p>
    </div>
  );
}

function TableHead5() {
  return (
    <div className="absolute h-[48px] left-[762.06px] top-0 w-[93.375px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[13.75px]">Status</p>
    </div>
  );
}

function TableHead6() {
  return (
    <div className="absolute h-[48px] left-[855.44px] top-0 w-[148.094px]" data-name="TableHead">
      <p className="-translate-x-full absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[136.75px] not-italic text-[#0a0a0a] text-[14px] text-right top-[13.75px]">Actions</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[48px] left-0 top-0 w-[1003.531px]" data-name="TableRow">
      <TableHead />
      <TableHead1 />
      <TableHead2 />
      <TableHead3 />
      <TableHead4 />
      <TableHead5 />
      <TableHead6 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[48px] left-0 top-0 w-[1053px]" data-name="TableHeader">
      <TableRow />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6126_1361)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1361">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Sarah Johnson</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[117px] whitespace-pre-wrap">UHID-45678 • 45Y • F</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[36px] relative shrink-0 w-[116.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function ReportsList9() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-center left-[12px] top-[12.5px] w-[143.586px]" data-name="ReportsList">
      <Icon7 />
      <Container3 />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[167.586px]" data-name="TableCell">
      <ReportsList9 />
    </div>
  );
}

function ReportsList10() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">CT Chest with Contrast</p>
    </div>
  );
}

function ReportsList11() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[107px] whitespace-pre-wrap">CT • ACC-2024-001</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[61px] left-[167.59px] top-0 w-[259.531px]" data-name="TableCell">
      <ReportsList10 />
      <ReportsList11 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function ReportsList12() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[87.617px]" data-name="ReportsList">
      <Icon8 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">2024-01-13</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_6126_1366)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1366">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ReportsList13() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[87.617px]" data-name="ReportsList">
      <Icon9 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[16px] not-italic text-[#737373] text-[12px] top-0">14:30</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[61px] left-[427.12px] top-0 w-[111.617px]" data-name="TableCell">
      <ReportsList12 />
      <ReportsList13 />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[61px] left-[538.73px] top-0 w-[139.961px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[20.5px]">Dr. Sarah Johnson</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#e7000b] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[46.891px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">STAT</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[61px] left-[678.7px] top-0 w-[83.367px]" data-name="TableCell">
      <Badge />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[#00a63e] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[66.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Finalized</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[61px] left-[762.06px] top-0 w-[93.375px]" data-name="TableCell">
      <Badge1 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[78.094px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon10 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[38px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function ReportsList14() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[12px] top-[14.5px] w-[124.094px]" data-name="ReportsList">
      <Button1 />
      <Button2 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[61px] left-[855.44px] top-0 w-[148.094px]" data-name="TableCell">
      <ReportsList14 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute bg-[#fef2f2] border-[#e5e5e5] border-b border-solid h-[61px] left-[-0.5px] top-0 w-[1053px]" data-name="TableRow">
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

function Container7() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Robert Martinez</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[120px] whitespace-pre-wrap">UHID-45679 • 62Y • M</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[36px] relative shrink-0 w-[119.586px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

function ReportsList15() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-center left-[12px] top-[12.5px] w-[143.586px]" data-name="ReportsList">
      <Container6 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[167.586px]" data-name="TableCell">
      <ReportsList15 />
    </div>
  );
}

function ReportsList16() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">MRI Brain without Contrast</p>
    </div>
  );
}

function ReportsList17() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[113px] whitespace-pre-wrap">MRI • ACC-2024-002</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[61px] left-[167.59px] top-0 w-[259.531px]" data-name="TableCell">
      <ReportsList16 />
      <ReportsList17 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function ReportsList18() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[87.617px]" data-name="ReportsList">
      <Icon12 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">2024-01-13</p>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_6126_1366)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1366">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ReportsList19() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[87.617px]" data-name="ReportsList">
      <Icon13 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[16px] not-italic text-[#737373] text-[12px] top-0">16:45</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[61px] left-[427.12px] top-0 w-[111.617px]" data-name="TableCell">
      <ReportsList18 />
      <ReportsList19 />
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[61px] left-[538.73px] top-0 w-[139.961px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[20.5px]">Dr. Emily Wong</p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[#f4f4f5] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[59.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#18181b] text-[12px] top-[2px]">Routine</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[61px] left-[678.7px] top-0 w-[83.367px]" data-name="TableCell">
      <Badge2 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[#00a63e] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[66.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Finalized</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[61px] left-[762.06px] top-0 w-[93.375px]" data-name="TableCell">
      <Badge3 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[78.094px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon14 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[38px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function ReportsList20() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[12px] top-[14.5px] w-[124.094px]" data-name="ReportsList">
      <Button3 />
      <Button4 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[61px] left-[855.44px] top-0 w-[148.094px]" data-name="TableCell">
      <ReportsList20 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[61px] left-0 top-[61px] w-[1053px]" data-name="TableRow">
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

function Container10() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Linda Anderson</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[117px] whitespace-pre-wrap">UHID-45680 • 38Y • F</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[36px] relative shrink-0 w-[116.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container10 />
        <Container11 />
      </div>
    </div>
  );
}

function ReportsList21() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-center left-[12px] top-[12.5px] w-[143.586px]" data-name="ReportsList">
      <Container9 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[167.586px]" data-name="TableCell">
      <ReportsList21 />
    </div>
  );
}

function ReportsList22() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">{`Chest X-Ray PA & Lateral`}</p>
    </div>
  );
}

function ReportsList23() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[124px] whitespace-pre-wrap">X-Ray • ACC-2024-003</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[61px] left-[167.59px] top-0 w-[259.531px]" data-name="TableCell">
      <ReportsList22 />
      <ReportsList23 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function ReportsList24() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[87.617px]" data-name="ReportsList">
      <Icon16 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">2024-01-13</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_6126_1366)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1366">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ReportsList25() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[87.617px]" data-name="ReportsList">
      <Icon17 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[16px] not-italic text-[#737373] text-[12px] top-0">15:20</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[61px] left-[427.12px] top-0 w-[111.617px]" data-name="TableCell">
      <ReportsList24 />
      <ReportsList25 />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[61px] left-[538.73px] top-0 w-[139.961px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[20.5px]">Dr. Michael Chen</p>
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[#f4f4f5] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[59.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#18181b] text-[12px] top-[2px]">Routine</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[61px] left-[678.7px] top-0 w-[83.367px]" data-name="TableCell">
      <Badge4 />
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[#00a63e] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[66.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Finalized</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[61px] left-[762.06px] top-0 w-[93.375px]" data-name="TableCell">
      <Badge5 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[78.094px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon18 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[38px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function ReportsList26() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[12px] top-[14.5px] w-[124.094px]" data-name="ReportsList">
      <Button5 />
      <Button6 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[61px] left-[855.44px] top-0 w-[148.094px]" data-name="TableCell">
      <ReportsList26 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[61px] left-0 top-[122px] w-[1053px]" data-name="TableRow">
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

function Icon20() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6126_1361)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1361">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">James Wilson</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[120px] whitespace-pre-wrap">UHID-45682 • 58Y • M</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function ReportsList27() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-center left-[12px] top-[12.5px] w-[143.586px]" data-name="ReportsList">
      <Icon20 />
      <Container12 />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[167.586px]" data-name="TableCell">
      <ReportsList27 />
    </div>
  );
}

function ReportsList28() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">CT Abdomen and Pelvis with Contrast</p>
    </div>
  );
}

function ReportsList29() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[107px] whitespace-pre-wrap">CT • ACC-2024-004</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[61px] left-[167.59px] top-0 w-[259.531px]" data-name="TableCell">
      <ReportsList28 />
      <ReportsList29 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function ReportsList30() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[87.617px]" data-name="ReportsList">
      <Icon21 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">2024-01-12</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_6126_1366)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1366">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ReportsList31() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[87.617px]" data-name="ReportsList">
      <Icon22 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[16px] not-italic text-[#737373] text-[12px] top-0">18:15</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[61px] left-[427.12px] top-0 w-[111.617px]" data-name="TableCell">
      <ReportsList30 />
      <ReportsList31 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[61px] left-[538.73px] top-0 w-[139.961px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[20.5px]">Dr. David Kumar</p>
    </div>
  );
}

function Badge6() {
  return (
    <div className="absolute bg-[#df2225] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[54.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Urgent</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[61px] left-[678.7px] top-0 w-[83.367px]" data-name="TableCell">
      <Badge6 />
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[#00a63e] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[66.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Finalized</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[61px] left-[762.06px] top-0 w-[93.375px]" data-name="TableCell">
      <Badge7 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[78.094px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon23 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[38px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function ReportsList32() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[12px] top-[14.5px] w-[124.094px]" data-name="ReportsList">
      <Button7 />
      <Button8 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[61px] left-[855.44px] top-0 w-[148.094px]" data-name="TableCell">
      <ReportsList32 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute bg-[#fef2f2] border-[#e5e5e5] border-b border-solid h-[61px] left-0 top-[183px] w-[1053px]" data-name="TableRow">
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

function Container16() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Maria Garcia</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[117px] whitespace-pre-wrap">UHID-45683 • 72Y • F</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[36px] relative shrink-0 w-[116.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function ReportsList33() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-center left-[12px] top-[12.5px] w-[143.586px]" data-name="ReportsList">
      <Container15 />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[167.586px]" data-name="TableCell">
      <ReportsList33 />
    </div>
  );
}

function ReportsList34() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Left Hip X-Ray</p>
    </div>
  );
}

function ReportsList35() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[124px] whitespace-pre-wrap">X-Ray • ACC-2024-005</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[61px] left-[167.59px] top-0 w-[259.531px]" data-name="TableCell">
      <ReportsList34 />
      <ReportsList35 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function ReportsList36() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[87.617px]" data-name="ReportsList">
      <Icon25 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">2024-01-11</p>
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_6126_1366)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1366">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ReportsList37() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[87.617px]" data-name="ReportsList">
      <Icon26 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[16px] not-italic text-[#737373] text-[12px] top-0">13:45</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[61px] left-[427.12px] top-0 w-[111.617px]" data-name="TableCell">
      <ReportsList36 />
      <ReportsList37 />
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[61px] left-[538.73px] top-0 w-[139.961px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[20.5px]">Dr. Sarah Johnson</p>
    </div>
  );
}

function Badge8() {
  return (
    <div className="absolute bg-[#f4f4f5] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[59.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#18181b] text-[12px] top-[2px]">Routine</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[61px] left-[678.7px] top-0 w-[83.367px]" data-name="TableCell">
      <Badge8 />
    </div>
  );
}

function Badge9() {
  return (
    <div className="absolute bg-[#00a63e] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[66.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Finalized</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[61px] left-[762.06px] top-0 w-[93.375px]" data-name="TableCell">
      <Badge9 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[78.094px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon27 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[38px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon28 />
      </div>
    </div>
  );
}

function ReportsList38() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[12px] top-[14.5px] w-[124.094px]" data-name="ReportsList">
      <Button9 />
      <Button10 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[61px] left-[855.44px] top-0 w-[148.094px]" data-name="TableCell">
      <ReportsList38 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[61px] left-0 top-[244px] w-[1053px]" data-name="TableRow">
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

function Container19() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">John Davis</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[120px] whitespace-pre-wrap">UHID-45684 • 41Y • M</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[36px] relative shrink-0 w-[119.586px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container19 />
        <Container20 />
      </div>
    </div>
  );
}

function ReportsList39() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-center left-[12px] top-[12.5px] w-[143.586px]" data-name="ReportsList">
      <Container18 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[61px] left-0 top-0 w-[167.586px]" data-name="TableCell">
      <ReportsList39 />
    </div>
  );
}

function ReportsList40() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">MRI Lumbar Spine without Contrast</p>
    </div>
  );
}

function ReportsList41() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[235.531px]" data-name="ReportsList">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[113px] whitespace-pre-wrap">MRI • ACC-2024-006</p>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[61px] left-[167.59px] top-0 w-[259.531px]" data-name="TableCell">
      <ReportsList40 />
      <ReportsList41 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M4 1V3" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 1V3" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p333d5300} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 5H10.5" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function ReportsList42() {
  return (
    <div className="absolute h-[20px] left-[12px] top-[12.5px] w-[87.617px]" data-name="ReportsList">
      <Icon29 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">2024-01-10</p>
    </div>
  );
}

function Icon30() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_6126_1366)" id="Icon">
          <path d={svgPaths.p3e7757b0} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 3V6L8 7" id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_6126_1366">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ReportsList43() {
  return (
    <div className="absolute h-[16px] left-[12px] top-[32.5px] w-[87.617px]" data-name="ReportsList">
      <Icon30 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[16px] not-italic text-[#737373] text-[12px] top-0">19:30</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[61px] left-[427.12px] top-0 w-[111.617px]" data-name="TableCell">
      <ReportsList42 />
      <ReportsList43 />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[61px] left-[538.73px] top-0 w-[139.961px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[12px] not-italic text-[#0a0a0a] text-[14px] top-[20.5px]">Dr. Emily Wong</p>
    </div>
  );
}

function Badge10() {
  return (
    <div className="absolute bg-[#f4f4f5] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[59.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#18181b] text-[12px] top-[2px]">Routine</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[61px] left-[678.7px] top-0 w-[83.367px]" data-name="TableCell">
      <Badge10 />
    </div>
  );
}

function Badge11() {
  return (
    <div className="absolute bg-[#155dfc] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[12px] overflow-clip rounded-[5.2px] top-[19.5px] w-[69.375px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Amended</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[61px] left-[762.06px] top-0 w-[93.375px]" data-name="TableCell">
      <Badge11 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[78.094px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon31 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19411800} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10V2" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[38px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function ReportsList44() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[12px] top-[14.5px] w-[124.094px]" data-name="ReportsList">
      <Button11 />
      <Button12 />
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[61px] left-[855.44px] top-0 w-[148.094px]" data-name="TableCell">
      <ReportsList44 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[61px] left-0 top-[305px] w-[1053px]" data-name="TableRow">
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[366px] left-0 top-[48px] w-[1053px]" data-name="TableBody">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
    </div>
  );
}

function Table1() {
  return (
    <div className="h-[414.5px] relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col h-[429.5px] items-start overflow-clip pl-[-2.5px] pr-[-0.031px] relative shrink-0 w-full" data-name="Table">
      <Table1 />
    </div>
  );
}

function ReportsList8() {
  return (
    <div className="h-[432px] relative rounded-[5.2px] shrink-0 w-full" data-name="ReportsList">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="content-stretch flex flex-col items-start p-px relative size-full">
        <Table />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame1 />
      <ReportsList8 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Container1 />
      <Frame3 />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[1029.5px] relative shrink-0 w-[1101px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[32px] px-[24px] relative size-full">
        <Frame5 />
      </div>
    </div>
  );
}

function PageShell() {
  return (
    <div className="absolute content-stretch flex flex-col h-[723px] items-start left-0 pt-[56px] top-0 w-[1116px]" data-name="PageShell">
      <Container />
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.5px]">Radiology Reports</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[28px] relative shrink-0 w-[160.016px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="bg-white h-[56px] relative shrink-0 w-full" data-name="PageHeader">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px pl-[24px] pr-[931.984px] relative size-full">
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[1116px]">
      <PageHeader />
    </div>
  );
}

function AppShell1() {
  return (
    <div className="absolute h-[723px] left-0 overflow-clip top-[41px] w-[1116px]" data-name="AppShell">
      <PageShell />
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

function BreadcrumbItem() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-0 top-0 w-[37.352px]" data-name="BreadcrumbItem">
      <Link />
    </div>
  );
}

function Icon33() {
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

function BreadcrumbSeparator() {
  return (
    <div className="absolute left-[47.35px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
      <Icon33 />
    </div>
  );
}

function Link1() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#737373] text-[14px] top-0">Physician</p>
      </div>
    </div>
  );
}

function BreadcrumbItem1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[71.35px] top-0 w-[59.922px]" data-name="BreadcrumbItem">
      <Link1 />
    </div>
  );
}

function Icon34() {
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

function BreadcrumbSeparator1() {
  return (
    <div className="absolute left-[141.27px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
      <Icon34 />
    </div>
  );
}

function BreadcrumbPage() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="BreadcrumbPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Reports</p>
      </div>
    </div>
  );
}

function BreadcrumbItem2() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[165.27px] top-0 w-[49.023px]" data-name="BreadcrumbItem">
      <BreadcrumbPage />
    </div>
  );
}

function BreadcrumbList() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="BreadcrumbList">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <BreadcrumbItem />
        <BreadcrumbSeparator />
        <BreadcrumbItem1 />
        <BreadcrumbSeparator1 />
        <BreadcrumbItem2 />
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="h-[20px] relative shrink-0 w-[214.297px]" data-name="Breadcrumb">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <BreadcrumbList />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Breadcrumb />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return <div className="absolute bg-[#e5e5e5] h-0 left-[44px] top-[18px] w-px" data-name="Primitive.div" />;
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6026_556)" id="Icon">
          <path d={svgPaths.p3adb3b00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 1.33333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 13.3333V14.6667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pdc61800} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p191ca260} id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H2.66667" id="Vector_6" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 8H14.6667" id="Vector_7" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13b9f700} id="Vector_8" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1df25380} id="Vector_9" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6026_556">
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
      <Icon35 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[#e5e5e5] h-0 left-[97px] top-[18px] w-px" data-name="Primitive.div" />;
}

function GlobalHeader1() {
  return (
    <div className="absolute h-[20px] left-[44px] overflow-clip top-[8px] w-[87.156px]" data-name="GlobalHeader">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[44px] not-italic text-[#0a0a0a] text-[14px] text-center top-0">Dr. Anil Mehta</p>
    </div>
  );
}

function PrimitiveImg() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Primitive.img">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgPrimitiveImg} />
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute content-stretch flex items-start left-[8px] overflow-clip rounded-[16777200px] size-[28px] top-[4px]" data-name="Primitive.span">
      <PrimitiveImg />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[36px] left-[106px] rounded-[5.2px] top-0 w-[139.156px]" data-name="Button">
      <GlobalHeader1 />
      <PrimitiveSpan1 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1e6eff00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p5baad20} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Badge12() {
  return (
    <div className="absolute bg-[#df2225] left-[24px] rounded-[5.2px] size-[16px] top-[-4px]" data-name="Badge">
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
      <Icon36 />
      <Badge12 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[36px] relative shrink-0 w-[245.156px]" data-name="Container">
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

function Container22() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container23 />
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function GlobalHeader() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] content-stretch flex flex-col h-[41px] items-start left-0 pb-px top-0 w-[1116px]" data-name="GlobalHeader">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <Container22 />
    </div>
  );
}

function SidebarInset() {
  return (
    <div className="absolute bg-white h-[764px] left-[48px] overflow-clip top-0 w-[1116px]" data-name="SidebarInset">
      <AppShell1 />
      <GlobalHeader />
    </div>
  );
}

function AppShell() {
  return (
    <div className="flex-[1_0_0] h-[764px] min-h-px min-w-px relative" data-name="AppShell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Sidebar />
        <SidebarInset />
      </div>
    </div>
  );
}

function SidebarProvider() {
  return (
    <div className="absolute content-stretch flex h-[764px] items-start left-0 top-0 w-[1164px]" data-name="SidebarProvider">
      <AppShell />
    </div>
  );
}

function SvgLogo() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SvgLogo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="SvgLogo">
          <path d={svgPaths.p247919d2} fill="var(--fill-0, #4A4C60)" id="Vector" />
          <path d={svgPaths.p159b4380} fill="var(--fill-0, #4A4C60)" id="Vector_2" />
          <path d={svgPaths.p2870ff80} fill="var(--fill-0, #3AA9A0)" id="Vector_3" />
          <path d={svgPaths.p28e40600} fill="var(--fill-0, #3AA9A0)" id="Vector_4" />
          <path d={svgPaths.p1efc7df2} fill="var(--fill-0, #2E8981)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 rounded-[5.2px] size-[32px] top-0" data-name="SlotClone">
      <SvgLogo />
    </div>
  );
}

function SidebarMenuItem() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[31px]" data-name="SidebarMenuItem">
      <SlotClone />
    </div>
  );
}

function SidebarMenu() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[31px]" data-name="SidebarMenu">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <SidebarMenuItem />
      </div>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="h-[48px] relative shrink-0 w-[47px]" data-name="SidebarHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[8px] py-[8px] relative size-full">
        <SidebarMenu />
      </div>
    </div>
  );
}

function Icon37() {
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

function GlobalSidebar() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="GlobalSidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Home</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon37 />
      <GlobalSidebar />
    </div>
  );
}

function SidebarMenuItem1() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[31px]" data-name="SidebarMenuItem">
      <Link2 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function GlobalSidebar1() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="GlobalSidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#171717] text-[14px] top-0">Radiology Reports</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute bg-[#f5f5f5] content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon38 />
      <GlobalSidebar1 />
    </div>
  );
}

function SidebarMenuItem2() {
  return (
    <div className="absolute h-[32px] left-0 top-[36px] w-[31px]" data-name="SidebarMenuItem">
      <Link3 />
    </div>
  );
}

function SidebarMenu1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[31px]" data-name="SidebarMenu">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <SidebarMenuItem1 />
        <SidebarMenuItem2 />
      </div>
    </div>
  );
}

function SidebarGroup() {
  return (
    <div className="absolute content-stretch flex flex-col h-[84px] items-start left-0 pl-[8px] py-[8px] top-0 w-[47px]" data-name="SidebarGroup">
      <SidebarMenu1 />
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[47px]" data-name="SidebarContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <SidebarGroup />
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[47px] not-italic text-[#0a0a0a] text-[14px] text-center top-0">Dr. Emily Chen</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[52.5px] not-italic text-[#737373] text-[12px] text-center top-0">Referring Physician</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text />
        <Text1 />
      </div>
    </div>
  );
}

function RoleSwitcher() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-center left-[16px] pr-[-24px] top-[8px] w-0" data-name="RoleSwitcher">
      <Icon39 />
      <Container26 />
    </div>
  );
}

function Button16() {
  return (
    <div className="flex-[1_0_0] h-[52px] min-h-px min-w-px relative rounded-[5.2px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <RoleSwitcher />
      </div>
    </div>
  );
}

function SlotClone1() {
  return (
    <div className="absolute content-stretch flex items-center left-0 overflow-clip rounded-[5.2px] size-[32px] top-0" data-name="SlotClone">
      <Button16 />
    </div>
  );
}

function SidebarMenuItem3() {
  return (
    <div className="absolute h-[32px] left-0 top-0 w-[31px]" data-name="SidebarMenuItem">
      <SlotClone1 />
    </div>
  );
}

function SidebarMenu2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[31px]" data-name="SidebarMenu">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <SidebarMenuItem3 />
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="h-[48px] relative shrink-0 w-[47px]" data-name="SidebarFooter">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[8px] py-[8px] relative size-full">
        <SidebarMenu2 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex flex-col h-[764px] items-start left-0 top-0 w-[47px]" data-name="Container">
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </div>
  );
}

function SidebarRail() {
  return <div className="absolute h-[764px] left-[39px] top-0 w-[16px]" data-name="SidebarRail" />;
}

function Sidebar1() {
  return (
    <div className="absolute border-[#e5e5e5] border-r border-solid h-[764px] left-0 top-0 w-[48px]" data-name="Sidebar">
      <Container25 />
      <SidebarRail />
    </div>
  );
}

export default function RadiologyV() {
  return (
    <div className="bg-white relative size-full" data-name="Radiology V2">
      <SidebarProvider />
      <Sidebar1 />
    </div>
  );
}