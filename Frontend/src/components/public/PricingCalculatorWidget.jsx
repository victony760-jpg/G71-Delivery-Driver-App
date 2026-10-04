import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function PricingCalculatorWidget() {
  const [weight, setWeight] = useState(2);
  const [route, setRoute] = useState('intra');
  const price = useMemo(
    () => (route === 'intra' ? 2500 + weight * 350 : 5500 + weight * 600),
    [weight, route],
  );

  return (
    <div className="bg-white rounded-[28px] p-8 border border-black/5 shadow-[0_20px_80px_rgba(0,0,0,0.06)]">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-[11px] tracking-[0.3em] text-black/40">
            ESTIMATOR
          </p>
          <h3 className="font-cormorant text-[32px] font-bold mt-2 leading-none">
            Pricing
          </h3>
        </div>
        <p className="text-[10px] font-bold tracking-widest bg-[#F5F5F0] px-3 py-1.5 rounded-full">
          INSURED
        </p>
      </div>
      <div className="mt-8 space-y-7">
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F5F5F0] rounded-full">
          <button
            onClick={() => setRoute('intra')}
            className={`py-3 rounded-full font-bold text-[11px] tracking-widest transition-all ${route === 'intra' ? 'bg-black text-white shadow' : 'text-black/50'}`}
          >
            LAGOS INTRA
          </button>
          <button
            onClick={() => setRoute('inter')}
            className={`py-3 rounded-full font-bold text-[11px] tracking-widest transition-all ${route === 'inter' ? 'bg-black text-white shadow' : 'text-black/50'}`}
          >
            INTERSTATE
          </button>
        </div>
        <div>
          <div className="flex justify-between">
            <label className="text-[11px] font-bold tracking-widest">
              PACKAGE WEIGHT
            </label>
            <span className="text-[11px] font-bold bg-black text-white px-2.5 py-1 rounded-full">
              {weight} KG
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={weight}
            onChange={(e) => setWeight(+e.target.value)}
            className="w-full mt-4 accent-black h-1 bg-black/10 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold tracking-widest text-black/30">
            <span>1KG</span>
            <span>20KG</span>
          </div>
        </div>
        <div className="bg-black text-white rounded-[20px] p-6 flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="text-white/40 text-[10px] tracking-[0.2em] font-bold">
              ESTIMATED FEE
            </p>
            <p className="font-cormorant text-[36px] font-bold leading-none mt-2">
              ₦{price.toLocaleString()}
            </p>
            <p className="text-white/40 text-[10px] mt-2">
              + Free ₦200k insurance
            </p>
          </div>
          <Link
            to="/request-delivery"
            className="bg-white text-black px-6 py-3 rounded-full font-bold text-[11px] tracking-widest hover:bg-zinc-100 transition"
          >
            SHIP NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
