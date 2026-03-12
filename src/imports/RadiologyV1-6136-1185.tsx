import svgPaths from "./svg-p2fphwmnyi";
import imgPrimitiveImg from "figma:asset/8d99c6eca9c38173733b5cafc79f004e98321949.png";

function Sidebar() {
  return <div className="absolute h-[764px] left-0 top-0 w-[48px]" data-name="Sidebar" />;
}

function Icon() {
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

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Icon />
      <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#737373] text-[14px]">{`Search `}</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#f3f3f5] h-[36px] left-0 rounded-[5.2px] top-0 w-[192px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[12px] pr-[20px] py-[4px] relative rounded-[inherit] size-full">
        <Frame1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
    </div>
  );
}

function Container() {
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

function Icon1() {
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
      <Icon1 />
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[82.477px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Modalities</p>
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

function PrimitiveButton1() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[135px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan1 />
      <Icon2 />
    </div>
  );
}

function PrimitiveSpan2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[66.148px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Studies</p>
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

function PrimitiveButton2() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[136px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan2 />
      <Icon3 />
    </div>
  );
}

function PrimitiveSpan3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[73.906px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Priorities</p>
      </div>
    </div>
  );
}

function Icon4() {
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

function PrimitiveButton3() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[135px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan3 />
      <Icon4 />
    </div>
  );
}

function PrimitiveSpan4() {
  return (
    <div className="h-[20px] relative shrink-0" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center overflow-clip relative rounded-[inherit]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Radiologists</p>
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

function PrimitiveButton4() {
  return (
    <div className="bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between px-[21px] py-px relative rounded-[5.2px] shrink-0 w-[136px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan4 />
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

function Frame3() {
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
      <Frame3 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Container />
      <PrimitiveButton />
      <PrimitiveButton1 />
      <PrimitiveButton2 />
      <PrimitiveButton3 />
      <PrimitiveButton4 />
      <Button />
    </div>
  );
}

function PrimitiveButton5() {
  return <div className="absolute bg-white border-2 border-[rgba(229,229,229,0.6)] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[16px] top-[12.25px]" data-name="Primitive.button" />;
}

function TableHead() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[24px]" data-name="TableHead">
      <PrimitiveButton5 />
    </div>
  );
}

function TableHead1() {
  return (
    <div className="absolute h-[40px] left-[24px] top-0 w-[92.977px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">UHID</p>
    </div>
  );
}

function TableHead2() {
  return (
    <div className="absolute h-[40px] left-[116.98px] top-0 w-[130.258px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Patient Name</p>
    </div>
  );
}

function TableHead3() {
  return (
    <div className="absolute h-[40px] left-[247.23px] top-0 w-[40.922px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Age</p>
    </div>
  );
}

function TableHead4() {
  return (
    <div className="absolute h-[40px] left-[288.16px] top-0 w-[62.703px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Gender</p>
    </div>
  );
}

function TableHead5() {
  return (
    <div className="absolute h-[40px] left-[350.86px] top-0 w-[68.133px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Modality</p>
    </div>
  );
}

function TableHead6() {
  return (
    <div className="absolute h-[40px] left-[418.99px] top-0 w-[250px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Study Description</p>
    </div>
  );
}

function TableHead7() {
  return (
    <div className="absolute h-[40px] left-[668.99px] top-0 w-[158.406px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Tests</p>
    </div>
  );
}

function TableHead8() {
  return (
    <div className="absolute h-[40px] left-[827.4px] top-0 w-[200px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Clinical History</p>
    </div>
  );
}

function TableHead9() {
  return (
    <div className="absolute h-[40px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Priority</p>
    </div>
  );
}

function TableHead10() {
  return (
    <div className="absolute h-[40px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Report Status</p>
    </div>
  );
}

function TableHead11() {
  return (
    <div className="absolute h-[40px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableHead">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Assignment Status</p>
    </div>
  );
}

function TableHead12() {
  return (
    <div className="absolute h-[40px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableHead">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[9.75px]">Assigned Radiologist</p>
    </div>
  );
}

function TableHead13() {
  return (
    <div className="absolute h-[40px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableHead">
      <p className="-translate-x-full absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[166.3px] not-italic text-[#0a0a0a] text-[14px] text-right top-[9.75px]">Actions</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[40px] left-0 top-0 w-[1687.234px]" data-name="TableRow">
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
      <TableHead12 />
      <TableHead13 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[40px] left-0 top-0 w-[1687.234px]" data-name="TableHeader">
      <TableRow />
    </div>
  );
}

function PrimitiveButton6() {
  return <div className="absolute bg-white border-2 border-[rgba(229,229,229,0.6)] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[16px] top-[19px]" data-name="Primitive.button" />;
}

function TableCell() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[24px]" data-name="TableCell">
      <PrimitiveButton6 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[53px] left-[24px] top-0 w-[92.977px]" data-name="TableCell">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16px]">UHID-45678</p>
    </div>
  );
}

function TechnologistWorklist1() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[94.18px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Sarah Johnson</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[53px] left-[116.98px] top-0 w-[130.258px]" data-name="TableCell">
      <TechnologistWorklist1 />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[53px] left-[247.23px] top-0 w-[40.922px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px] w-[25px] whitespace-pre-wrap">45Y</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[53px] left-[288.16px] top-0 w-[62.703px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">F</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute border border-[#e5e5e5] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[34px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#0a0a0a] text-[12px] top-[2px]">CT</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[53px] left-[350.86px] top-0 w-[68.133px]" data-name="TableCell">
      <Badge />
    </div>
  );
}

