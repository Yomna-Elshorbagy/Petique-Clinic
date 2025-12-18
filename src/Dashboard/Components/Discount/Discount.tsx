import { Switch } from "@headlessui/react";
import { Plus, Gift, Users, Zap, TrendingUp } from "lucide-react";

import type { IDiscount } from "../../../Interfaces/IdiscountInterface";
import { useDiscounts, useToggleDiscount } from "../../../Hooks/Discount/useDiscoumt";

/* ================= HELPERS ================= */

const isExpired = (d: IDiscount) =>
  d.expire ? new Date(d.expire) < new Date() : false;

const appliesToLabel = (d: IDiscount) => {
  if (d.appliesTo === "ALL") return "All Products";
  if (d.appliesTo === "CATEGORIES") return "Selected Categories";
  return "Selected Products";
};

const DiscountIcon = ({ type }: { type: string }) => {
  const cls = "text-[var(--color-light-accent)]";
  switch (type) {
    case "FLASH":
      return <Zap className={cls} size={20} />;
    case "BOGO":
      return <Gift className={cls} size={20} />;
    case "FIRST_ORDER":
      return <Users className={cls} size={20} />;
    case "BULK":
      return <TrendingUp className={cls} size={20} />;
    default:
      return <Gift className={cls} size={20} />;
  }
};

/* ================= COMPONENT ================= */

export default function AutomaticDiscounts() {
  const { data: discounts, isLoading } = useDiscounts();
  const toggle = useToggleDiscount();

  if (isLoading) return null;

  return (
    <section className="animate-soft p-6 rounded-2xl bg-[var(--color-bg-light)] border border-[var(--color-border-light)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">
            Automatic Discounts
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Discounts applied automatically at checkout
          </p>
        </div>

        <button className="action-btn btn-export">
          <Plus size={16} />
          Add Automatic Discount
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discounts?.map((d) => {
          const expired = isExpired(d);
          const disabled = expired || d.isDeleted;

          return (
            <div
              key={d._id}
              className={`p-5 rounded-2xl border bg-[var(--color-bg-lighter)]
              border-[var(--color-border-light)]
              ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              {/* Top */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-lighter)]
                    flex items-center justify-center">
                    <DiscountIcon type={d.type} />
                  </div>

                  <div>
                    <h3 className="font-semibold">{d.name}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {d.type.replace("_", " ")}
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                <Switch
                  checked={d.isActive}
                  disabled={disabled}
                  onChange={() => toggle.mutate(d._id)}
                  className={`relative h-6 w-11 rounded-full transition
                    ${
                      d.isActive
                        ? "bg-[var(--color-light-accent)]"
                        : "bg-[var(--color-border-medium)]"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 bg-white rounded-full transform transition
                      ${d.isActive ? "translate-x-6" : "translate-x-1"}`}
                  />
                </Switch>
              </div>

              {/* Bottom */}
              <div className="mt-6 flex justify-between">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Applies to
                  </p>
                  <p className="font-medium">
                    {appliesToLabel(d)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Uses
                  </p>
                  <p className="font-semibold">{d.uses ?? 0}</p>
                </div>
              </div>

              {expired && (
                <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full
                  bg-red-100 text-red-600">
                  Expired
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
