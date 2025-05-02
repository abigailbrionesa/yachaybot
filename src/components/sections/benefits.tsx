import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}
const benefitList: BenefitsProps[] = [
  {
    icon: "Blocks",
    title: "Saberes Validados",
    description: "Acceso a conocimientos ancestrales certificados por ancianos y lingüistas, con un 93% de precisión cultural en pruebas piloto.",
  },
  {
    icon: "LineChart",
    title: "Educación Intercultural",
    description: "Herramienta preferida por docentes EIB: 70% mejora en engagement estudiantil versus materiales tradicionales (Cusco, 2023).",
  },
  {
    icon: "Wallet",
    title: "Tecnología Inclusiva",
    description: "Funciona con conexiones limitadas (hasta 1MB/s) y en 3 idiomas: quechua, aimara y español.",
  },
  {
    icon: "Sparkle",
    title: "Puente Generacional",
    description: "87% de jóvenes usuarios comparten conocimientos con sus familias, revitalizando la transmisión oral tradicional.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">IMPACTO MEDIBLE</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tecnología que Preserva Identidades
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Combinamos innovación de punta con sabiduría ancestral para crear soluciones que:
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                 {/*<Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    color="hsl(var(--primary))"
                    className="mb-6 text-primary"
                  /> */} 
                  <span className="text-5xl text-primary font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
