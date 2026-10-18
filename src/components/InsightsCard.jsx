export default function InsightsCard({ onAdd }) {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[24px] border border-[#231D27] bg-[#0E0C10] px-6 py-8 text-center">
      <h3 className="text-[15px] font-semibold text-[#F4EFF6]">Decisions Powered by Data</h3>
      <p className="mt-2.5 max-w-[250px] text-[11.5px] leading-relaxed text-[#7A7080]">
        Pindah dari sekadar mencatat. Biarkan insight berbasis AI menuntun strategi keuanganmu setiap hari.
      </p>

      <button
        onClick={onAdd}
        className="relative z-10 mt-6 rounded-full bg-[#A37B9D] px-5 py-2 text-[11.5px] font-medium text-white transition hover:bg-[#B78FB1]"
      >
        Catat Transaksi Baru
      </button>

      {/* Semi-circle spotlight glow tepat di bawah tombol CTA */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-56 -translate-x-1/2 translate-y-[58%] rounded-full bg-[#C9A6C1] opacity-30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-[#8A5F84] opacity-25 blur-3xl" />
    </section>
  )
}