function TechnologistWorklist2() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">CT Chest with Contrast</p>
    </div>
  );
}

function TechnologistWorklist3() {
  return (
    <div className="absolute h-[16px] left-[8px] top-[28.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">ACC-2024-001</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[53px] left-[418.99px] top-0 w-[250px]" data-name="TableCell">
      <TechnologistWorklist2 />
      <TechnologistWorklist3 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[53px] left-[668.99px] top-0 w-[158.406px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">Contrast Enhanced CT</p>
    </div>
  );
}

function TechnologistWorklist4() {
  return (
    <div className="absolute h-[16px] left-[8px] overflow-clip top-[18.5px] w-[184px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[265px] whitespace-pre-wrap">Suspected pulmonary embolism, acute chest pain</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[53px] left-[827.4px] top-0 w-[200px]" data-name="TableCell">
      <TechnologistWorklist4 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[#e7000b] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[46.891px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">STAT</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[53px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableCell">
      <Badge1 />
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#ffbad6] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[62.039px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#9d174d] text-[12px] top-[2px]">Pending</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[53px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableCell">
      <Badge2 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[#f9fafb] border border-[#e5e7eb] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[81.375px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#364153] text-[12px] top-[2px]">Unassigned</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[53px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableCell">
      <Badge3 />
    </div>
  );
}

function TechnologistWorklist5() {
  return (
    <div className="absolute content-stretch flex h-[15.5px] items-start left-[8px] top-[18.5px] w-[4.664px]" data-name="TechnologistWorklist">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#737373] text-[14px]">-</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[53px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableCell">
      <TechnologistWorklist5 />
    </div>
  );
}

function Icon7() {
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
        <Icon7 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1ca41d89} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[72.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon8 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Edit</p>
      </div>
    </div>
  );
}

function TechnologistWorklist6() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[158.219px]" data-name="TechnologistWorklist">
      <Button1 />
      <Button2 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[53px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableCell">
      <TechnologistWorklist6 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[53px] left-0 top-0 w-[1687.234px]" data-name="TableRow">
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
      <TableCell12 />
      <TableCell13 />
    </div>
  );
}

function PrimitiveButton7() {
  return <div className="absolute bg-white border-2 border-[rgba(229,229,229,0.6)] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[16px] top-[19px]" data-name="Primitive.button" />;
}

function TableCell14() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[24px]" data-name="TableCell">
      <PrimitiveButton7 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[53px] left-[24px] top-0 w-[92.977px]" data-name="TableCell">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16px]">UHID-45682</p>
    </div>
  );
}

function TechnologistWorklist7() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[87.133px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">James Wilson</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[53px] left-[116.98px] top-0 w-[130.258px]" data-name="TableCell">
      <TechnologistWorklist7 />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[53px] left-[247.23px] top-0 w-[40.922px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px] w-[25px] whitespace-pre-wrap">58Y</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[53px] left-[288.16px] top-0 w-[62.703px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">M</p>
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute border border-[#e5e5e5] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[34px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#0a0a0a] text-[12px] top-[2px]">CT</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[53px] left-[350.86px] top-0 w-[68.133px]" data-name="TableCell">
      <Badge4 />
    </div>
  );
}

function TechnologistWorklist8() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">CT Abdomen and Pelvis with Contrast</p>
    </div>
  );
}

function TechnologistWorklist9() {
  return (
    <div className="absolute h-[16px] left-[8px] top-[28.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">ACC-2024-005</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[53px] left-[418.99px] top-0 w-[250px]" data-name="TableCell">
      <TechnologistWorklist8 />
      <TechnologistWorklist9 />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[53px] left-[668.99px] top-0 w-[158.406px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">CT Abd/Pelvis</p>
    </div>
  );
}

function TechnologistWorklist10() {
  return (
    <div className="absolute h-[16px] left-[8px] overflow-clip top-[18.5px] w-[184px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[197px] whitespace-pre-wrap">Abdominal pain, rule out appendicitis</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[53px] left-[827.4px] top-0 w-[200px]" data-name="TableCell">
      <TechnologistWorklist10 />
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[#df2225] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[54.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Urgent</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[53px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableCell">
      <Badge5 />
    </div>
  );
}

function Badge6() {
  return (
    <div className="absolute bg-[rgba(255,105,0,0.1)] border border-[#ffd6a7] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[57.352px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#ca3500] text-[12px] top-[2px]">Drafted</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[53px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableCell">
      <Badge6 />
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[#f0fdf4] border border-[#b9f8cf] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[67.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#008236] text-[12px] top-[2px]">Assigned</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[53px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableCell">
      <Badge7 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pfcf2110} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p20933800} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function TechnologistWorklist11() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[139.703px]" data-name="TechnologistWorklist">
      <Icon9 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">Dr. Sarah Chen</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[53px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableCell">
      <TechnologistWorklist11 />
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

function Button3() {
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
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26302300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[72.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon11 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Edit</p>
      </div>
    </div>
  );
}

function TechnologistWorklist12() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[158.219px]" data-name="TechnologistWorklist">
      <Button3 />
      <Button4 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[53px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableCell">
      <TechnologistWorklist12 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[53px] left-0 top-[53px] w-[1687.234px]" data-name="TableRow">
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
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
    </div>
  );
}

function PrimitiveButton8() {
  return <div className="absolute bg-white border-2 border-[rgba(229,229,229,0.6)] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[16px] top-[19px]" data-name="Primitive.button" />;
}

function TableCell28() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[24px]" data-name="TableCell">
      <PrimitiveButton8 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[53px] left-[24px] top-0 w-[92.977px]" data-name="TableCell">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16px]">UHID-45683</p>
    </div>
  );
}

function TechnologistWorklist13() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[80.133px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Maria Garcia</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[53px] left-[116.98px] top-0 w-[130.258px]" data-name="TableCell">
      <TechnologistWorklist13 />
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[53px] left-[247.23px] top-0 w-[40.922px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px] w-[25px] whitespace-pre-wrap">72Y</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[53px] left-[288.16px] top-0 w-[62.703px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">F</p>
    </div>
  );
}

