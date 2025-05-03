"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const HeroSection = () => {
    const t = useTranslations("Hero");
  
  return (
    <section className="container w-full">
    <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
      <div className="text-center space-y-8">
        <Badge variant="outline" className="text-sm py-2 bg-primary/10 border-primary">
          <span className="mr-2 text-primary">
            <Badge className="bg-primary">{t("badge.innovation")}</Badge>
          </span>
          <span>{t("badge.text")}</span>
        </Badge>

        <div className="max-w-screen-md mx-auto text-center font-bold">
          <h1>
            <span className="text-4xl xl:text-6xl">{t("title.part1")}</span>
            <span className="text-transparent text-4xl xl:text-6xl px-2 bg-gradient-to-r from-[#2E7D32] to-[#8BC34A] bg-clip-text">
              {t("title.part2")}
            </span>
          </h1>
        </div>

        <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
          {t("description")}
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/ai-bot">
            <Button size={"lg"} className="font-bold group/arrow bg-[#ed9238] hover:bg-[#ffa347da]">
              {t("button")}
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>
            </Link>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-[#8BC34A]/50 rounded-full blur-3xl"></div>
          <Image
            width={1900}
            height={1900}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary border-t-primary/30"
            src={"https://nuestrodesafioclimatico.minam.gob.pe/wp-content/uploads/2024/12/1055724-cop-29.jpg"
            }
            alt="YachayBot en acción: interfaz trilingüe mostrando diálogo en quechua sobre agricultura ancestral"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};