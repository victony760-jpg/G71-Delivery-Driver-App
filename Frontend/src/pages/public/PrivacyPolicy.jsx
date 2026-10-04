export default function Privacy() {
  return (
    <div className="bg-white">
      <div className="bg-black px-6 lg:px-20 pt-36 pb-20">
        <p className="text-red-500 font-bold text-[11px] tracking-[0.4em]">
          LEGAL • UPDATED 2026
        </p>
        <h1 className="font-cormorant text-white text-[56px] font-bold leading-[0.9] mt-6">
          Privacy Policy
        </h1>
        <p className="text-white/60 mt-4">
          Contact: MAHORAGA123455@gmail.com • 08038445230
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-6 lg:px-20 py-16 prose prose-sm max-w-none">
        <div className="space-y-10 text-sm leading-relaxed text-black/70">
          <section>
            <h3 className="font-cormorant text-2xl font-bold text-black">
              1. Data We Collect
            </h3>
            <p className="mt-3">
              We collect name, phone, pickup and dropoff addresses,
              package details, OTP confirmations, photo proof, rider NIN, and
              payment records for delivery execution.
            </p>
          </section>
          <section>
            <h3 className="font-cormorant text-2xl font-bold text-black">
              2. How We Use
            </h3>
            <p className="mt-3">
              To assign riders, track deliveries at /track-order, provide proof
              of delivery, improve ETA, and for insurance claims up to ₦200k.
            </p>
          </section>
          <section>
            <h3 className="font-cormorant text-2xl font-bold text-black">
              3. Sharing
            </h3>
            <p className="mt-3">
              We share only pickup/dropoff and phone with assigned verified
              rider. No selling of data. The administator may share data with law enforcement if required by law.
            </p>
          </section>
          <section>
            <h3 className="font-cormorant text-2xl font-bold text-black">
              4. Your Rights
            </h3>
            <p className="mt-3">
              You can request deletion by emailing MAHORAGA123455@gmail.com.
              Tracking data kept 90 days for disputes.
            </p>
          </section>
          <section>
            <h3 className="font-cormorant text-2xl font-bold text-black">
              5. Contact
            </h3>
            <p className="mt-3">
              For privacy questions call 08038445230 or email
              MAHORAGA123455@gmail.com. Office: 12a Admiralty Way, Lekki Phase
              1.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
