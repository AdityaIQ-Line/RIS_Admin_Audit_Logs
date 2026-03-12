import svgPaths from "./svg-i8c9lsawwt";
import imgPrimitiveImg from "figma:asset/45203bd2e591315cd9c2ff94aee669a5af2a46f7.png";

function Sidebar() {
  return <div className="absolute h-[764px] left-0 top-0 w-[48px]" data-name="Sidebar" />;
}

function Heading1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[83.156px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Total Facilities</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6201_2259)" id="Icon">
          <path d={svgPaths.p37143280} id="Vector" stroke="var(--stroke-0, #0F91B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p1d7f0000} id="Vector_2" stroke="var(--stroke-0, #0F91B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p2b722f80} id="Vector_3" stroke="var(--stroke-0, #0F91B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d="M8.33333 5H11.6667" id="Vector_4" stroke="var(--stroke-0, #0F91B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d="M8.33333 8.33333H11.6667" id="Vector_5" stroke="var(--stroke-0, #0F91B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d="M8.33333 11.6667H11.6667" id="Vector_6" stroke="var(--stroke-0, #0F91B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d="M8.33333 15H11.6667" id="Vector_7" stroke="var(--stroke-0, #0F91B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </g>
        <defs>
          <clipPath id="clip0_6201_2259">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function StatCard() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="StatCard">
      <Heading1 />
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px]">4</p>
    </div>
  );
}

function StatCard1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="StatCard">
      <Container1 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[20px] px-[20px] relative size-full">
        <StatCard />
        <StatCard1 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-[1] content-stretch flex flex-col items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardContent />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[95.836px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">PACS Connected</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p15ab6200} id="Vector" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p3b27f100} id="Vector_2" stroke="var(--stroke-0, #334155)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </g>
      </svg>
    </div>
  );
}

function StatCard2() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="StatCard">
      <Heading2 />
      <Icon1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px]">4</p>
    </div>
  );
}

function StatCard3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="StatCard">
      <Container2 />
    </div>
  );
}

function CardContent1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[20px] px-[20px] relative size-full">
        <StatCard2 />
        <StatCard3 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-[4] content-stretch flex flex-col items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardContent1 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[49.352px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Active Facilities</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6201_2241)" id="Icon">
          <path d={svgPaths.p2de5ff00} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p3fe63d80} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </g>
        <defs>
          <clipPath id="clip0_6201_2241">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function StatCard4() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="StatCard">
      <Heading3 />
      <Icon2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px]">3</p>
    </div>
  );
}

function StatCard5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="StatCard">
      <Container3 />
    </div>
  );
}

function CardContent2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[20px] px-[20px] relative size-full">
        <StatCard4 />
        <StatCard5 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-[2] content-stretch flex flex-col items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardContent2 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[16px] relative shrink-0 w-[57.352px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Total Users</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.pc9c280} id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </g>
      </svg>
    </div>
  );
}

function StatCard6() {
  return (
    <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="StatCard">
      <Heading4 />
      <Icon3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#0a0a0a] text-[24px] top-[0.5px]">117</p>
    </div>
  );
}

function StatCard7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="StatCard">
      <Container4 />
    </div>
  );
}

function CardContent3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[243.25px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[20px] px-[20px] relative size-full">
        <StatCard6 />
        <StatCard7 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-[3] content-stretch flex flex-col items-start p-px relative rounded-[11.2px] row-[1] self-stretch shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <CardContent3 />
    </div>
  );
}

function Container() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(4,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[93px] relative shrink-0 w-[1053px]" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

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

function Icon4() {
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

function Container5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[295px]" data-name="Container">
      <Input />
      <Icon4 />
    </div>
  );
}

