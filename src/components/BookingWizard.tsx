"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { classNames, formatDisplayDate, formatDuration, formatPrice } from "@/lib/utils";
import { Sparkle } from "./Sparkles";

type Service = {
  id: string;
  title: string;
  slug: string;
  durationMins: number;
  price: number | null;
  category: string;
};

const STEPS = ["Service", "Date", "Time", "Your Info", "Review"] as const;

export function BookingWizard({ preselectedSlug }: { preselectedSlug?: string }) {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: Service[]) => {
        setServices(data);
        if (preselectedSlug) {
          const match = data.find((s) => s.slug === preselectedSlug);
          if (match) setServiceId(match.id);
        }
      })
      .finally(() => setLoadingServices(false));
  }, [preselectedSlug]);

  const selectedService = services.find((s) => s.id === serviceId) || null;

  function goNext() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return !!serviceId;
      case 1:
        return !!date;
      case 2:
        return !!time;
      case 3:
        return fullName.trim().length > 1 && phone.trim().length > 5 && /\S+@\S+\.\S+/.test(email);
      default:
        return true;
    }
  }, [step, serviceId, date, time, fullName, phone, email]);

  async function handleConfirm() {
    if (!serviceId || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, time, fullName, phone, email, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try another time.");
        setSubmitting(false);
        return;
      }
      setConfirmedId(data.appointment.id);
    } catch {
      setSubmitError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedId) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
          <Check size={28} />
        </div>
        <h2 className="mt-6 text-3xl text-ink">Appointment Requested</h2>
        <p className="mt-3 text-muted">
          Thank you, {fullName.split(" ")[0]}. We've received your request for{" "}
          <strong className="text-ink">{selectedService?.title}</strong> on{" "}
          <strong className="text-ink">{date && formatDisplayDate(date)}</strong> at{" "}
          <strong className="text-ink">{time}</strong>. You'll receive a confirmation email once
          our team approves it.
        </p>
        <p className="mt-2 text-xs text-muted">Reference: {confirmedId}</p>
        <a href="/" className="btn-primary mt-8 inline-flex">Back to Home</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <div className="mb-12 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div
              className={classNames(
                "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                i < step && "border-brand bg-brand text-white",
                i === step && "border-brand-dark bg-surface text-brand-dark",
                i > step && "border-line bg-surface text-muted"
              )}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            <span className={classNames("mt-2 hidden text-center text-xs sm:block", i === step ? "text-ink" : "text-muted")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="mt-4 hidden h-px w-full bg-line sm:block" />}
          </div>
        ))}
      </div>

      <div className="card-lux p-8 md:p-12">
        {step === 0 && (
          <StepService
            services={services}
            loading={loadingServices}
            selectedId={serviceId}
            onSelect={setServiceId}
          />
        )}
        {step === 1 && serviceId && (
          <StepDate serviceId={serviceId} date={date} onSelect={setDate} />
        )}
        {step === 2 && serviceId && date && (
          <StepTime serviceId={serviceId} date={date} time={time} onSelect={setTime} />
        )}
        {step === 3 && (
          <StepInfo
            fullName={fullName}
            phone={phone}
            email={email}
            notes={notes}
            setFullName={setFullName}
            setPhone={setPhone}
            setEmail={setEmail}
            setNotes={setNotes}
          />
        )}
        {step === 4 && (
          <StepReview
            service={selectedService}
            date={date}
            time={time}
            fullName={fullName}
            phone={phone}
            email={email}
            notes={notes}
          />
        )}

        {submitError && (
          <p className="mt-6 rounded-xl2 bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink disabled:opacity-0"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={goNext} disabled={!canProceed} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleConfirm} disabled={submitting} className="btn-primary">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkle size={14} />}
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepService({
  services,
  loading,
  selectedId,
  onSelect,
}: {
  services: Service[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (loading) return <p className="text-center text-muted">Loading services…</p>;
  return (
    <div>
      <h2 className="text-2xl text-ink">Choose a Service</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={classNames(
              "rounded-xl2 border p-4 text-left transition-colors",
              selectedId === s.id ? "border-brand bg-bg-soft" : "border-line hover:border-brand"
            )}
          >
            <p className="font-medium text-ink">{s.title}</p>
            <p className="mt-1 text-xs text-muted">
              {formatDuration(s.durationMins)} {s.price !== null && `· ${formatPrice(s.price)}`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDate({
  serviceId,
  date,
  onSelect,
}: {
  serviceId: string;
  date: string | null;
  onSelect: (d: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ year: String(viewYear), month: String(viewMonth) });
    fetch(`/api/availability?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setUnavailable(data.unavailableDates || []))
      .finally(() => setLoading(false));
  }, [viewYear, viewMonth]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  const todayIso = today.toISOString().slice(0, 10);

  return (
    <div>
      <h2 className="text-2xl text-ink">Choose a Date</h2>
      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="rounded-full border border-line p-2 hover:border-brand">
          <ChevronLeft size={16} />
        </button>
        <p className="font-medium text-ink">{monthLabel}</p>
        <button onClick={() => changeMonth(1)} className="rounded-full border border-line p-2 hover:border-brand">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1.5 text-center text-xs text-muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = `${viewYear}-${(viewMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
          const isPast = iso < todayIso;
          const isUnavailable = unavailable.includes(iso) || isPast;
          const isSelected = date === iso;
          return (
            <button
              key={iso}
              disabled={isUnavailable || loading}
              onClick={() => onSelect(iso)}
              className={classNames(
                "aspect-square rounded-lg text-sm transition-colors",
                isSelected && "bg-brand text-white",
                !isSelected && !isUnavailable && "hover:bg-bg-soft text-ink",
                isUnavailable && "cursor-not-allowed text-line"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepTime({
  serviceId,
  date,
  time,
  onSelect,
}: {
  serviceId: string;
  date: string;
  time: string | null;
  onSelect: (t: string) => void;
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ date, serviceId });
    fetch(`/api/availability?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []))
      .finally(() => setLoading(false));
  }, [date, serviceId]);

  return (
    <div>
      <h2 className="text-2xl text-ink">Choose a Time</h2>
      <p className="mt-1 text-sm text-muted">{formatDisplayDate(date)}</p>
      {loading ? (
        <p className="mt-6 text-muted">Checking availability…</p>
      ) : slots.length === 0 ? (
        <p className="mt-6 text-muted">No times available on this date — please choose another day.</p>
      ) : (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {slots.map((s) => (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={classNames(
                "rounded-xl2 border py-2.5 text-sm transition-colors",
                time === s ? "border-brand bg-brand text-white" : "border-line hover:border-brand"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StepInfo({
  fullName, phone, email, notes, setFullName, setPhone, setEmail, setNotes,
}: {
  fullName: string; phone: string; email: string; notes: string;
  setFullName: (v: string) => void; setPhone: (v: string) => void; setEmail: (v: string) => void; setNotes: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl text-ink">Your Information</h2>
      <div className="mt-6 space-y-4">
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full rounded-full border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notes (optional)" className="w-full rounded-xl2 border border-line px-5 py-3 text-sm outline-none focus:border-brand" />
      </div>
    </div>
  );
}

function StepReview({
  service, date, time, fullName, phone, email, notes,
}: {
  service: Service | null; date: string | null; time: string | null;
  fullName: string; phone: string; email: string; notes: string;
}) {
  const rows = [
    ["Service", service?.title],
    ["Date", date ? formatDisplayDate(date) : ""],
    ["Time", time],
    ["Duration", service ? formatDuration(service.durationMins) : ""],
    ["Price", service?.price ? formatPrice(service.price) : "Provided at consultation"],
    ["Name", fullName],
    ["Phone", phone],
    ["Email", email],
    ["Notes", notes || "—"],
  ] as const;

  return (
    <div>
      <h2 className="text-2xl text-ink">Review Your Appointment</h2>
      <dl className="mt-6 divide-y divide-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between py-3 text-sm">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
