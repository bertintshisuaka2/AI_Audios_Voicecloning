import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const CORRECT_PIN = "1234"; // Default PIN - can be changed

interface PinLoginProps {
  onSuccess: () => void;
}

export default function PinLogin({ onSuccess }: PinLoginProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Check if PIN is complete
    if (index === 3 && value) {
      const enteredPin = newPin.join("");
      if (enteredPin === CORRECT_PIN) {
        toast.success("Access granted!");
        onSuccess();
      } else {
        toast.error("Incorrect PIN");
        // Clear PIN
        setPin(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const newPin = pastedData.split("");
      setPin(newPin);
      inputRefs[3].current?.focus();
      
      // Check PIN
      if (pastedData === CORRECT_PIN) {
        toast.success("Access granted!");
        onSuccess();
      } else {
        toast.error("Incorrect PIN");
        setPin(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/logo.png" 
              alt="Divalaser" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg shadow-white/50" 
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Divalaser Software Solutions</h1>
            <p className="text-gray-200/80 mt-2">Voice TTS & Clone Platform</p>
          </div>
        </div>

        {/* PIN Entry Card */}
        <Card className="bg-black/50 border-white/30 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/10 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Enter PIN</CardTitle>
            <CardDescription className="text-gray-200/60">
              Enter your 4-digit PIN to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4" onPaste={handlePaste}>
              {pin.map((digit, index) => (
                <Input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-2xl font-bold bg-black/50 border-white/50 text-white focus:border-white focus:ring-white"
                />
              ))}
            </div>
            <p className="text-xs text-center text-gray-200/40 mt-6">
              Default PIN: 1234
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-200/40 text-sm">
          © 2025 Divalaser Software Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}