function Icon5() {
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

function Frame2() {
  return (
    <div className="relative shrink-0 w-[111.273px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative w-full">
        <Icon5 />
        <PrimitiveSpan />
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

function PrimitiveButton() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex gap-[38.727px] h-[36px] items-center px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[200px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <Frame2 />
      <Icon6 />
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

function PrimitiveButton1() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[180px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan1 />
      <Icon7 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 top-0 w-[1034px]">
      <Container5 />
      <PrimitiveButton />
      <PrimitiveButton1 />
    </div>
  );
}

function FacilityManagement1() {
  return (
    <div className="h-[36px] relative shrink-0 w-[1034px]" data-name="FacilityManagement">
      <Frame1 />
    </div>
  );
}

function TableHead() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[47.891px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">S.No</p>
    </div>
  );
}

function TableHead1() {
  return (
    <div className="absolute h-[40px] left-[47.89px] top-0 w-[58.023px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Active</p>
    </div>
  );
}

function TableHead2() {
  return (
    <div className="absolute h-[40px] left-[105.91px] top-0 w-[103.133px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Facility Code</p>
    </div>
  );
}

function TableHead3() {
  return (
    <div className="absolute h-[40px] left-[209.05px] top-0 w-[111.172px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Name</p>
    </div>
  );
}

function TableHead4() {
  return (
    <div className="absolute h-[40px] left-[320.22px] top-0 w-[248.898px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Email ID</p>
    </div>
  );
}

function TableHead5() {
  return (
    <div className="absolute h-[40px] left-[569.12px] top-0 w-[101.578px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Admin Name</p>
    </div>
  );
}

function TableHead6() {
  return (
    <div className="absolute h-[40px] left-[670.7px] top-0 w-[107.773px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Admin Ph No.</p>
    </div>
  );
}

function TableHead7() {
  return (
    <div className="absolute h-[40px] left-[778.47px] top-0 w-[89.922px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Created By</p>
    </div>
  );
}

function TableHead8() {
  return (
    <div className="absolute h-[40px] left-[868.39px] top-0 w-[86.273px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Created At</p>
    </div>
  );
}

function TableHead9() {
  return (
    <div className="absolute h-[40px] left-[954.66px] top-0 w-[128.008px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Last Modified By</p>
    </div>
  );
}

function TableHead10() {
  return (
    <div className="absolute h-[40px] left-[1082.67px] top-0 w-[124.367px]" data-name="TableHead">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Last Modified At</p>
    </div>
  );
}

function TableHead11() {
  return (
    <div className="absolute h-[40px] left-[1207.04px] top-0 w-[140px]" data-name="TableHead">
      <p className="-translate-x-full absolute font-['Arial:Bold',sans-serif] leading-[20px] left-[132.66px] not-italic text-[#0a0a0a] text-[14px] text-right top-[9.75px]">Actions</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[40px] left-0 top-0 w-[1347.039px]" data-name="TableRow">
      <TableHead />
      <TableHead1 />
      <TableHead2 />
      <TableHead3 />
      <TableHead4 />
      <TableHead5 />
      <TableHead6 />
      <TableHead7 />
      <TableHead8 />
      <TableHead9 />
      <TableHead10 />
      <TableHead11 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[1347.039px]" data-name="TableHeader">
      <TableRow />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[47.891px]" data-name="TableCell">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[24.05px] not-italic text-[#0a0a0a] text-[14px] text-center top-[28.5px]">1</p>
    </div>
  );
}

function PrimitiveSpan2() {
  return <div className="absolute bg-white left-[14px] rounded-[16777200px] size-[16px] top-[0.2px]" data-name="Primitive.span" />;
}

function PrimitiveButton2() {
  return (
    <div className="absolute bg-[#0f91b2] border border-[rgba(0,0,0,0)] border-solid h-[18.398px] left-[8px] rounded-[16777200px] top-[27.15px] w-[32px]" data-name="Primitive.button">
      <PrimitiveSpan2 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[77px] left-[47.89px] top-0 w-[58.023px]" data-name="TableCell">
      <PrimitiveButton2 />
    </div>
  );
}

function FacilityManagement3() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[87.133px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">APL-MB</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[77px] left-[105.91px] top-0 w-[103.133px]" data-name="TableCell">
      <FacilityManagement3 />
    </div>
  );
}

function FacilityManagement4() {
  return (
    <div className="absolute h-[72px] left-[8px] top-[2.5px] w-[95.172px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-0 w-[93px] whitespace-pre-wrap">Apollo Diagnostics - Main Branch</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[77px] left-[209.05px] top-0 w-[111.172px]" data-name="TableCell">
      <FacilityManagement4 />
    </div>
  );
}

function FacilityManagement5() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[232.898px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">main@apollodiagnostics.com</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[77px] left-[320.22px] top-0 w-[248.898px]" data-name="TableCell">
      <FacilityManagement5 />
    </div>
  );
}

