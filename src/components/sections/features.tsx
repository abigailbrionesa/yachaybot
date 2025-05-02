import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import { Laptop, BadgeCheck, Goal, PictureInPicture, MousePointerClick, Newspaper } from "lucide-react";
interface FeaturesProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: Laptop,
    title: "Funciona sin Internet",
    description:
      "Tecnología offline-first: accesible via SMS y navegadores básicos para comunidades con baja conectividad (60% zonas rurales según INEI).",
  },
  {
    icon: BadgeCheck,
    title: "Saberes Validados",
    description:
      "Contenido certificado por ancianos y antropólogos - 0% hallucinations. Base de datos ética con 1,200+ conocimientos ancestrales documentados.",
  },
  {
    icon: Goal,
    title: "Multilingüe Ancestral",
    description:
      "NLP nativo en quechua/aimara (no traducciones). Primer modelo para lenguas aglutinantes con 94% de precisión en pilotos (Cusco 2024).",
  },
  {
    icon: PictureInPicture,
    title: "Interfaz Cultural",
    description:
      "Diseño co-creado con comunidades: iconografía andina y patrones de diálogo tipo 'Yachachiq' (sabio que enseña).",
  },
  {
    icon: MousePointerClick,
    title: "Impacto Medible",
    description:
      "87% engagement en escuelas EIB (vs. 35% apps genéricas). 70% de usuarios comparten conocimientos con sus familias.",
  },
  {
    icon: Newspaper,
    title: "Alianza ODS",
    description:
      "Contribuye directamente a 3 Objetivos de Desarrollo Sostenible: Educación de calidad (4), Innovación (9) y Reducción de desigualdades (10).",
  },
];


export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        INNOVACIÓN CON RAÍCES
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Tecnología que Honra la Sabiduría Andina
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Combinamos IA de vanguardia con metodologías interculturales validadas por comunidades quechuas y aimaras. Más que un chatbot, es un puente generacional.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {featureList.map(({ icon: IconComponent, title, description }) => (
  <div key={title}>
    <Card className="h-full bg-background border-0 shadow-none">
      <CardHeader className="flex flex-col justify-center items-center">
        <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
          <IconComponent
            size={24}
          />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-center">
        {description}
      </CardContent>
    </Card>
  </div>
))}

      </div>
    </section>
  );
};