function Badge8() {
  return (
    <div className="absolute border border-[#e5e5e5] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[51.344px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#0a0a0a] text-[12px] top-[2px]">X-Ray</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[53px] left-[350.86px] top-0 w-[68.133px]" data-name="TableCell">
      <Badge8 />
    </div>
  );
}

function TechnologistWorklist14() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">{`Chest X-Ray PA & Lateral`}</p>
    </div>
  );
}

function TechnologistWorklist15() {
  return (
    <div className="absolute h-[16px] left-[8px] top-[28.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">ACC-2024-006</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[53px] left-[418.99px] top-0 w-[250px]" data-name="TableCell">
      <TechnologistWorklist14 />
      <TechnologistWorklist15 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[53px] left-[668.99px] top-0 w-[158.406px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">X-Ray Chest</p>
    </div>
  );
}

function TechnologistWorklist16() {
  return (
    <div className="absolute h-[16px] left-[8px] overflow-clip top-[18.5px] w-[184px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Routine pre-op evaluation</p>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[53px] left-[827.4px] top-0 w-[200px]" data-name="TableCell">
      <TechnologistWorklist16 />
    </div>
  );
}

function Badge9() {
  return (
    <div className="absolute bg-[#f4f4f5] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[59.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#18181b] text-[12px] top-[2px]">Routine</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[53px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableCell">
      <Badge9 />
    </div>
  );
}

function Badge10() {
  return (
    <div className="absolute bg-[#fce7f3] border border-[#ffbad6] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[62.039px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#9d174d] text-[12px] top-[2px]">Pending</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[53px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableCell">
      <Badge10 />
    </div>
  );
}

function Badge11() {
  return (
    <div className="absolute bg-[#f9fafb] border border-[#e5e7eb] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[81.375px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#364153] text-[12px] top-[2px]">Unassigned</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[53px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableCell">
      <Badge11 />
    </div>
  );
}

function TechnologistWorklist17() {
  return (
    <div className="absolute content-stretch flex h-[15.5px] items-start left-[8px] top-[18.5px] w-[4.664px]" data-name="TechnologistWorklist">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#737373] text-[14px]">-</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[53px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableCell">
      <TechnologistWorklist17 />
    </div>
  );
}

function Icon12() {
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
        <Icon12 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26302300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[72.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon13 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Edit</p>
      </div>
    </div>
  );
}

function TechnologistWorklist18() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[158.219px]" data-name="TechnologistWorklist">
      <Button5 />
      <Button6 />
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[53px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableCell">
      <TechnologistWorklist18 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[53px] left-0 top-[106px] w-[1687.234px]" data-name="TableRow">
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
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

function PrimitiveButton9() {
  return <div className="absolute bg-white border-2 border-[rgba(229,229,229,0.6)] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[16px] top-[19px]" data-name="Primitive.button" />;
}

function TableCell42() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[24px]" data-name="TableCell">
      <PrimitiveButton9 />
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[53px] left-[24px] top-0 w-[92.977px]" data-name="TableCell">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16px]">UHID-45684</p>
    </div>
  );
}

function TechnologistWorklist19() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[69.258px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">John Davis</p>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[53px] left-[116.98px] top-0 w-[130.258px]" data-name="TableCell">
      <TechnologistWorklist19 />
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[53px] left-[247.23px] top-0 w-[40.922px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px] w-[25px] whitespace-pre-wrap">41Y</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[53px] left-[288.16px] top-0 w-[62.703px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">M</p>
    </div>
  );
}

function Badge12() {
  return (
    <div className="absolute border border-[#e5e5e5] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[40px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#0a0a0a] text-[12px] top-[2px]">MRI</p>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[53px] left-[350.86px] top-0 w-[68.133px]" data-name="TableCell">
      <Badge12 />
    </div>
  );
}

function TechnologistWorklist20() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">MRI Lumbar Spine without Contrast</p>
    </div>
  );
}