function FacilityManagement6() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[85.578px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Apollo Admin</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[77px] left-[569.12px] top-0 w-[101.578px]" data-name="TableCell">
      <FacilityManagement6 />
    </div>
  );
}

function FacilityManagement7() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[91.773px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[79px] whitespace-pre-wrap">+91 80 1234 5678</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[77px] left-[670.7px] top-0 w-[107.773px]" data-name="TableCell">
      <FacilityManagement7 />
    </div>
  );
}

function FacilityManagement8() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[73.922px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[40px] whitespace-pre-wrap">Super Admin</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[77px] left-[778.47px] top-0 w-[89.922px]" data-name="TableCell">
      <FacilityManagement8 />
    </div>
  );
}

function FacilityManagement9() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[70.273px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[57px] whitespace-pre-wrap">2024-01-10</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[77px] left-[868.39px] top-0 w-[86.273px]" data-name="TableCell">
      <FacilityManagement9 />
    </div>
  );
}

function FacilityManagement10() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[112.008px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[77px] left-[954.66px] top-0 w-[128.008px]" data-name="TableCell">
      <FacilityManagement10 />
    </div>
  );
}

function FacilityManagement11() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[108.367px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[77px] left-[1082.67px] top-0 w-[124.367px]" data-name="TableCell">
      <FacilityManagement11 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1ca41d89} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p150f5b00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d6e5280} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function FacilityManagement12() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[22.5px] w-[124px]" data-name="FacilityManagement">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[77px] left-[1207.04px] top-0 w-[140px]" data-name="TableCell">
      <FacilityManagement12 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[77px] left-0 top-0 w-[1347.039px]" data-name="TableRow">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[47.891px]" data-name="TableCell">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[24.05px] not-italic text-[#0a0a0a] text-[14px] text-center top-[28.5px]">2</p>
    </div>
  );
}

function PrimitiveSpan3() {
  return <div className="absolute bg-white left-[14px] rounded-[16777200px] size-[16px] top-[0.2px]" data-name="Primitive.span" />;
}

function PrimitiveButton3() {
  return (
    <div className="absolute bg-[#0f91b2] border border-[rgba(0,0,0,0)] border-solid h-[18.398px] left-[8px] rounded-[16777200px] top-[27.15px] w-[32px]" data-name="Primitive.button">
      <PrimitiveSpan3 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[77px] left-[47.89px] top-0 w-[58.023px]" data-name="TableCell">
      <PrimitiveButton3 />
    </div>
  );
}

function FacilityManagement13() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[87.133px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">APL-KRM</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[77px] left-[105.91px] top-0 w-[103.133px]" data-name="TableCell">
      <FacilityManagement13 />
    </div>
  );
}

function FacilityManagement14() {
  return (
    <div className="absolute h-[72px] left-[8px] top-[2.5px] w-[95.172px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-0 w-[96px] whitespace-pre-wrap">Apollo Diagnostics - Koramangala</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[77px] left-[209.05px] top-0 w-[111.172px]" data-name="TableCell">
      <FacilityManagement14 />
    </div>
  );
}

function FacilityManagement15() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[232.898px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">koramangala@apollodiagnostics.com</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[77px] left-[320.22px] top-0 w-[248.898px]" data-name="TableCell">
      <FacilityManagement15 />
    </div>
  );
}

