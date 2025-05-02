import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Acceso Multilingüe Ancestral",
    description:
      "Interacción fluida en quechua, aimara y español con saberes validados por ancianos y lingüistas. Tecnología offline-first para zonas rurales.",
    pro: 0,
  },
  {
    title: "Educación Intercultural EIB",
    description:
      "Herramientas para docentes bilingües con contenidos alineados al currículo nacional y saberes locales. Reduce 15% la deserción escolar (UNICEF).",
    pro: 0,
  },
  {
    title: "Preservación Ética de Saberes",
    description: "IA con corpus cerrado y validado por comunidades indígenas. Zero hallucinations, 100% fuentes ancestrales certificadas.",
    pro: 1,
  },
  {
    title: "Conexión Generacional",
    description: "Puente digital entre jóvenes urbanos y sabios rurales. 87% de engagement en pilotos (Cusco, 2024).",
    pro: 1,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        IMPACTO MEDIBLE
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Tecnología que Preserva Futuros
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Combinamos innovación de punta con metodologías ancestrales para cerrar brechas educativas y digitales en 3 ejes clave.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              INNOVACIÓN
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
