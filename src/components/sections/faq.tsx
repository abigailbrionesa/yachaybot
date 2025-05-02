import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "¿YachayBot es realmente gratuito?",
    answer: "Sí, completamente. Nuestra misión es democratizar el acceso a los saberes ancestrales. Funciona sin costo en web y móvil, incluso con conexiones limitadas (tecnología offline-first).",
    value: "item-1",
  },
  {
    question: "¿Cómo garantizan la exactitud de los conocimientos que comparte el bot?",
    answer: "Todo contenido es validado por una red de ancianos, lingüistas y antropólogos de las comunidades originarias. Usamos IA con base de datos cerrada (RAG) para evitar distorsiones.",
    value: "item-2",
  },
  {
    question: "¿Puedo usar YachayBot en mi escuela rural sin internet estable?",
    answer: "¡Absolutamente! Diseñamos versiones SMS y PWA que funcionan con menos de 1MB/s de conexión. 87% de escuelas piloto en Cusco lo usan exitosamente (2024).",
    value: "item-3",
  },
  {
    question: "¿Por qué enfocarse en quechua y aimara si muchos hablan español?",
    answer: "El 63% de materiales educativos digitales ignoran lenguas originarias (MINEDU). Preservar estos idiomas es clave para la identidad cultural - nuestro NLP nativo evita traducciones colonialistas.",
    value: "item-4",
  },
  {
    question: "¿Cómo contribuye esto al Plan Perú 2050?",
    answer: "Cerramos 3 brechas clave: digital (ODS 9), educativa (ODS 4) y lingüística (ODS 10). Somos herramienta oficial para escuelas EIB y proyectos de innovación cultural sostenible.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          PREGUNTAS FRECUENTES
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Sabiduría ancestral, respuestas modernas
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent className="text-justify">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};