/*
 * The phone body shared by the dashboard section and the photo story, so the one that flies between them
 * matches exactly. Adapted from Great UI's Mobile Mockup (great-ui.com). Children = the screen (300 × 620 design).
 */
export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[clamp(30px,3.6vw,46px)] bg-[#0b0f1c] p-[3.2%] shadow-[0_40px_80px_-30px_rgba(10,20,48,0.6),inset_0_0_0_1px_rgba(255,255,255,0.1)]">
      <span className="absolute -left-[1.5%] top-[18%] h-[6%] w-[1.5%] rounded-l bg-[#1d2438]" />
      <span className="absolute -left-[1.5%] top-[27%] h-[9%] w-[1.5%] rounded-l bg-[#1d2438]" />
      <span className="absolute -right-[1.5%] top-[24%] h-[12%] w-[1.5%] rounded-r bg-[#1d2438]" />
      <div className="relative overflow-hidden rounded-[clamp(24px,3vw,38px)]">
        <span className="absolute left-1/2 top-[1.6%] z-10 h-[3.6%] w-[32%] -translate-x-1/2 rounded-full bg-[#0b0f1c]" />
        {children}
      </div>
    </div>
  );
}