function TechnologistWorklist21() {
  return (
    <div className="absolute h-[16px] left-[8px] top-[28.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">ACC-2024-007</p>
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[53px] left-[418.99px] top-0 w-[250px]" data-name="TableCell">
      <TechnologistWorklist20 />
      <TechnologistWorklist21 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[53px] left-[668.99px] top-0 w-[158.406px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">MRI L-Spine</p>
    </div>
  );
}

function TechnologistWorklist22() {
  return (
    <div className="absolute h-[16px] left-[8px] overflow-clip top-[18.5px] w-[184px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Lower back pain, radiculopathy</p>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute h-[53px] left-[827.4px] top-0 w-[200px]" data-name="TableCell">
      <TechnologistWorklist22 />
    </div>
  );
}

function Badge13() {
  return (
    <div className="absolute bg-[#f4f4f5] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[59.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#18181b] text-[12px] top-[2px]">Routine</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute h-[53px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableCell">
      <Badge13 />
    </div>
  );
}

function Badge14() {
  return (
    <div className="absolute bg-[rgba(43,127,255,0.1)] border border-[#bedbff] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[105.82px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#1447e6] text-[12px] top-[2px]">Awaiting Review</p>
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute h-[53px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableCell">
      <Badge14 />
    </div>
  );
}

function Badge15() {
  return (
    <div className="absolute bg-[#f0fdf4] border border-[#b9f8cf] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[67.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#008236] text-[12px] top-[2px]">Assigned</p>
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute h-[53px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableCell">
      <Badge15 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pfcf2110} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p20933800} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function TechnologistWorklist23() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[139.703px]" data-name="TechnologistWorklist">
      <Icon14 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">Dr. Michael Chen</p>
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute h-[53px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableCell">
      <TechnologistWorklist23 />
    </div>
  );
}

function Icon15() {
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
        <Icon15 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26302300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[72.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon16 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Edit</p>
      </div>
    </div>
  );
}

function TechnologistWorklist24() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[158.219px]" data-name="TechnologistWorklist">
      <Button7 />
      <Button8 />
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute h-[53px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableCell">
      <TechnologistWorklist24 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[53px] left-0 top-[159px] w-[1687.234px]" data-name="TableRow">
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
      <TableCell55 />
    </div>
  );
}

function PrimitiveButton10() {
  return <div className="absolute bg-white border-2 border-[rgba(229,229,229,0.6)] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[16px] top-[19px]" data-name="Primitive.button" />;
}

function TableCell56() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[24px]" data-name="TableCell">
      <PrimitiveButton10 />
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute h-[53px] left-[24px] top-0 w-[92.977px]" data-name="TableCell">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16px]">UHID-45685</p>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6026_595)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333V8" id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H8.00667" id="Vector_3" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6026_595">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Patricia Brown</p>
      </div>
    </div>
  );
}

function TechnologistWorklist25() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-[8px] top-[16.5px] w-[114.258px]" data-name="TechnologistWorklist">
      <Icon17 />
      <Text />
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute h-[53px] left-[116.98px] top-0 w-[130.258px]" data-name="TableCell">
      <TechnologistWorklist25 />
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[53px] left-[247.23px] top-0 w-[40.922px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px] w-[25px] whitespace-pre-wrap">55Y</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute h-[53px] left-[288.16px] top-0 w-[62.703px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">F</p>
    </div>
  );
}

function Badge16() {
  return (
    <div className="absolute border border-[#e5e5e5] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[34px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#0a0a0a] text-[12px] top-[2px]">CT</p>
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute h-[53px] left-[350.86px] top-0 w-[68.133px]" data-name="TableCell">
      <Badge16 />
    </div>
  );
}

function TechnologistWorklist26() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">CT Head without Contrast</p>
    </div>
  );
}

function TechnologistWorklist27() {
  return (
    <div className="absolute h-[16px] left-[8px] top-[28.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">ACC-2024-008</p>
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute h-[53px] left-[418.99px] top-0 w-[250px]" data-name="TableCell">
      <TechnologistWorklist26 />
      <TechnologistWorklist27 />
    </div>
  );
}

function TableCell63() {
  return (
    <div className="absolute h-[53px] left-[668.99px] top-0 w-[158.406px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">CT Head</p>
    </div>
  );
}

function TechnologistWorklist28() {
  return (
    <div className="absolute h-[16px] left-[8px] overflow-clip top-[18.5px] w-[184px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[228px] whitespace-pre-wrap">Acute stroke symptoms, onset 2 hours ago</p>
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute h-[53px] left-[827.4px] top-0 w-[200px]" data-name="TableCell">
      <TechnologistWorklist28 />
    </div>
  );
}

