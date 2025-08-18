import { Input } from "../ui/input";
import PhoneInput from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import { PasswordInput } from "../ui/password-input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DatePicker } from "../ui/date-picker";

export const FormFieldType = {
  INPUT: "input",
  PASSWORDINPUT: "passwordInput",
  TEXTAREA: "textarea",
  PHONE_INPUT: "phoneInput",
  CHECKBOX: "checkbox",
  DATE_PICKER: "datePicker",
  SELECT: "select",
  SKELETON: "skeleton",
  CURRENCY: "currency",
};

const RenderInput = ({ field, className, props, rules }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <Input
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""} // Ensure the input is controlled
            className={cn(
              "textBig focus:border-white/50",
              props.className,
              className
            )}
          />
        </FormControl>
      );
    case FormFieldType.NUMBER:
      return (
        <FormControl>
          <Input
            type="number"
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""} // Ensure the input is controlled
            className={cn(
              "textBig focus:border-white/50",
              props.className,
              className
            )}
          />
        </FormControl>
      );
    case FormFieldType.PASSWORDINPUT:
      return (
        <FormControl>
          <PasswordInput
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""} // Ensure the input is controlled
            className={cn(
              "textBig focus:border-white/50",
              props.className,
              className
            )}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                field.onChange(value); // Faqat raqam qabul qilish
              }
            }}
          />
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            value={field.value || ""} // Ensure the textarea is controlled
            className={cn(
              "shad-textArea focus:border-white/50",
              props.className,
              className
            )}
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <FormControl>
          <DatePicker
            value={field.value || null}
            onChange={(date) => {
              field.onChange(date);
            }}
            startYear={props.startYear || 1900}
            endYear={props.endYear || new Date().getFullYear()}
          />
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            value={field.value || ""} // Ensure the select is controlled
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "shad-select-trigger border-b-2 border-border",
                  props.className,
                  className
                )}
              >
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn("shad-select-content z-[99999]")}>
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="UZ"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value || ""} // Ensure the phone input is controlled
            onChange={field.onChange}
            className={cn("input-phone rounded-md", props.className, className)}
            style={{ borderColor: "transparent" }} // or borderColor: 'initial' to reset
            countryCallingCodeEditable={false}
            focusInputOnCountrySelection
          />
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props) => {
  const { control, name, label, inputClass, optional, labelClass } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1 flex flex-col">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className={cn("text-black text-sm", labelClass)}>
              {label}{" "}
              {optional && (
                <span className="text-[12px] text-black/50">{optional}</span>
              )}
            </FormLabel>
          )}
          <RenderInput
            className={cn(
              "text-white text-xs lg:text-base bg-transparent",
              inputClass
            )}
            field={field}
            props={props}
          />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