function FacilityManagement16() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[85.578px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Apollo Admin</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[77px] left-[569.12px] top-0 w-[101.578px]" data-name="TableCell">
      <FacilityManagement16 />
    </div>
  );
}

function FacilityManagement17() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[91.773px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[79px] whitespace-pre-wrap">+91 80 2345 6789</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[77px] left-[670.7px] top-0 w-[107.773px]" data-name="TableCell">
      <FacilityManagement17 />
    </div>
  );
}

function FacilityManagement18() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[73.922px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[40px] whitespace-pre-wrap">Super Admin</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[77px] left-[778.47px] top-0 w-[89.922px]" data-name="TableCell">
      <FacilityManagement18 />
    </div>
  );
}

function FacilityManagement19() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[70.273px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[57px] whitespace-pre-wrap">2024-01-12</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[77px] left-[868.39px] top-0 w-[86.273px]" data-name="TableCell">
      <FacilityManagement19 />
    </div>
  );
}

function FacilityManagement20() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[112.008px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[77px] left-[954.66px] top-0 w-[128.008px]" data-name="TableCell">
      <FacilityManagement20 />
    </div>
  );
}

function FacilityManagement21() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[108.367px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[77px] left-[1082.67px] top-0 w-[124.367px]" data-name="TableCell">
      <FacilityManagement21 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
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
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1ca41d89} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p150f5b00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d6e5280} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function FacilityManagement22() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[22.5px] w-[124px]" data-name="FacilityManagement">
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[77px] left-[1207.04px] top-0 w-[140px]" data-name="TableCell">
      <FacilityManagement22 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[77px] left-0 top-[77px] w-[1347.039px]" data-name="TableRow">
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[47.891px]" data-name="TableCell">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[24.05px] not-italic text-[#0a0a0a] text-[14px] text-center top-[16.5px]">3</p>
    </div>
  );
}

function PrimitiveSpan4() {
  return <div className="absolute bg-white left-[14px] rounded-[16777200px] size-[16px] top-[0.2px]" data-name="Primitive.span" />;
}

function PrimitiveButton4() {
  return (
    <div className="absolute bg-[#0f91b2] border border-[rgba(0,0,0,0)] border-solid h-[18.398px] left-[8px] rounded-[16777200px] top-[15.15px] w-[32px]" data-name="Primitive.button">
      <PrimitiveSpan4 />
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[53px] left-[47.89px] top-0 w-[58.023px]" data-name="TableCell">
      <PrimitiveButton4 />
    </div>
  );
}

function FacilityManagement23() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[87.133px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">CGH-001</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[53px] left-[105.91px] top-0 w-[103.133px]" data-name="TableCell">
      <FacilityManagement23 />
    </div>
  );
}

function FacilityManagement24() {
  return (
    <div className="absolute h-[48px] left-[8px] top-[2.5px] w-[95.172px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-0 w-[89px] whitespace-pre-wrap">City General Hospital</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[53px] left-[209.05px] top-0 w-[111.172px]" data-name="TableCell">
      <FacilityManagement24 />
    </div>
  );
}

function FacilityManagement25() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[232.898px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">radiology@cityhospital.com</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[53px] left-[320.22px] top-0 w-[248.898px]" data-name="TableCell">
      <FacilityManagement25 />
    </div>
  );
}

function FacilityManagement26() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[85.578px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">City Admin</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[53px] left-[569.12px] top-0 w-[101.578px]" data-name="TableCell">
      <FacilityManagement26 />
    </div>
  );
}

function FacilityManagement27() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[6.5px] w-[91.773px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[79px] whitespace-pre-wrap">+91 22 3456 7890</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[53px] left-[670.7px] top-0 w-[107.773px]" data-name="TableCell">
      <FacilityManagement27 />
    </div>
  );
}

function FacilityManagement28() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[6.5px] w-[73.922px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[40px] whitespace-pre-wrap">Super Admin</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[53px] left-[778.47px] top-0 w-[89.922px]" data-name="TableCell">
      <FacilityManagement28 />
    </div>
  );
}

