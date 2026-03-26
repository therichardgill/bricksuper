"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { TrafficLight } from "@/components/brand/traffic-light";
import { Disclaimer } from "@/components/brand/disclaimer";
import { Button } from "@/components/ui/button";
import { formatAUD, formatPercent } from "@/lib/utils";
import { calculateConcentration } from "@/lib/calculations";
import {
  ATO_CONCENTRATION_THRESHOLD,
  ATO_CONCENTRATION_SOURCE,
} from "@/lib/constants";
import { Plus, Trash2 } from "lucide-react";

const CHART_COLORS = [
  "#E8611A",
  "#1A7A4A",
  "#C4780E",
  "#3D3D4A",
  "#9B9BAA",
  "#F4924E",
  "#14542F",
  "#B03020",
];

interface AssetRow {
  id: string;
  label: string;
  value: number;
}

const DEFAULT_ASSETS: AssetRow[] = [
  { id: "aus-shares", label: "Australian shares", value: 200000 },
  { id: "intl-shares", label: "International shares", value: 150000 },
  { id: "cash-fixed", label: "Cash/Fixed interest", value: 100000 },
  { id: "existing-property", label: "Existing property", value: 0 },
];

let nextId = 1;

function InputField({
  label,
  value,
  onChange,
  prefix,
  onRemove,
  onLabelChange,
  removable,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  onRemove?: () => void;
  onLabelChange?: (v: string) => void;
  removable?: boolean;
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        {onLabelChange ? (
          <input
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Asset class name"
            className="block text-sm text-bs-mid mb-1.5 bg-transparent border-b border-dashed border-border focus:outline-none focus:border-bs-orange w-full"
          />
        ) : (
          <label className="block text-sm text-bs-mid mb-1.5">{label}</label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bs-muted text-sm">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            step={10000}
            min={0}
            className="w-full border border-border rounded-lg py-3 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-bs-orange focus:border-transparent"
          />
        </div>
      </div>
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="mb-1 p-2 text-bs-muted hover:text-bs-red transition-colors"
          aria-label={`Remove ${label}`}
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

export function DiversificationChecker() {
  const [assets, setAssets] = useState<AssetRow[]>(DEFAULT_ASSETS);
  const [proposedPrice, setProposedPrice] = useState(650000);
  const [result, setResult] = useState<ReturnType<
    typeof calculateConcentration
  > | null>(null);

  function updateAssetValue(id: string, value: number) {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, value } : a))
    );
    setResult(null);
  }

  function updateAssetLabel(id: string, label: string) {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, label } : a))
    );
    setResult(null);
  }

  function removeAsset(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    setResult(null);
  }

  function addAsset() {
    setAssets((prev) => [
      ...prev,
      { id: `custom-${nextId++}`, label: "", value: 0 },
    ]);
    setResult(null);
  }

  function handleCalculate() {
    const allocationInput = assets
      .filter((a) => a.label.trim() !== "")
      .map((a) => ({ label: a.label, value: a.value }));

    if (allocationInput.length === 0 || proposedPrice <= 0) return;

    const r = calculateConcentration(allocationInput, proposedPrice);
    setResult(r);
  }

  const preData = result
    ? result.prePurchase.filter((a) => a.value > 0)
    : null;
  const postData = result
    ? result.postPurchase.filter((a) => a.value > 0)
    : null;

  const concentrationChange = result
    ? result.propertyConcentrationPost - result.propertyConcentrationPre
    : 0;

  function getTrafficLevel(): "green" | "amber" | "red" {
    if (!result) return "green";
    if (result.propertyConcentrationPost > ATO_CONCENTRATION_THRESHOLD)
      return "red";
    if (result.propertyConcentrationPost >= 50) return "amber";
    return "green";
  }

  return (
    <div>
      <Disclaimer variant="tool" className="mb-8" />

      {/* Asset inputs */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-bs-charcoal">
          Current fund asset allocation
        </p>
        {assets.map((asset) => (
          <InputField
            key={asset.id}
            label={asset.label}
            value={asset.value}
            onChange={(v) => updateAssetValue(asset.id, v)}
            prefix="$"
            removable={assets.length > 1}
            onRemove={() => removeAsset(asset.id)}
            onLabelChange={
              asset.id.startsWith("custom-")
                ? (v) => updateAssetLabel(asset.id, v)
                : undefined
            }
          />
        ))}
        <button
          type="button"
          onClick={addAsset}
          className="flex items-center gap-1.5 text-sm text-bs-orange hover:text-bs-orange-dark transition-colors mt-2"
        >
          <Plus className="size-4" />
          Add asset class
        </button>
      </div>

      {/* Proposed purchase */}
      <div className="mb-6">
        <p className="text-sm font-medium text-bs-charcoal mb-3">
          Proposed property purchase
        </p>
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bs-muted text-sm">
            $
          </span>
          <input
            type="number"
            value={proposedPrice}
            onChange={(e) => {
              setProposedPrice(Number(e.target.value));
              setResult(null);
            }}
            step={10000}
            min={0}
            className="w-full border border-border rounded-lg py-3 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-bs-orange focus:border-transparent"
          />
        </div>
      </div>

      <Button onClick={handleCalculate} size="lg" className="w-full sm:w-auto">
        Check Diversification
      </Button>

      {/* Results */}
      {result && preData && postData && (
        <div className="mt-10 space-y-8">
          {/* Concentration metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-bs-muted mb-1">
                Property concentration (pre)
              </p>
              <p className="text-xl font-semibold text-bs-charcoal">
                {formatPercent(result.propertyConcentrationPre)}
              </p>
              <p className="text-xs text-bs-muted mt-1">
                of {formatAUD(result.totalPrePurchase)} total
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-bs-muted mb-1">
                Property concentration (post)
              </p>
              <p className="text-xl font-semibold text-bs-charcoal">
                {formatPercent(result.propertyConcentrationPost)}
              </p>
              <p className="text-xs text-bs-muted mt-1">
                of {formatAUD(result.totalPostPurchase)} total
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-bs-muted mb-1">Change</p>
              <p className="text-xl font-semibold text-bs-charcoal">
                +{formatPercent(concentrationChange)} pts
              </p>
              <p className="text-xs text-bs-muted mt-1">percentage points</p>
            </div>
          </div>

          {/* Pie charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-lg text-bs-charcoal mb-2 text-center">
                Pre-Purchase Allocation
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {preData.map((_, index) => (
                        <Cell
                          key={`pre-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatAUD(Number(value))}
                    />
                    <Legend
                      formatter={(value: string) => (
                        <span className="text-xs text-bs-mid">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg text-bs-charcoal mb-2 text-center">
                Post-Purchase Allocation
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={postData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {postData.map((_, index) => (
                        <Cell
                          key={`post-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatAUD(Number(value))}
                    />
                    <Legend
                      formatter={(value: string) => (
                        <span className="text-xs text-bs-mid">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Traffic light flags */}
          <div className="space-y-3">
            {getTrafficLevel() === "red" && (
              <TrafficLight
                level="red"
                flag="High single-asset concentration"
                description={`Post-purchase property concentration of ${formatPercent(result.propertyConcentrationPost)} exceeds ${ATO_CONCENTRATION_THRESHOLD}%. The ATO wrote to 17,700 funds with this level of concentration in 2019.`}
                source={ATO_CONCENTRATION_SOURCE}
              />
            )}
            {getTrafficLevel() === "amber" && (
              <TrafficLight
                level="amber"
                flag="Above median concentration"
                description="Above median concentration. Your investment strategy needs to document why this allocation is appropriate for your fund."
              />
            )}
            {getTrafficLevel() === "green" && (
              <TrafficLight
                level="green"
                flag="Diversification within common ranges"
                description="Within commonly observed diversification ranges."
              />
            )}
          </div>

          {/* SIS Regulation note */}
          <p className="text-xs text-bs-muted italic leading-relaxed">
            Diversification is a consideration under SIS Regulation 4.09. No law
            prevents holding 90%+ in one asset class — the obligation is to
            consider and document the rationale.
          </p>

          {/* CTA */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-sm text-bs-mid mb-3">
              An investment strategy documents your fund&apos;s asset allocation
              rationale.
            </p>
            <Button asChild variant="ghost">
              <a href="/smsf-investment-strategy">
                Learn about investment strategy requirements →
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
