import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useParams } from 'react-router-dom';
import api from '../../services/api.js';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});

function FollowDriver({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, Math.max(map.getZoom(), 14));
  }, [map, position]);
  return null;
}

export default function TrackShipment() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [now, setNow] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchTracking = () => {
      api
        .get(`/shipments/track/${encodeURIComponent(id)}`)
        .then(({ data: response }) => {
          if (active) {
            setData(response);
            setError('');
            setNow(Date.now());
          }
        })
        .catch((trackingError) => {
          if (active)
            setError(
              trackingError.response?.data?.message || 'Tracking ID not found',
            );
        });
    };
    fetchTracking();
    const interval = setInterval(fetchTracking, 10_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  const driverPosition = data?.driver?.lastLocation;
  const hasDriverPosition =
    Number.isFinite(Number(driverPosition?.lat)) &&
    Number.isFinite(Number(driverPosition?.lng));
  const position = hasDriverPosition
    ? [Number(driverPosition.lat), Number(driverPosition.lng)]
    : null;

  if (!data && !error)
    return <div className="p-10 text-center">Loading tracking {id}...</div>;
  if (!data && error)
    return (
      <div className="p-10 text-center">
        <p role="alert" className="font-bold text-red-600">
          {error}
        </p>
        <p className="mt-2 text-sm text-black/60">Check tracking code: {id}</p>
      </div>
    );

  const trackingId = data.trackingId || id;
  const status = data.status || data.shipment?.status || 'pending';
  const pickupAddress = data.pickupAddress || data.request?.pickupAddress;
  const deliveryAddress = data.deliveryAddress || data.request?.dropoffAddress;
  const packageDescription =
    data.packageDescription || data.request?.packageType;
  const history = data.history || data.shipment?.history || [];

  const lastSeen = data?.driver?.lastSeen
    ? new Date(data.driver.lastSeen)
    : null;
  const currentTime = now ?? lastSeen?.getTime() ?? 0;
  const isStale = !lastSeen || currentTime - lastSeen.getTime() > 2 * 60 * 1000;
  const minutesAgo = lastSeen
    ? Math.floor((currentTime - lastSeen.getTime()) / 60000)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black px-6 pb-10 pt-32 lg:px-20 lg:pt-36">
        <p className="text-[11px] font-bold tracking-[0.3em] text-red-500">
          LIVE TRACKING · G71 LOGISTICS
        </p>
        <h1 className="mt-3 break-words text-3xl font-bold text-white sm:text-4xl">
          Tracking {trackingId}
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Status:{' '}
          <span className="font-bold text-white">
            {status.replaceAll('_', ' ').toUpperCase()}
          </span>{' '}
          · Refreshes every 10 seconds
        </p>
      </header>

      {error && (
        <p className="mx-auto max-w-7xl px-6 pt-5 text-sm text-red-700 lg:px-20">
          Latest location could not refresh: {error}
        </p>
      )}

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-20 lg:py-10">
        <section className="h-[360px] overflow-hidden rounded-2xl border border-black/10 sm:h-[440px] lg:h-[540px]">
          {position ? (
            <MapContainer
              center={position}
              zoom={14}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FollowDriver position={position} />
              <Marker position={position}>
                <Popup>
                  <strong>{data.driver?.name || 'Driver'}</strong>
                  <br />
                  {data.driver?.isOnline && !isStale
                    ? 'Live location'
                    : 'Last known location'}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="grid h-full place-items-center bg-[#F5F5F0] px-6 text-center">
              <p className="max-w-sm text-sm font-semibold text-black/50">
                Driver location is not available yet. The map will update when
                the driver shares their location.
              </p>
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="border border-black/10 p-5 sm:rounded-xl sm:p-6">
            <p className="text-[11px] font-bold tracking-widest">DRIVER</p>
            {data.driver ? (
              <div className="space-y-3">
                <div className="mt-4 flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-black text-white font-bold">
                    {data.driver.name?.[0]?.toUpperCase() || 'D'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold">{data.driver.name}</p>
                    <p
                      className={`mt-1 text-xs ${data.driver.isOnline && !isStale ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {data.driver.isOnline && !isStale
                        ? '● Online - Live'
                        : `● Offline${minutesAgo !== null ? ` - ${minutesAgo}m ago` : ''}`}
                    </p>
                  </div>
                </div>
                {isStale && (
                  <p className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800">
                    Driver location is stale. Map shows last known position.
                    Browser tracking requires driver app to stay open.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-black/55">
                Driver not assigned yet.
              </p>
            )}
          </section>

          <section className="border border-black/10 p-5 sm:rounded-xl sm:p-6">
            <p className="text-[11px] font-bold tracking-widest">ROUTE</p>
            <p className="mt-4 text-sm">
              <strong>From:</strong> {pickupAddress || 'Not available'}
            </p>
            <p className="mt-2 text-sm">
              <strong>To:</strong> {deliveryAddress || 'Not available'}
            </p>
            <p className="mt-2 text-sm">
              <strong>Package:</strong> {packageDescription || 'Not specified'}
            </p>
          </section>

          <section className="rounded-xl bg-black p-5 text-white sm:p-6">
            <p className="text-[11px] tracking-widest text-white/45">
              TIMELINE
            </p>
            <div className="mt-4 space-y-4">
              {history.length ? (
                history.map((item, index) => (
                  <div
                    key={item._id || `${item.status}-${index}`}
                    className="flex gap-3"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-600" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {item.status?.replaceAll('_', ' ')}
                      </p>
                      {item.location && (
                        <p className="text-xs text-white/60">{item.location}</p>
                      )}
                      {item.createdAt && (
                        <p className="mt-1 text-xs text-white/40">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-white/60">No history yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
