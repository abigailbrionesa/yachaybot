import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}
const plans: PlanProps[] = [
  {
    title: "Comunidad",
    popular: 0,
    price: 0,
    description: "Acceso básico para preservar tu herencia cultural",
    buttonText: "Únete Gratis",
    benefitList: [
      "Acceso a 5 saberes ancestrales/día",
      "Consultas en quechua/aimara/español",
      "Base de datos comunitaria",
      "Soporte por correo electrónico",
      "1 consulta mensual a ancianos validadores"
    ],
  },
  {
    title: "Educador EIB",
    popular: 1,
    price: 9, // Precio simbólico para docentes
    description: "Para escuelas bilingües y promotores culturales",
    buttonText: "Acceso Prioritario",
    benefitList: [
      "Consultas ilimitadas",
      "Materiales didácticos descargables",
      "Capacitación mensual en IA intercultural",
      "Soporte prioritario (48h)",
      "Acceso a red de docentes EIB",
      "Validación directa con expertos"
    ],
  },
  {
    title: "Aliado Institucional",
    popular: 0,
    price: 120,
    description: "Para ONGs, ministerios y organizaciones",
    buttonText: "Solicitar Demo",
    benefitList: [
      "API para integración en plataformas",
      "Dashboard de impacto comunitario",
      "Capacitación personalizada",
      "Soporte 24/7 con expertos culturales",
      "Acceso a base de datos etnográfica",
      "White-label para proyectos sociales"
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        MODELO ÉTICO
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Tecnología que devuelve valor a sus raíces
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        El 100% de los ingresos se reinvierte en validación comunitaria y acceso rural
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlan?.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