function Badge17() {
  return (
    <div className="absolute bg-[#e7000b] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[46.891px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">STAT</p>
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute h-[53px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableCell">
      <Badge17 />
    </div>
  );
}

function Badge18() {
  return (
    <div className="absolute bg-[rgba(251,44,54,0.1)] border border-[#ffc9c9] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[65.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#c10007] text-[12px] top-[2px]">Rejected</p>
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute h-[53px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableCell">
      <Badge18 />
    </div>
  );
}

function Badge19() {
  return (
    <div className="absolute bg-[#f0fdf4] border border-[#b9f8cf] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[67.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#008236] text-[12px] top-[2px]">Assigned</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute h-[53px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableCell">
      <Badge19 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pfcf2110} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p20933800} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function TechnologistWorklist29() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[139.703px]" data-name="TechnologistWorklist">
      <Icon18 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">Dr. Sarah Chen</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute h-[53px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableCell">
      <TechnologistWorklist29 />
    </div>
  );
}

function Icon19() {
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
        <Icon19 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
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
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[72.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon20 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Edit</p>
      </div>
    </div>
  );
}

function TechnologistWorklist30() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[158.219px]" data-name="TechnologistWorklist">
      <Button9 />
      <Button10 />
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute h-[53px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableCell">
      <TechnologistWorklist30 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute bg-[#fef2f2] border-[#e5e5e5] border-b border-solid h-[53px] left-0 top-[212px] w-[1687.234px]" data-name="TableRow">
      <TableCell56 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
      <TableCell60 />
      <TableCell61 />
      <TableCell62 />
      <TableCell63 />
      <TableCell64 />
      <TableCell65 />
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
      <TableCell69 />
    </div>
  );
}

function PrimitiveButton11() {
  return <div className="absolute bg-white border-2 border-[rgba(229,229,229,0.6)] border-solid left-[8px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] size-[16px] top-[19px]" data-name="Primitive.button" />;
}

function TableCell70() {
  return (
    <div className="absolute h-[53px] left-0 top-0 w-[24px]" data-name="TableCell">
      <PrimitiveButton11 />
    </div>
  );
}

function TableCell71() {
  return (
    <div className="absolute h-[53px] left-[24px] top-0 w-[92.977px]" data-name="TableCell">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16px]">UHID-45686</p>
    </div>
  );
}

function TechnologistWorklist31() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[113.625px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Thomas Anderson</p>
    </div>
  );
}

function TableCell72() {
  return (
    <div className="absolute h-[53px] left-[116.98px] top-0 w-[130.258px]" data-name="TableCell">
      <TechnologistWorklist31 />
    </div>
  );
}

function TableCell73() {
  return (
    <div className="absolute h-[53px] left-[247.23px] top-0 w-[40.922px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px] w-[25px] whitespace-pre-wrap">68Y</p>
    </div>
  );
}

function TableCell74() {
  return (
    <div className="absolute h-[53px] left-[288.16px] top-0 w-[62.703px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">M</p>
    </div>
  );
}

function Badge20() {
  return (
    <div className="absolute border border-[#e5e5e5] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[51.344px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#0a0a0a] text-[12px] top-[2px]">X-Ray</p>
    </div>
  );
}

function TableCell75() {
  return (
    <div className="absolute h-[53px] left-[350.86px] top-0 w-[68.133px]" data-name="TableCell">
      <Badge20 />
    </div>
  );
}

function TechnologistWorklist32() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Left Knee X-Ray 2 Views</p>
    </div>
  );
}

function TechnologistWorklist33() {
  return (
    <div className="absolute h-[16px] left-[8px] top-[28.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">ACC-2024-009</p>
    </div>
  );
}

function TableCell76() {
  return (
    <div className="absolute h-[53px] left-[418.99px] top-0 w-[250px]" data-name="TableCell">
      <TechnologistWorklist32 />
      <TechnologistWorklist33 />
    </div>
  );
}

function TableCell77() {
  return (
    <div className="absolute h-[53px] left-[668.99px] top-0 w-[158.406px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">X-Ray Knee</p>
    </div>
  );
}

function TechnologistWorklist34() {
  return (
    <div className="absolute h-[16px] left-[8px] overflow-clip top-[18.5px] w-[184px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">Knee pain and swelling after fall</p>
    </div>
  );
}

function TableCell78() {
  return (
    <div className="absolute h-[53px] left-[827.4px] top-0 w-[200px]" data-name="TableCell">
      <TechnologistWorklist34 />
    </div>
  );
}

function Badge21() {
  return (
    <div className="absolute bg-[#f4f4f5] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[59.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#18181b] text-[12px] top-[2px]">Routine</p>
    </div>
  );
}

function TableCell79() {
  return (
    <div className="absolute h-[53px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableCell">
      <Badge21 />
    </div>
  );
}

function Badge22() {
  return (
    <div className="absolute bg-[rgba(255,105,0,0.1)] border border-[#ffd6a7] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[57.352px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#ca3500] text-[12px] top-[2px]">Drafted</p>
    </div>
  );
}

function TableCell80() {
  return (
    <div className="absolute h-[53px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableCell">
      <Badge22 />
    </div>
  );
}

function Badge23() {
  return (
    <div className="absolute bg-[#f0fdf4] border border-[#b9f8cf] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[67.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#008236] text-[12px] top-[2px]">Assigned</p>
    </div>
  );
}

function TableCell81() {
  return (
    <div className="absolute h-[53px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableCell">
      <Badge23 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pfcf2110} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p20933800} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function TechnologistWorklist35() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[139.703px]" data-name="TechnologistWorklist">
      <Icon21 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">Dr. David Kumar</p>
    </div>
  );
}

function TableCell82() {
  return (
    <div className="absolute h-[53px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableCell">
      <TechnologistWorklist35 />
    </div>
  );
}

function Icon22() {
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
        <Icon22 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26302300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[72.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon23 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Edit</p>
      </div>
    </div>
  );
}

function TechnologistWorklist36() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[158.219px]" data-name="TechnologistWorklist">
      <Button11 />
      <Button12 />
    </div>
  );
}

