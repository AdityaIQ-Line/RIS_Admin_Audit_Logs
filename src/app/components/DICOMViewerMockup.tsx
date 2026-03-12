import * as React from "react"

interface DICOMViewerMockupProps {
  modality: "CT" | "MRI" | "X-Ray"
  patientName: string
  uhid: string
  age: number
  gender: string
  dob: string
  studyDate: string
  studyDescription: string
  accessionNumber: string
  imageNumber?: number
  totalImages?: number
}

export function DICOMViewerMockup({
  modality,
  patientName,
  uhid,
  age,
  gender,
  dob,
  studyDate,
  studyDescription,
  accessionNumber,
  imageNumber = 1,
  totalImages = 1,
}: DICOMViewerMockupProps) {
  // Chest X-ray image URL
  const chestXrayUrl = "https://images.unsplash.com/photo-1584555684040-bad07f46a21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdCUyMHhyYXklMjBtZWRpY2FsfGVufDF8fHx8MTc2ODMwMDk0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* Medical Image Display */}
      {modality === "X-Ray" ? (
        /* Actual chest X-ray image for X-Ray modality */
        <div className="relative w-full h-full">
          <img 
            src={chestXrayUrl} 
            alt="Chest X-Ray" 
            className="w-full h-full object-contain"
            style={{ filter: 'invert(1)' }}
          />
        </div>
      ) : (
        /* SVG mockup for CT and MRI */
        <div className="relative w-full max-w-2xl aspect-square">
          {/* Gradient background to simulate medical scan - more subtle */}
          <div className="absolute inset-0 bg-gradient-radial from-gray-800 via-gray-900 to-black">
            {/* Simulated anatomical structures based on modality - cleaner lines */}
            {modality === "MRI" && (
              <svg viewBox="0 0 400 400" className="w-full h-full opacity-30">
                {/* Brain outline mockup - cleaner */}
                <ellipse cx="200" cy="200" rx="130" ry="150" fill="none" stroke="#888" strokeWidth="1.5" />
                <ellipse cx="200" cy="200" rx="110" ry="130" fill="none" stroke="#777" strokeWidth="1" />
                <path d="M 70 200 Q 130 185 190 200 T 330 200" fill="none" stroke="#666" strokeWidth="0.8" />
                <circle cx="155" cy="185" r="12" fill="none" stroke="#666" strokeWidth="0.8" />
                <circle cx="245" cy="185" r="12" fill="none" stroke="#666" strokeWidth="0.8" />
              </svg>
            )}
            
            {modality === "CT" && (
              <svg viewBox="0 0 400 400" className="w-full h-full opacity-35">
                {/* Chest CT mockup - cleaner concentric circles */}
                <ellipse cx="200" cy="200" rx="140" ry="130" fill="none" stroke="#999" strokeWidth="1.5" />
                <ellipse cx="200" cy="200" rx="115" ry="105" fill="none" stroke="#888" strokeWidth="1.2" />
                <circle cx="200" cy="200" r="35" fill="none" stroke="#777" strokeWidth="1.5" />
                <ellipse cx="145" cy="185" rx="30" ry="45" fill="none" stroke="#777" strokeWidth="1.2" />
                <ellipse cx="255" cy="185" rx="30" ry="45" fill="none" stroke="#777" strokeWidth="1.2" />
              </svg>
            )}

            {/* Subtle noise overlay for realistic medical image texture */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
            }} />
          </div>

          {/* Measurement lines (sample annotations) - cleaner */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <line x1="160" y1="250" x2="240" y2="250" stroke="#00ff00" strokeWidth="1" opacity="0.5" />
            <text x="200" y="245" fill="#00ff00" fontSize="9" textAnchor="middle" opacity="0.5">45.2 mm</text>
            <circle cx="190" cy="220" r="2.5" fill="#ffff00" opacity="0.6" />
          </svg>
        </div>
      )}

      {/* Top Left Overlay - Patient Info */}
      <div className="absolute top-4 left-4 text-white/75 text-[11px] space-y-0.5 font-mono select-none">
        <p className="font-semibold text-white/85">{patientName}</p>
        <p className="text-white/60">{uhid}</p>
        <p>{age}Y / {gender}</p>
        <p className="text-white/50 text-[10px]">{dob}</p>
      </div>

      {/* Top Right Overlay - Study Info */}
      <div className="absolute top-4 right-4 text-white/75 text-[11px] text-right space-y-0.5 font-mono select-none">
        <p className="font-semibold text-white/85">{studyDate}</p>
        <p className="text-white/60 text-[10px]">{studyDescription}</p>
        <p className="text-white/50">{modality}</p>
        <p className="text-white/50 text-[10px]">ACC: {accessionNumber}</p>
      </div>

      {/* Bottom Left Overlay - Technical Info */}
      <div className="absolute bottom-4 left-4 text-white/50 text-[9px] font-mono select-none space-y-0.5">
        <p>W: 2014 L: 1057</p>
        <p>Zoom: 100%</p>
      </div>

      {/* Bottom Right Overlay - Image Number */}
      <div className="absolute bottom-4 right-4 text-white/50 text-[9px] font-mono select-none text-right space-y-0.5">
        <p>Img {imageNumber}/{totalImages}</p>
        <p>512 × 512</p>
      </div>

      {/* Orientation Markers - subtle */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/30 text-xs font-mono select-none">
        <p>A</p>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-white/30 text-xs font-mono select-none">
        <p>P</p>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono select-none">
        <p>S</p>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono select-none">
        <p>I</p>
      </div>

      {/* Crosshair (optional, for alignment) - very subtle */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 400 400">
        <line x1="200" y1="0" x2="200" y2="400" stroke="white" strokeWidth="0.3" strokeDasharray="5,5" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="0.3" strokeDasharray="5,5" />
      </svg>
    </div>
  )
}