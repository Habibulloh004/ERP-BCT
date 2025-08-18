"use client";

import React, { useState } from "react";
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
  DialogOverlay, // agar sizning dialog.tsx export qilsa
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import ResetPasswordDialog from "./ResetPassword";
import Cookies from "js-cookie";

export default function LoginDialog() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)
  const [openR, setOpenR] = useState(false)
  const LoginValidation = z.object({
    phone: z
      .string()
      .min(3, t("login.error.phone"))
      .trim(),
    password: z.string().min(6, t("login.error.password")),
  });

  const form = useForm({
    resolver: zodResolver(LoginValidation),
    defaultValues: { phone: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    console.log(values);
    Cookies.set(
      "authData",
      JSON.stringify({
        ...values,
        accessToken: "dasfdasfsadfasdf",
        refreshToken: "dsafsadfasfsdf"
      }),
      { expires: 7, secure: true }
    ); setOpen(false)
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => { }}>
        <DialogTrigger asChild>
          <Button className={"pt-0 hidden"} variant="default">Войти</Button>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <DialogContent position="top" className="mt-20 z-50 w-full max-w-lg rounded-2xl border bg-white shadow-2xl gap-2">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t("login.title")}</DialogTitle>
            <DialogDescription className="sr-only">Введите логин и пароль</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-2 space-y-3"
            >
              <div className="flex flex-col gap-3">
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT} // sizning componentingiz
                  control={form.control}
                  name="phone"
                  label={t("login.form.label.phone")}
                  placeholder=""
                  inputClass="rounded-md border"
                />

                <CustomFormField
                  fieldType={FormFieldType.PASSWORDINPUT}
                  control={form.control}
                  name="password"
                  label={t("login.form.label.password")}
                  placeholder="******"
                  inputClass="rounded-md border text-black h-10 sm:h-11 md:h-12"
                />
              </div>

              <DialogFooter className="mt-2 flex justify-center items-center w-full">
                <Button type="submit" className=" px-8">
                  {t("login.submit")}
                </Button>
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span />
                  {t("login.form.fogotPassword.title")}
                  <button
                    type="button"
                    className="font-medium underline underline-offset-4"
                    onClick={() => { setOpenR(true) }}
                  >
                    {t("login.form.fogotPassword.submit")}
                  </button>
                </div>

              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ResetPasswordDialog open={openR} setOpen={setOpenR} />
    </>
  );
}
