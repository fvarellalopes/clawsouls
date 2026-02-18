import React from "react";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    type="button"
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Button.displayName = "Button";

const ButtonPrimary = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    className={cn(
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 focus-visible:ring-primary",
      className
    )}
    ref={ref}
    {...props}
  />
));
ButtonPrimary.displayName = "ButtonPrimary";

const ButtonSecondary = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    className={cn(
      "border-input bg-background hover:bg-accent hover:text-accent-foreground active:border-input active:bg-input disabled:hover:bg-background disabled:active:border-input disabled:active:bg-input",
      className
    )}
    ref={ref}
    {...props}
  />
));
ButtonSecondary.displayName = "ButtonSecondary";

const ButtonOutline = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    className={cn(
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:border-input active:bg-input disabled:hover:bg-background disabled:active:border-input disabled:active:bg-input",
      className
    )}
    ref={ref}
    {...props}
  />
));
ButtonOutline.displayName = "ButtonOutline";

const ButtonDestructive = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    className={cn(
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:bg-destructive/50 focus-visible:ring-destructive",
      className
    )}
    ref={ref}
    {...props}
  />
));
ButtonDestructive.displayName = "ButtonDestructive";

const ButtonGhost = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    className={cn(
      "rounded-md border-0 bg-transparent px-0 text-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/50 focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:hover:bg-transparent disabled:active:bg-transparent disabled:text-muted",
      className
    )}
    ref={ref}
    {...props}
  />
));
ButtonGhost.displayName = "ButtonGhost";

const ButtonLink = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    className={cn(
      "rounded-md border-0 bg-transparent px-0 text-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/50 focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:hover:bg-transparent disabled:active:bg-transparent disabled:text-muted",
      className
    )}
    ref={ref}
    {...props}
  />
));
ButtonLink.displayName = "ButtonLink";

export {
  Button,
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  ButtonDestructive,
  ButtonGhost,
  ButtonLink,
};
