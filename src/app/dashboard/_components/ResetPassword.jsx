"use client";

import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomFormField, { FormFieldType } from "@/components/shared/customFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// shadcn/ui OTP
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

import { useTranslation } from "react-i18next";

/** Mock API — o'zingiznikiga almashtiring */
async function apiSendOtp(phone) {
  await new Promise((r) => setTimeout(r, 400));
  return { success: true };
}
async function apiVerifyOtp({ phone, otp }) {
  await new Promise((r) => setTimeout(r, 400));
  return { success: otp === "123456" };
}
async function apiResetPassword({ phone, otp, newPassword }) {
  await new Promise((r) => setTimeout(r, 400));
  return { success: true };
}

export default function ResetPasswordDialog({ open, setOpen }) {
  const { t } = useTranslation();

  const [step, setStep] = useState("phone"); // "phone" | "otp" | "new"
  const [loading, setLoading] = useState(false);

  // resend OTP timer
  const [countdown, setCountdown] = useState(0);
  const canResend = countdown === 0;

  useEffect(() => {
    if (!countdown) return;
    const id = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  /** Zod schema’lar — resetPassword.* kalitlari bilan */
  const phoneSchema = z.object({
    phone: z
      .string()
      .min(3, t("resetPassword.form.errors.phoneRequired") || "Phone is required")
      .trim(),
  });

  const otpSchema = phoneSchema.extend({
    otp: z
      .string()
      .regex(/^\d{6}$/, t("resetPassword.form.errors.otpRequired") || "Enter 6-digit code"),
  });

  const newPassSchema = otpSchema
    .extend({
      newPassword: z
        .string()
        .min(6, t("resetPassword.form.errors.passwordMin") || "Minimum 6 characters"),
      confirmPassword: z
        .string()
        .min(6, t("resetPassword.form.errors.passwordMin") || "Minimum 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("resetPassword.form.errors.passwordMatch") || "Passwords must match",
    });

  const resolver = useMemo(() => {
    if (step === "phone") return zodResolver(phoneSchema);
    if (step === "otp") return zodResolver(otpSchema);
    return zodResolver(newPassSchema);
  }, [step]);

  const form = useForm({
    resolver,
    defaultValues: { phone: "", otp: "", newPassword: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      if (step === "phone") {
        const res = await apiSendOtp(values.phone);
        if (res?.success) {
          setStep("otp");
          setCountdown(60);
        } else {
          form.setError("phone", { message: t("resetPassword.form.errors.phoneRequired") || "Phone is required" });
        }
      } else if (step === "otp") {
        const res = await apiVerifyOtp({ phone: values.phone, otp: values.otp });
        if (res?.success) {
          setStep("new");
        } else {
          form.setError("otp", { message: t("resetPassword.messages.invalidOtp") || "Invalid verification code" });
        }
      } else if (step === "new") {
        const res = await apiResetPassword({
          phone: values.phone,
          otp: values.otp,
          newPassword: values.newPassword,
        });
        if (res?.success) {
          // muvaffaqiyat xabari -> toast bo'lsa shu yerda
          setOpen(false);
        } else {
          form.setError("newPassword", { message: t("resetPassword.form.errors.server") || "Server error" });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    const phone = form.getValues("phone");
    if (!phone) {
      form.setError("phone", { message: t("resetPassword.form.errors.phoneRequired") || "Phone is required" });
      return;
    }
    setLoading(true);
    try {
      const res = await apiSendOtp(phone);
      if (res?.success) setCountdown(60);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => { }}>
      <DialogTrigger asChild>
        <Button className="hidden" variant="default">Reset</Button>
      </DialogTrigger>

      <DialogOverlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=open]:animate-in" />

      <DialogContent
        mark={"true"}
        handleClose={() => { setOpen(false) }}
        position={"top"}
        className="mt-20 z-50 w-full max-w-lg rounded-2xl border bg-white shadow-2xl gap-2"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === "phone" && (t("resetPassword.phoneStepTitle") || "Enter phone number")}
            {step === "otp" && (t("resetPassword.otpStepTitle") || "Enter verification code")}
            {step === "new" && (t("resetPassword.newPassStepTitle") || "Enter new password")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("resetPassword.title") || "Reset password"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
            {/* Step 1: PHONE */}
            {step === "phone" && (
              <div className="flex flex-col gap-3">
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label={t("resetPassword.form.label.phone")}
                  placeholder=""
                  inputClass="rounded-md border"
                />
              </div>
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <div className="flex flex-col gap-4">
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label={t("resetPassword.form.label.phone")}
                  inputClass="rounded-md border"
                  readOnly
                />

                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t("resetPassword.form.label.otp") || "Verification code"}</FormLabel>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={(val) => {
                          const onlyDigits = (val || "").replace(/\D/g, "");
                          field.onChange(onlyDigits);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-center justify-between text-sm">
                  <span className="opacity-70">
                    {(t("resetPassword.messages.codeSentTo") || "Code sent to") + ": "}{form.getValues("phone")}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!canResend || loading}
                    onClick={handleResend}
                  >
                    {canResend
                      ? (t("resetPassword.form.buttons.resendCode") || "Resend code")
                      : `${t("resetPassword.form.buttons.resendIn") || "Resend in"} ${countdown}s`}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: NEW PASSWORD */}
            {step === "new" && (
              <div className="flex flex-col gap-3">
                <FormField control={form.control} name="otp" render={({ field }) => <input type="hidden" {...field} />} />

                <CustomFormField
                  fieldType={FormFieldType.PASSWORDINPUT}
                  control={form.control}
                  name="newPassword"
                  label={t("resetPassword.form.label.newPassword") || "New password"}
                  placeholder="******"
                  inputClass="text-black rounded-md border h-10 sm:h-11 md:h-12"
                />
                <CustomFormField
                  fieldType={FormFieldType.PASSWORDINPUT}
                  control={form.control}
                  name="confirmPassword"
                  label={t("resetPassword.form.label.confirmPassword") || "Confirm password"}
                  placeholder="******"
                  inputClass="text-black rounded-md border h-10 sm:h-11 md:h-12"
                />
              </div>
            )}

            <DialogFooter className="mt-2 flex justify-center items-center w-full gap-2">
              <Button type="submit" className="px-8" disabled={loading}>
                {step === "phone" && (t("resetPassword.form.buttons.sendCode") || "Send code")}
                {step === "otp" && (t("resetPassword.form.buttons.verifyCode") || "Verify")}
                {step === "new" && (t("resetPassword.form.buttons.resetPassword") || "Reset password")}
              </Button>

              {step !== "phone" && (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={loading}
                  onClick={() => setStep("phone")}
                >
                  {t("login.haveAcc")?.trim() || t("resetPassword.title") || "Back"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
