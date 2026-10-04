import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { trackDelivery } from '../../services/deliveryService.js';

const statusSteps = ['pending', 'approved', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

function buildTimeline(apiResponse) {
  const req = apiResponse.request;
  const ship = apiResponse.shipment;
  const currentStatus = req.status === 'approved' && (!ship || ship.status === 'pending') ? 'approved' : ship?.status || req?.status || 'pending';
  const currentIdx = statusSteps.indexOf(currentStatus);
  return statusSteps.map((s, i) => {
    let desc = '';
    if (s === 'pending') desc = `Request ${req.trackingCode} received. Pickup: ${req.pickupAddress}`;
    if (s === 'approved') desc = 'Admin approved request, shipment created';
    if (s === 'picked_up') desc = ship?.driver ? `Rider ${ship.driver.name} picked up package` : 'Package picked up from sender';
    if (s === 'in_transit') desc = `Package moving from ${req.pickupAddress} to ${req.dropoffAddress}`;
    if (s === 'out_for_delivery') desc = 'The driver emails a delivery OTP to the customer. Delivery completes after the driver verifies it.';
    if (s === 'delivered') desc = ship?.updatedAt ? `Delivered at ${new Date(ship.updatedAt).toLocaleString()} with OTP verified` : 'Awaiting OTP confirmation';
    return { title: s.replaceAll('_', ' ').toUpperCase(), time: i <= currentIdx ? 'Done' : 'Pending', desc, done: i <= currentIdx };
  });
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialTrackingId = searchParams.get('code')?.toUpperCase() || '';
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) { setError('Enter your tracking ID'); return; }
    setError(''); setLoading(true);
    try {
      const apiResponse = await trackDelivery(trackingId.trim().toUpperCase());
      let finalStatus = 'pending';
      if (apiResponse.request.status === 'approved' && (!apiResponse.shipment || apiResponse.shipment.status === 'pending')) finalStatus = 'approved';
      else finalStatus = apiResponse.shipment?.status || apiResponse.request.status;

      const mappedOrder = {
        trackingCode: apiResponse.request.trackingCode,
        status: finalStatus,
        sender: apiResponse.request.pickupAddress,
        receiver: apiResponse.request.dropoffAddress,
        package: apiResponse.request.packageType,
        weight: apiResponse.request.packageWeight || apiResponse.request.weight,
        timeline: buildTimeline(apiResponse),
        rider: apiResponse.driver || apiResponse.shipment?.driver
          ? { name: apiResponse.driver?.name || apiResponse.shipment?.driver?.name || 'G71 Rider' }
          : null,
        raw: apiResponse,
      };
      setOrder(mappedOrder);
    } catch (err) {
      setError(err.message || 'Tracking ID not found. Check and try again.');
      setOrder(null);
    } finally { setLoading(false); }
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.status) : 0;

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="bg-black px-6 lg:px-20 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="text-red-500 font-bold text-[11px] tracking-[0.4em]">TRACK YOUR PACKAGE • LIVE ACROSS 36 STATES</p>
            <h1 className="font-cormorant text-white text-[40px] md:text-[64px] font-bold leading-[0.9] mt-4">TRACK YOUR<br />ORDER IN REAL TIME.</h1>
            <p className="text-white/60 mt-6 max-w-xl leading-relaxed">Enter your tracking ID to see rider details and OTP delivery status.</p>
          </motion.div>
          <motion.form onSubmit={handleTrack} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-10 bg-white rounded-2xl p-3 flex flex-col md:flex-row gap-3 max-w-2xl shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-5 py-3 bg-[#F5F5F0] rounded-xl">
              <Search className="w-5 h-5 text-black/40" />
              <input value={trackingId} onChange={(e) => setTrackingId(e.target.value.toUpperCase())} placeholder="ENTER TRACKING ID e.g. G71-839201" className="flex-1 bg-transparent outline-none text-[13px] font-bold tracking-widest placeholder:text-black/30" />
            </div>
            <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-bold text-[12px] tracking-widest px-10 py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'TRACKING...' : <>TRACK NOW <ArrowRight className="w-4 h-4" /></>}
            </button>
          </motion.form>
          {error && <p className="text-red-400 text-sm mt-4 font-bold">{error}</p>}
          <p className="text-white/30 text-[11px] tracking-widest mt-4">USE THE TRACKING ID FROM YOUR GUEST BOOKING</p>
        </div>
      </div>

      <AnimatePresence>
        {order && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="max-w-7xl mx-auto px-6 lg:px-20 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-black/10 rounded-2xl p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-red-600 font-bold text-[11px] tracking-widest">TRACKING ID: {order.trackingCode}</p>
                    <h3 className="font-cormorant text-3xl font-bold mt-2 flex items-center gap-3"><span className="w-3 h-3 bg-green-500 rounded-full animate-pulse inline-block" /> {order.status.replaceAll('_', ' ').toUpperCase()}</h3>
                  </div>
                  <div className="bg-[#F5F5F0] px-4 py-2 rounded-full text-[11px] font-bold tracking-widest">{order.package} {order.weight ? `• ${order.weight}KG` : ''}</div>
                </div>
                <div className="mt-10 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-black/10" />
                  <div className="absolute left-[11px] top-2 w-[2px] bg-red-600 transition-all" style={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
                  <div className="space-y-8 relative">
                    {order.timeline.map((step, i) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} key={i} className="flex gap-5">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-white ${step.done ? 'border-red-600 bg-red-600' : 'border-black/20'}`}>{step.done && <CheckCircle className="w-4 h-4 text-white" />}</div>
                        <div className={`flex-1 pb-2 ${!step.done ? 'opacity-50' : ''}`}>
                          <div className="flex flex-wrap justify-between gap-2"><p className="font-bold text-sm tracking-wide">{step.title}</p><p className="text-[11px] text-black/50 font-bold tracking-widest">{step.time}</p></div>
                          <p className="text-sm text-black/60 mt-1 leading-relaxed">{step.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <Link
                  to={`/track/${encodeURIComponent(order.trackingCode)}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-center text-[11px] font-bold tracking-widest text-white hover:bg-red-700"
                >
                  VIEW LIVE DRIVER MAP <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="bg-black text-white rounded-2xl p-6">
                  <p className="text-white/50 text-[11px] tracking-widest font-bold">RIDER ASSIGNED</p>
                  {order.rider ? (
                    <>
                      <div className="flex items-center gap-4 mt-4"><div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold">{order.rider.name[0]}</div><div><p className="font-bold text-sm">{order.rider.name}</p><p className="text-white/50 text-xs">G71 DRIVER</p></div></div>
                      <p className="mt-6 text-white/50 text-xs leading-relaxed">Open the live map for location updates. Customer and driver phone numbers are kept private.</p>
                    </>
                  ) : (<p className="text-white/60 text-sm mt-4 leading-relaxed">A driver appears here after assignment. A delivery OTP is emailed when the driver marks the package out for delivery.</p>)}
                </div>
                <div className="border border-black/10 rounded-2xl p-6 space-y-6">
                  <div><p className="text-black/40 text-[11px] font-bold tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> FROM</p><p className="font-bold mt-2 text-sm">{order.sender}</p></div>
                  <div className="h-[1px] bg-black/10" />
                  <div><p className="text-black/40 text-[11px] font-bold tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> TO</p><p className="font-bold mt-2 text-sm">{order.receiver}</p></div>
                  <div className="h-[1px] bg-black/10" />
                  <div className="flex flex-wrap justify-between gap-4"><div><p className="text-black/40 text-[11px] font-bold tracking-widest flex items-center gap-2"><Shield className="w-3 h-3" /> INSURED</p><p className="font-bold mt-2 text-sm">₦200,000</p></div><div><p className="text-black/40 text-[11px] font-bold tracking-widest flex items-center gap-2"><Clock className="w-3 h-3" /> ETA</p><p className="font-bold mt-2 text-sm">Provided after dispatch</p></div></div>
                </div>
                <div className="bg-[#F5F5F0] rounded-2xl p-6">
                  <p className="font-bold text-sm">Need help?</p>
                  <p className="text-black/60 text-sm mt-2 leading-relaxed">Chat with us on WhatsApp for instant support.</p>
                  <Link to="/contact" className="mt-4 inline-flex bg-black text-white px-5 py-3 rounded-lg text-[11px] font-bold tracking-widest">CONTACT SUPPORT</Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}