function FacilityManagement29() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[6.5px] w-[70.273px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[57px] whitespace-pre-wrap">2024-01-15</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[53px] left-[868.39px] top-0 w-[86.273px]" data-name="TableCell">
      <FacilityManagement29 />
    </div>
  );
}

function FacilityManagement30() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[112.008px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[53px] left-[954.66px] top-0 w-[128.008px]" data-name="TableCell">
      <FacilityManagement30 />
    </div>
  );
}

function FacilityManagement31() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[108.367px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[53px] left-[1082.67px] top-0 w-[124.367px]" data-name="TableCell">
      <FacilityManagement31 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p26b72c80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26302300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p150f5b00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d6e5280} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function FacilityManagement32() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[124px]" data-name="FacilityManagement">
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[53px] left-[1207.04px] top-0 w-[140px]" data-name="TableCell">
      <FacilityManagement32 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[53px] left-0 top-[154px] w-[1347.039px]" data-name="TableRow">
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[77px] left-0 top-0 w-[47.891px]" data-name="TableCell">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[24.05px] not-italic text-[#0a0a0a] text-[14px] text-center top-[28.5px]">4</p>
    </div>
  );
}

function PrimitiveSpan5() {
  return <div className="absolute bg-white left-0 rounded-[16777200px] size-[16px] top-[0.2px]" data-name="Primitive.span" />;
}

function PrimitiveButton5() {
  return (
    <div className="absolute bg-[#cbced4] border border-[rgba(0,0,0,0)] border-solid h-[18.398px] left-[8px] rounded-[16777200px] top-[27.15px] w-[32px]" data-name="Primitive.button">
      <PrimitiveSpan5 />
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[77px] left-[47.89px] top-0 w-[58.023px]" data-name="TableCell">
      <PrimitiveButton5 />
    </div>
  );
}

function FacilityManagement33() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[87.133px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">MSC-HSR</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[77px] left-[105.91px] top-0 w-[103.133px]" data-name="TableCell">
      <FacilityManagement33 />
    </div>
  );
}

function FacilityManagement34() {
  return (
    <div className="absolute h-[72px] left-[8px] top-[2.5px] w-[95.172px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#0a0a0a] text-[16px] top-0 w-[88px] whitespace-pre-wrap">MediScan Clinic - HSR Layout</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[77px] left-[209.05px] top-0 w-[111.172px]" data-name="TableCell">
      <FacilityManagement34 />
    </div>
  );
}

function FacilityManagement35() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[232.898px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">hsr@mediscanclinic.com</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[77px] left-[320.22px] top-0 w-[248.898px]" data-name="TableCell">
      <FacilityManagement35 />
    </div>
  );
}

function FacilityManagement36() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[85.578px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[63px] whitespace-pre-wrap">MediScan Admin</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[77px] left-[569.12px] top-0 w-[101.578px]" data-name="TableCell">
      <FacilityManagement36 />
    </div>
  );
}

function FacilityManagement37() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[91.773px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[79px] whitespace-pre-wrap">+91 80 4567 8901</p>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute h-[77px] left-[670.7px] top-0 w-[107.773px]" data-name="TableCell">
      <FacilityManagement37 />
    </div>
  );
}

function FacilityManagement38() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[73.922px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[40px] whitespace-pre-wrap">Super Admin</p>
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[77px] left-[778.47px] top-0 w-[89.922px]" data-name="TableCell">
      <FacilityManagement38 />
    </div>
  );
}

function FacilityManagement39() {
  return (
    <div className="absolute h-[40px] left-[8px] top-[18.5px] w-[70.273px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0 w-[57px] whitespace-pre-wrap">2024-01-18</p>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[77px] left-[868.39px] top-0 w-[86.273px]" data-name="TableCell">
      <FacilityManagement39 />
    </div>
  );
}

function FacilityManagement40() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[112.008px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[77px] left-[954.66px] top-0 w-[128.008px]" data-name="TableCell">
      <FacilityManagement40 />
    </div>
  );
}

