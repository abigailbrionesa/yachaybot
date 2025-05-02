"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2 bg-primary/10 border-primary">
            <span className="mr-2 text-primary">
              <Badge className="bg-primary text-white">Innovación</Badge>
            </span>
            <span>Patente pendiente en NLP para lenguas indígenas</span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Conecta con saberes ancestrales en
              <span className="text-transparent px-2 bg-gradient-to-r from-[#2E7D32] to-[#8BC34A] bg-clip-text">
                tu lengua materna
              </span>
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            El primer chatbot educativo que preserva conocimientos indígenas en quechua, aimara y español - validado por ancianos y comunidades.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow bg-[#2E7D32] hover:bg-[#1B5E20]">
              Probar YachayBot
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold border-primary text-primary hover:bg-primary/10"
            >
              <Link
                href="#impacto"
              >
                Ver impacto
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-[#8BC34A]/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary border-t-primary/30"
            src={
              theme === "light"
                ? "/yachaybot-hero-light.jpg" // Sugiero imágenes de: 1) Joven rural usando el bot, 2) Interfaz multilingüe, o 3) Comunidad validando saberes
                : "/yachaybot-hero-dark.jpg"
            }
            alt="YachayBot en acción: interfaz trilingüe mostrando diálogo en quechua sobre agricultura ancestral"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};