import React from "react";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

const InputPassword = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="password"
    autoComplete="current-password"
    className={cn(
      "password:text-sm password:font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputPassword.displayName = "InputPassword";

const InputSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="search"
    className={cn(
      "search:text-sm search:font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputSearch.displayName = "InputSearch";

const InputTel = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="tel"
    className={cn(
      "tel:text-sm tel:font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputTel.displayName = "InputTel";

const InputEmail = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="email"
    autoComplete="email"
    className={cn(
      "email:text-sm email:font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputEmail.displayName = "InputEmail";

const InputUrl = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="url"
    className={cn(
      "url:text-sm url:font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputUrl.displayName = "InputUrl";

const InputNumber = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="number"
    className={cn(
      "input-number-text-sm input-number-font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputNumber.displayName = "InputNumber";

const InputDate = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="date"
    className={cn(
      "input-date-text-sm input-date-font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputDate.displayName = "InputDate";

const InputTime = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="time"
    className={cn(
      "input-time-text-sm input-time-font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputTime.displayName = "InputTime";

const InputDateTimeLocal = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="datetime-local"
    className={cn(
      "input-datetime-local-text-sm input-datetime-local-font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputDateTimeLocal.displayName = "InputDateTimeLocal";

const InputWeek = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="week"
    className={cn(
      "input-week-text-sm input-week-font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputWeek.displayName = "InputWeek";

const InputMonth = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="month"
    className={cn(
      "input-month-text-sm input-month-font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputMonth.displayName = "InputMonth";

const InputColor = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    type="color"
    className={cn(
      "input-color-text-sm input-color-font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
));
InputColor.displayName = "InputColor";

export {
  Input,
  InputPassword,
  InputSearch,
  InputTel,
  InputEmail,
  InputUrl,
  InputNumber,
  InputDate,
  InputTime,
  InputDateTimeLocal,
  InputWeek,
  InputMonth,
  InputColor,
};