function FacilityManagement41() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[28.5px] w-[108.367px]" data-name="FacilityManagement">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">-</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[77px] left-[1082.67px] top-0 w-[124.367px]" data-name="TableCell">
      <FacilityManagement41 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
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
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26302300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p150f5b00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d6e5280} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[32px] relative rounded-[5.2px] shrink-0 w-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function FacilityManagement42() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[22.5px] w-[124px]" data-name="FacilityManagement">
      <Button9 />
      <Button10 />
      <Button11 />
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[77px] left-[1207.04px] top-0 w-[140px]" data-name="TableCell">
      <FacilityManagement42 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[77px] left-0 top-[207px] w-[1347.039px]" data-name="TableRow">
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[284px] left-0 top-[40px] w-[1347.039px]" data-name="TableBody">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
    </div>
  );
}

function Table1() {
  return (
    <div className="h-[324.5px] relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col h-[339.5px] items-start overflow-clip pr-[-281.039px] relative shrink-0 w-full" data-name="Table">
      <Table1 />
    </div>
  );
}

function FacilityManagement2() {
  return (
    <div className="h-[339.5px] relative shrink-0 w-[1066px]" data-name="FacilityManagement">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Table />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[365.5px] items-start p-px relative rounded-[11.2px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[11.2px]" />
      <FacilityManagement2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <FacilityManagement1 />
      <Card4 />
    </div>
  );
}

function FacilityManagement() {
  return (
    <div className="h-[633.5px] relative shrink-0 w-[1116px]" data-name="FacilityManagement">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pt-[24px] px-[24px] relative size-full">
        <Container />
        <Frame />
      </div>
    </div>
  );
}

function PageShell() {
  return (
    <div className="absolute content-stretch flex flex-col h-[723px] items-start left-0 pt-[56px] top-0 w-[1116px]" data-name="PageShell">
      <FacilityManagement />
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.5px]">Facility Management</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[28px] relative shrink-0 w-[177.047px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #EAFDFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #EAFDFE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[#0f91b2] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[5.2px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon20 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[89px] not-italic text-[#eafdfe] text-[14px] text-center top-[8px]">Create Facility</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[36px] relative shrink-0 w-[145.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Button12 />
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="absolute bg-white content-stretch flex h-[56px] items-center justify-between left-0 pb-px px-[24px] top-0 w-[1116px]" data-name="PageHeader">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <Container6 />
      <Container7 />
    </div>
  );
}

function AppShell1() {
  return (
    <div className="absolute h-[723px] left-0 overflow-clip top-[41px] w-[1116px]" data-name="AppShell">
      <PageShell />
      <PageHeader />
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

function BreadcrumbSeparator() {
  return (
    <div className="absolute left-[47.35px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
      <Icon21 />
    </div>
  );
}

function Link1() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#737373] text-[14px] top-0">Superadmin</p>
      </div>
    </div>
  );
}

function BreadcrumbItem1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[71.35px] top-0 w-[75.492px]" data-name="BreadcrumbItem">
      <Link1 />
    </div>
  );
}

function Icon22() {
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
    <div className="absolute left-[156.84px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
      <Icon22 />
    </div>
  );
}

function BreadcrumbPage() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="BreadcrumbPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Facilities</p>
      </div>
    </div>
  );
}

function BreadcrumbItem2() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[180.84px] top-0 w-[54.461px]" data-name="BreadcrumbItem">
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
    <div className="h-[20px] relative shrink-0 w-[235.305px]" data-name="Breadcrumb">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <BreadcrumbList />
      </div>
    </div>
  );
}

function Container9() {
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

function Icon23() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6201_2309)" id="Icon">
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
          <clipPath id="clip0_6201_2309">
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
      <Icon23 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[#e5e5e5] h-0 left-[97px] top-[18px] w-px" data-name="Primitive.div" />;
}

