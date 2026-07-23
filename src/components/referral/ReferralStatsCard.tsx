type ReferralStatsCardProps = {
  stats: {
    redemptionCount: number;
    totalNetRevenue: number;
    totalPartnerShare: number;
  };
  revenueSharePercent: number;
};

/** Referral earnings summary for the make-money section. */
export function ReferralStatsCard({ stats, revenueSharePercent }: ReferralStatsCardProps) {
  if (stats.redemptionCount === 0 && stats.totalPartnerShare === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#7DD3C0]/35 bg-[#E8FAF6]/50 p-4">
      <p className="text-sm font-medium text-charcoal">Your earnings</p>
      <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-charcoal-muted">Referrals</dt>
          <dd className="mt-1 font-serif text-xl text-charcoal">{stats.redemptionCount}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-charcoal-muted">Revenue</dt>
          <dd className="mt-1 font-serif text-xl text-charcoal">
            ${stats.totalNetRevenue.toFixed(0)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-charcoal-muted">Your share</dt>
          <dd className="mt-1 font-serif text-xl text-[#0D9488]">
            ${stats.totalPartnerShare.toFixed(0)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] text-charcoal-muted">
        {revenueSharePercent}% share · paid monthly to your email
      </p>
    </div>
  );
}
