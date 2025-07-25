"use client";
import { Github, Menu } from "lucide-react";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";

interface RouteProps {
  href: string;
  label: string;
}

export const Navbar = () => {
  const t = useTranslations("NavBar");

  const routeList: RouteProps[] = [
    {
      href: "/#benefits",
      label: t("benefits"),
    },
    {
      href: "/#services",
      label: t("services"),
    },
    {
      href: "/#contact",
      label: t("contact"),
    },
    {
      href: "/#faq",
      label: t("faq"),
    },
  ];

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const userName = session?.user?.name?.split(" ")[0];
  return (
    <header
      className="shadow-inner bg-opacity-15
    mx-auto border border-secondary fixed w-full
    z-40 flex justify-between items-center p-2 px-5 bg-card"
    >
      <Link href="/" className="font-bold text-lg flex items-center mr-5">
        <Image
          src="/images/logo/yachaybot_logo2.png"
          alt="logo"
          width={100}
          height={100}
          className="h-auto mr-4 w-auto max-w-10"
        />
        YachayBot
      </Link>

      <NavigationMenu className="hidden lg:block mr-auto ">
        <NavigationMenuList className="flex">
          <NavigationMenuItem className="flex">
            {routeList.map(({ href, label }) => (
              <NavigationMenuLink key={href} asChild>
                <Link href={href} className="text-base px-2">
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
          <Button className="font-bold bg-[#ed9238] hover:bg-[#ffa347da]">
            <Link href="/ai-bot">{t("chat")}</Link>
          </Button>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/images/logo/yachaybot_logo2.png"
                      alt="logo"
                      width={100}
                      height={100}
                      className="h-auto mr-4 w-auto max-w-10"
                    />
                    YACHAYBOT
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                ))}
                <Button
                  onClick={() => setIsOpen(false)}
                  asChild
                  variant="ghost"
                  className="justify-start text-base font-bold bg-[#ed9238] hover:bg-[#ffa347da]"
                >
                  <Link href="/ai-bot">{t("chat")}</Link>
                </Button>
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start gap-4">
              <Separator className="mb-2" />
              <div className="flex flex-col w-full gap-2">
                <ToggleTheme />
                
                {status === "loading" ? (
                  <Button disabled>...</Button>
                ) : status === "authenticated" ? (
                  <div className="flex flex-col items-start space-y-3">
                    <p className="text-sm pl-3">
                      {t("greeting", { userName: userName || "" })}
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      aria-label="Sign Out"
                      onClick={() => {
                        setIsOpen(false);
                        signOut();
                      }}
                      className="w-full justify-start"
                    >
                      <p>{t("signOut")}</p>
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    size="sm"
                    variant="default"
                    aria-label="Sign In"
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/sign-in");
                    }}
                    className="w-full justify-start"
                  >
                    <p>{t("signIn")}</p>
                  </Button>
                )}

                <Button 
                  asChild 
                  size="sm" 
                  variant="outline" 
                  aria-label="View on GitHub"
                  className="w-full justify-start"
                >
                  <Link
                    href="https://github.com/abigailbrionesa/yachaybot"
                    target="_blank"
                    onClick={() => setIsOpen(false)}
                  >
                    <Github className="size-5 mr-2" /> {t("viewOnGithub")}
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex space-x-3">
        <ToggleTheme />

        {status === "loading" ? (
          <Button disabled>...</Button>
        ) : status === "authenticated" ? (
          <div className="flex items-center space-x-3">
            <p className="text-sm">
              {t("greeting", { userName: userName || "" })}
            </p>
            <Button
              asChild
              size="sm"
              variant="outline"
              aria-label="Sign Out"
              onClick={() => signOut()}
            >
              <p>{t("signOut")}</p>
            </Button>
          </div>
        ) : (
          <Button
            asChild
            size="sm"
            variant="default"
            aria-label="Sign In"
            onClick={() => router.push("/sign-in")}
          >
            <p>{t("signIn")}</p>
          </Button>
        )}

        <Button asChild size="sm" variant="outline" aria-label="View on GitHub">
          <Link
            href="https://github.com/abigailbrionesa/yachaybot"
            target="_blank"
          >
            <Github className="size-5" /> {t("viewOnGithub")}
          </Link>
        </Button>
      </div>
    </header>
  );
};