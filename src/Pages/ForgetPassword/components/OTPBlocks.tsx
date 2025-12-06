import React, { useRef } from "react";

interface OTPProps {
    value: string;
    onChange: (value: string) => void;
}

export default function OTPBlocks({ value, onChange }: OTPProps) {
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (val: string, index: number) => {
        const newOtp = value.split("");
        newOtp[index] = val.slice(-1);
        const joined = newOtp.join("");
        onChange(joined);

        if (val && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-3 justify-center">
            {Array.from({ length: 6 }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputs.current[index] = el;
                        return;
                    }}
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="
                    w-12 h-12 text-center text-xl font-semibold
                    border rounded-xl
                    border-(--color-light-primary) focus:border-(--color-light-accent)
                    outline-none
                    bg-(--color-light-primary) shadow-sm
                    "
                />
            ))}
        </div>
    );
}