function TableCell83() {
  return (
    <div className="absolute h-[53px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableCell">
      <TechnologistWorklist36 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#e5e5e5] border-b border-solid h-[53px] left-0 top-[265px] w-[1687.234px]" data-name="TableRow">
      <TableCell70 />
      <TableCell71 />
      <TableCell72 />
      <TableCell73 />
      <TableCell74 />
      <TableCell75 />
      <TableCell76 />
      <TableCell77 />
      <TableCell78 />
      <TableCell79 />
      <TableCell80 />
      <TableCell81 />
      <TableCell82 />
      <TableCell83 />
    </div>
  );
}

function TableCell84() {
  return <div className="absolute h-[52.5px] left-0 top-0 w-[24px]" data-name="TableCell" />;
}

function TableCell85() {
  return (
    <div className="absolute h-[52.5px] left-[24px] top-0 w-[92.977px]" data-name="TableCell">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16px]">UHID-45687</p>
    </div>
  );
}

function TechnologistWorklist37() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[100.383px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Elizabeth Martin</p>
    </div>
  );
}

function TableCell86() {
  return (
    <div className="absolute h-[52.5px] left-[116.98px] top-0 w-[130.258px]" data-name="TableCell">
      <TechnologistWorklist37 />
    </div>
  );
}

function TableCell87() {
  return (
    <div className="absolute h-[52.5px] left-[247.23px] top-0 w-[40.922px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px] w-[25px] whitespace-pre-wrap">34Y</p>
    </div>
  );
}

function TableCell88() {
  return (
    <div className="absolute h-[52.5px] left-[288.16px] top-0 w-[62.703px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">F</p>
    </div>
  );
}

function Badge24() {
  return (
    <div className="absolute border border-[#e5e5e5] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[40px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#0a0a0a] text-[12px] top-[2px]">MRI</p>
    </div>
  );
}

function TableCell89() {
  return (
    <div className="absolute h-[52.5px] left-[350.86px] top-0 w-[68.133px]" data-name="TableCell">
      <Badge24 />
    </div>
  );
}

function TechnologistWorklist38() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">MRI Brain with Contrast</p>
    </div>
  );
}

function TechnologistWorklist39() {
  return (
    <div className="absolute h-[16px] left-[8px] top-[28.5px] w-[234px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0">ACC-2024-010</p>
    </div>
  );
}

function TableCell90() {
  return (
    <div className="absolute h-[52.5px] left-[418.99px] top-0 w-[250px]" data-name="TableCell">
      <TechnologistWorklist38 />
      <TechnologistWorklist39 />
    </div>
  );
}

function TableCell91() {
  return (
    <div className="absolute h-[52.5px] left-[668.99px] top-0 w-[158.406px]" data-name="TableCell">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[8px] not-italic text-[#0a0a0a] text-[14px] top-[16.5px]">MRI Brain</p>
    </div>
  );
}

function TechnologistWorklist40() {
  return (
    <div className="absolute h-[16px] left-[8px] overflow-clip top-[18.5px] w-[184px]" data-name="TechnologistWorklist">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#737373] text-[12px] top-0 w-[218px] whitespace-pre-wrap">Persistent migraines, visual disturbances</p>
    </div>
  );
}

function TableCell92() {
  return (
    <div className="absolute h-[52.5px] left-[827.4px] top-0 w-[200px]" data-name="TableCell">
      <TechnologistWorklist40 />
    </div>
  );
}

function Badge25() {
  return (
    <div className="absolute bg-[#df2225] border border-[rgba(0,0,0,0)] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[54.023px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[12px] text-white top-[2px]">Urgent</p>
    </div>
  );
}

function TableCell93() {
  return (
    <div className="absolute h-[52.5px] left-[1027.4px] top-0 w-[75.367px]" data-name="TableCell">
      <Badge25 />
    </div>
  );
}

function Badge26() {
  return (
    <div className="absolute bg-[rgba(0,201,80,0.1)] border border-[#b9f8cf] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[69.375px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#008236] text-[12px] top-[2px]">Approved</p>
    </div>
  );
}

function TableCell94() {
  return (
    <div className="absolute h-[52.5px] left-[1102.77px] top-0 w-[121.82px]" data-name="TableCell">
      <Badge26 />
    </div>
  );
}

function Badge27() {
  return (
    <div className="absolute bg-[#f0fdf4] border border-[#b9f8cf] border-solid h-[22px] left-[8px] overflow-clip rounded-[5.2px] top-[15.5px] w-[67.367px]" data-name="Badge">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[8px] not-italic text-[#008236] text-[12px] top-[2px]">Assigned</p>
    </div>
  );
}

function TableCell95() {
  return (
    <div className="absolute h-[52.5px] left-[1224.59px] top-0 w-[132.727px]" data-name="TableCell">
      <Badge27 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-0 size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.pfcf2110} id="Vector" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p20933800} id="Vector_2" stroke="var(--stroke-0, #737373)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function TechnologistWorklist41() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[16.5px] w-[139.703px]" data-name="TechnologistWorklist">
      <Icon24 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#0a0a0a] text-[14px] top-0">Dr. Emily Rodriguez</p>
    </div>
  );
}

