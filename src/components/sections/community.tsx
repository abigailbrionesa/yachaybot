import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const CommunitySection = () => {
  return (
    <section id="community" style={{
      backgroundImage: 'url("https://canal21huancayo.com/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-17-at-5.38.07-PM-2-1024x614.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <hr className="border-secondary" />
      <div className="container py-20 sm:py-20">
        <div className="lg:w-[60%] mx-auto">
          <Card className="bg-background 
          
          border-none shadow-none text-center flex flex-col items-center justify-center">

            <h2>
              ¿Listo para ser guardian@ de los {" "}
              <span className="text-transparent bg-gradient-to-r from-[#31bd46] to-primary bg-clip-text">
                saberes ancestrales?
              </span>
            </h2>

            <CardContent className="lg:w-[80%] text-xl text-muted-foreground">
              Únete a nuestra red intercultural de docentes, jóvenes y sabios quechuas/aimaras. Comparte conocimientos, resuelve dudas y ayuda a preservar nuestra herencia. ¡Tu voz importa! 🌱
            </CardContent>

            <CardFooter>
              <Button asChild>
                <a href="https://discord.com/" target="_blank">
                  Unirme a la Comunidad
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className="border-secondary" />
    </section>
  );
};