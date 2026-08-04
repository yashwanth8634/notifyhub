"use client";
import React, { useEffect, useRef, useState } from "react";
import type { Role } from "@/types";
import { ChevronDown } from "lucide-react";

type Props = {
  value: Role;
  onChange: (r: Role) => void;
  className?: string;
  roles?: Role[];
};

export default function RoleSelect({
  value,
  onChange,
  className = "",
  roles,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [openUp, setOpenUp] = useState(false);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const btn = ref.current?.querySelector("button");
    if (!btn) return;
    const rect = (btn as HTMLElement).getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 240; // approx max-h-56
    setOpenUp(spaceBelow < dropdownHeight + 12);
  }, [open]);

  const defaultRoles: Role[] = [
    "super_admin",
    "principal",
    "dean",
    "hod",
    "faculty",
    "student",
  ];
  const availableRoles = roles && roles.length ? roles : defaultRoles;

  const label = (r: Role) =>
    r.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full text-left px-4 py-3 bg-[#151515]/70 border border-white/10 rounded-xl flex items-center justify-between"
      >
        <span className="text-white">{label(value)}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <ul
          className={`absolute z-50 w-full bg-[#0f0f0f] border border-white/10 rounded-xl shadow-lg max-h-56 overflow-auto ${openUp ? "bottom-full mb-2" : "mt-2"}`}
        >
          {availableRoles.map((r) => (
            <li key={r}>
              <button
                type="button"
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 ${r === value ? "text-purple-300 font-semibold" : "text-white"}`}
              >
                {label(r)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