function TableCell96() {
  return (
    <div className="absolute h-[52.5px] left-[1357.31px] top-0 w-[155.703px]" data-name="TableCell">
      <TechnologistWorklist41 />
    </div>
  );
}

function Icon25() {
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

function Button13() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[78.094px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon25 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[52.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">View</p>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p38f39800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26302300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div className="bg-white h-[32px] relative rounded-[5.2px] shrink-0 w-[72.125px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon26 />
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[49.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-[6px]">Edit</p>
      </div>
    </div>
  );
}

function TechnologistWorklist42() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[32px] items-center justify-end left-[8px] top-[10.5px] w-[158.219px]" data-name="TechnologistWorklist">
      <Button13 />
      <Button14 />
    </div>
  );
}

function TableCell97() {
  return (
    <div className="absolute h-[52.5px] left-[1513.02px] top-0 w-[174.219px]" data-name="TableCell">
      <TechnologistWorklist42 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute h-[52.5px] left-0 top-[318px] w-[1687.234px]" data-name="TableRow">
      <TableCell84 />
      <TableCell85 />
      <TableCell86 />
      <TableCell87 />
      <TableCell88 />
      <TableCell89 />
      <TableCell90 />
      <TableCell91 />
      <TableCell92 />
      <TableCell93 />
      <TableCell94 />
      <TableCell95 />
      <TableCell96 />
      <TableCell97 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[370.5px] left-0 top-[40px] w-[1687.234px]" data-name="TableBody">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
    </div>
  );
}

function Table1() {
  return (
    <div className="h-[410.5px] relative shrink-0 w-full" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip pr-[-507.234px] relative shrink-0 w-full" data-name="Table">
      <Table1 />
    </div>
  );
}

function TechnologistWorklist() {
  return (
    <div className="relative rounded-[5.2px] shrink-0 w-full" data-name="TechnologistWorklist">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative w-full">
          <Table />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[24px] top-[84px] w-[1303.5px]">
      <Frame2 />
      <TechnologistWorklist />
    </div>
  );
}

function PrimitiveSpan5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[82.477px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">dd-mm-yy</p>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="calendar">
          <path clipRule="evenodd" d={svgPaths.p3ee18600} fill="var(--fill-0, #B3B3B4)" fillRule="evenodd" id="fill" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton12() {
  return (
    <div className="absolute bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between left-[190px] px-[21px] py-px rounded-[5.2px] top-[10px] w-[137px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan5 />
      <Calendar />
    </div>
  );
}

function PrimitiveSpan6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[82.477px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">dd-mm-yy</p>
      </div>
    </div>
  );
}

function Calendar1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="calendar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="calendar">
          <path clipRule="evenodd" d={svgPaths.p3ee18600} fill="var(--fill-0, #B3B3B4)" fillRule="evenodd" id="fill" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton13() {
  return (
    <div className="absolute bg-[#f3f3f5] content-stretch flex h-[36px] items-center justify-between left-[339px] px-[21px] py-px rounded-[5.2px] top-[10px] w-[137px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
      <PrimitiveSpan6 />
      <Calendar1 />
    </div>
  );
}

function PageHeader() {
  return (
    <div className="absolute bg-white h-[28px] left-[24px] top-[14px] w-[144.688px]" data-name="PageHeader">
      <p className="absolute font-['Arial:Bold',sans-serif] leading-[28px] left-0 not-italic text-[#0a0a0a] text-[18px] top-[0.5px]">Imaging Worklist</p>
    </div>
  );
}

function AppShell1() {
  return (
    <div className="absolute h-[723px] left-0 overflow-clip top-[41px] w-[1390px]" data-name="AppShell">
      <Frame />
      <PrimitiveButton12 />
      <PrimitiveButton13 />
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

function Icon27() {
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
      <Icon27 />
    </div>
  );
}

function Link1() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#737373] text-[14px] top-0">Technician</p>
      </div>
    </div>
  );
}

function BreadcrumbItem1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[71.35px] top-0 w-[66.156px]" data-name="BreadcrumbItem">
      <Link1 />
    </div>
  );
}

function Icon28() {
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
    <div className="absolute left-[147.51px] size-[14px] top-[3px]" data-name="BreadcrumbSeparator">
      <Icon28 />
    </div>
  );
}

function BreadcrumbPage() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="BreadcrumbPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#0a0a0a] text-[14px] top-0">Worklist</p>
      </div>
    </div>
  );
}

function BreadcrumbItem2() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-[171.51px] top-0 w-[49.523px]" data-name="BreadcrumbItem">
      <BreadcrumbPage />
    </div>
  );
}

function BreadcrumbList() {
  return (
    <div className="h-[20px] relative shrink-0 w-[221.031px]" data-name="BreadcrumbList">
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

function PrimitiveDiv() {
  return <div className="absolute bg-[#e5e5e5] h-0 left-[44px] top-[18px] w-px" data-name="Primitive.div" />;
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6026_1206)" id="Icon">
          <path d={svgPaths.p3adb3b00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 1.33333V2.66667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 13.3333V14.6667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22049780} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2ff5aa00} id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H2.66667" id="Vector_6" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 8H14.6667" id="Vector_7" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p19069f80} id="Vector_8" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p37cddcc0} id="Vector_9" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6026_1206">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[53px] rounded-[5.2px] size-[36px] top-0" data-name="Button">
      <Icon29 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[#e5e5e5] h-0 left-[97px] top-[18px] w-px" data-name="Primitive.div" />;
}