function GlobalHeader1() {
  return (
    <div className="absolute h-[20px] left-[44px] overflow-clip top-[8px] w-[73.133px]" data-name="GlobalHeader">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[37px] not-italic text-[#0a0a0a] text-[14px] text-center top-0">Admin User</p>
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

function PrimitiveSpan6() {
  return (
    <div className="absolute content-stretch flex items-start left-[8px] overflow-clip rounded-[16777200px] size-[28px] top-[4px]" data-name="Primitive.span">
      <PrimitiveImg />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[36px] left-[106px] rounded-[5.2px] top-0 w-[125.133px]" data-name="Button">
      <GlobalHeader1 />
      <PrimitiveSpan6 />
    </div>
  );
}

function Icon24() {
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

function Badge() {
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
      <Icon24 />
      <Badge />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[36px] relative shrink-0 w-[231.133px]" data-name="Container">
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

function Container8() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[16px] relative size-full">
          <Container9 />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function GlobalHeader() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] content-stretch flex flex-col h-[41px] items-start left-0 pb-px top-0 w-[1116px]" data-name="GlobalHeader">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <Container8 />
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

function Icon25() {
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
      <Icon25 />
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

function Icon26() {
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

function GlobalSidebar1() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="GlobalSidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Imaging Worklist</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon26 />
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

function Icon27() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6201_2225)" id="Icon">
          <path d={svgPaths.pda21400} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1be36900} id="Vector_2" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa8d100} id="Vector_3" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 4H9.33333" id="Vector_4" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6.66667H9.33333" id="Vector_5" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 9.33333H9.33333" id="Vector_6" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 12H9.33333" id="Vector_7" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6201_2225">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function GlobalSidebar2() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="GlobalSidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#171717] text-[14px] top-0">Facility Management</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute bg-[#f5f5f5] content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon27 />
      <GlobalSidebar2 />
    </div>
  );
}

function SidebarMenuItem3() {
  return (
    <div className="absolute h-[32px] left-0 top-[72px] w-[31px]" data-name="SidebarMenuItem">
      <Link4 />
    </div>
  );
}

function Icon28() {
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

function GlobalSidebar3() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="GlobalSidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Templates</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon28 />
      <GlobalSidebar3 />
    </div>
  );
}

function SidebarMenuItem4() {
  return (
    <div className="absolute h-[32px] left-0 top-[108px] w-[31px]" data-name="SidebarMenuItem">
      <Link5 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6201_2332)" id="Icon">
          <path d={svgPaths.p2d09d900} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6201_2332">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function GlobalSidebar4() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="GlobalSidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Audit Logs</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon29 />
      <GlobalSidebar4 />
    </div>
  );
}

function SidebarMenuItem5() {
  return (
    <div className="absolute h-[32px] left-0 top-[144px] w-[31px]" data-name="SidebarMenuItem">
      <Link6 />
    </div>
  );
}

function SidebarMenu1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[31px]" data-name="SidebarMenu">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <SidebarMenuItem1 />
        <SidebarMenuItem2 />
        <SidebarMenuItem3 />
        <SidebarMenuItem4 />
        <SidebarMenuItem5 />
      </div>
    </div>
  );
}

function SidebarGroup() {
  return (
    <div className="absolute content-stretch flex flex-col h-[192px] items-start left-0 pl-[8px] py-[8px] top-0 w-[47px]" data-name="SidebarGroup">
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

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6201_2323)" id="Icon">
          <path d={svgPaths.pda21400} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1be36900} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pa8d100} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 4H9.33333" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6.66667H9.33333" id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 9.33333H9.33333" id="Vector_6" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 12H9.33333" id="Vector_7" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6201_2323">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[37px] not-italic text-[#0a0a0a] text-[14px] text-center top-0">Admin User</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[34.5px] not-italic text-[#737373] text-[12px] text-center top-0">Super Admin</p>
      </div>
    </div>
  );
}

function Container12() {
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
      <Icon30 />
      <Container12 />
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

function SidebarMenuItem6() {
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
        <SidebarMenuItem6 />
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

function Container11() {
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
      <Container11 />
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