function GlobalHeader1() {
  return (
    <div className="absolute h-[20px] left-[44px] overflow-clip top-[8px] w-[88.703px]" data-name="GlobalHeader">
      <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[44.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-0">Rajesh Kumar</p>
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

function PrimitiveSpan7() {
  return (
    <div className="absolute content-stretch flex items-start left-[8px] overflow-clip rounded-[16777200px] size-[28px] top-[4px]" data-name="Primitive.span">
      <PrimitiveImg />
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute h-[36px] left-[106px] rounded-[5.2px] top-0 w-[140.703px]" data-name="Button">
      <GlobalHeader1 />
      <PrimitiveSpan7 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p388cb800} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p5baad20} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Badge28() {
  return (
    <div className="absolute bg-[#df2225] left-[24px] rounded-[5.2px] size-[16px] top-0" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] py-[3px] relative rounded-[inherit] size-full">
        <p className="font-['Arial:Regular',sans-serif] leading-[14.286px] not-italic relative shrink-0 text-[10px] text-center text-white">3</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[5.2px]" />
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute left-0 rounded-[5.2px] size-[36px] top-0" data-name="Button">
      <Icon30 />
      <Badge28 />
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PrimitiveDiv />
        <Button15 />
        <PrimitiveDiv1 />
        <Button16 />
        <Button17 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[890.266px] items-center px-[16px] relative size-full">
          <BreadcrumbList />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function GlobalHeader() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] content-stretch flex flex-col h-[41px] items-start left-0 pb-px top-0 w-[1390px]" data-name="GlobalHeader">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b border-solid inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}

function SidebarInset() {
  return (
    <div className="absolute bg-white h-[764px] left-[48px] overflow-clip top-0 w-[1390px]" data-name="SidebarInset">
      <AppShell1 />
      <GlobalHeader />
    </div>
  );
}

function AppShell() {
  return (
    <div className="absolute h-[764px] left-0 top-0 w-[1438px]" data-name="AppShell">
      <Sidebar />
      <SidebarInset />
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
    <div className="absolute h-[32px] left-[8px] top-[8px] w-[31px]" data-name="SidebarMenuItem">
      <SlotClone />
    </div>
  );
}

function Icon31() {
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
      <Icon31 />
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

function Icon32() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p368df400} id="Vector" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3a53aa80} id="Vector_2" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 7.33333H10.6667" id="Vector_3" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667H10.6667" id="Vector_4" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 7.33333H5.34" id="Vector_5" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 10.6667H5.34" id="Vector_6" stroke="var(--stroke-0, #171717)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function GlobalSidebar1() {
  return (
    <div className="h-[20px] relative shrink-0 w-0" data-name="GlobalSidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[#171717] text-[14px] top-0">Imaging Worklist</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute bg-[#f5f5f5] content-stretch flex gap-[8px] items-center left-0 overflow-clip pl-[8px] rounded-[5.2px] size-[32px] top-0" data-name="Link">
      <Icon32 />
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

function SidebarMenu() {
  return (
    <div className="h-[68px] relative shrink-0 w-[31px]" data-name="SidebarMenu">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <SidebarMenuItem1 />
        <SidebarMenuItem2 />
      </div>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="absolute content-stretch flex flex-col h-[668px] items-start left-0 overflow-clip pl-[8px] pt-[8px] top-[48px] w-[47px]" data-name="SidebarContent">
      <SidebarMenu />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p188b8380} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p11a5dbc0} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[40.5px] not-italic text-[#0a0a0a] text-[14px] text-center top-0">David Kumar</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="-translate-x-1/2 absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[28.5px] not-italic text-[#737373] text-[12px] text-center top-0">Technician</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text1 />
        <Text2 />
      </div>
    </div>
  );
}

function RoleSwitcher() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-center left-[16px] pr-[-24px] top-[8px] w-0" data-name="RoleSwitcher">
      <Icon33 />
      <Container4 />
    </div>
  );
}

function Button18() {
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
      <Button18 />
    </div>
  );
}

function SidebarMenuItem3() {
  return (
    <div className="absolute h-[32px] left-[8px] top-[724px] w-[31px]" data-name="SidebarMenuItem">
      <SlotClone1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[#fafafa] h-[764px] left-0 top-0 w-[47px]" data-name="Container">
      <SidebarMenuItem />
      <SidebarContent />
      <SidebarMenuItem3 />
    </div>
  );
}

function SidebarRail() {
  return <div className="absolute h-[764px] left-[39px] top-0 w-[16px]" data-name="SidebarRail" />;
}

function Sidebar1() {
  return (
    <div className="absolute border-[#e5e5e5] border-r border-solid h-[764px] left-0 top-0 w-[48px]" data-name="Sidebar">
      <Container3 />
      <SidebarRail />
      <div className="absolute h-0 left-[48px] top-[101px] w-[1390px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1390 1">
            <line id="Line 1" stroke="var(--stroke-0, #E5E5E5)" x2="1390" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function RadiologyV() {
  return (
    <div className="bg-white relative size-full" data-name="Radiology V1">
      <AppShell />
      <Sidebar1 />
    </div>
  );
}