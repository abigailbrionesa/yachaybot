"use client";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Building2, Clock, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

const contactData = [
  {
    icon: <Building2 />,
    label: "Oficina Principal",
    value: "Av. Cultura 710, Cusco, Perú",
  },
  {
    icon: <Phone />,
    label: "Teléfono Quechua",
    value: "+51 984 787 223 (WhatsApp)",
  },
  {
    icon: <Mail />,
    label: "Correo Electrónico",
    value: "alianzas@yachaybot.org",
  },
  {
    icon: <Clock />,
    label: "Horario de Atención",
    value: (
      <>
        <div>Lunes - Viernes</div>
        <div>9AM - 5PM (GMT-5)</div>
      </>
    ),
  },
];

const temasConsulta = [
  { value: "saberes", label: "Contribuir con saberes ancestrales" },
  { value: "alianza", label: "Alianza con escuela EIB" },
  { value: "investigacion", label: "Investigación académica" },
  { value: "voluntariado", label: "Voluntariado lingüístico" },
  { value: "otro", label: "Otra colaboración" },
];

export const ContactSection = () => {
  const t = useTranslations("ContactSection");
  
  const contactData = [
    {
      icon: <Building2 />,
      label: t("contactData.office"),
      value: "Av. Cultura 710, Cusco, Perú",
    },
    {
      icon: <Phone />,
      label: t("contactData.phone"),
      value: "+51 984 787 223 (WhatsApp)",
    },
    {
      icon: <Mail />,
      label: t("contactData.email"),
      value: "alianzas@yachaybot.org",
    },
    {
      icon: <Clock />,
      label: t("contactData.hours"),
      value: (
        <>
          <div>{t("contactData.hoursValue.0")}</div>
          <div>{t("contactData.hoursValue.1")}</div>
        </>
      ),
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "saberes",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;
    const mailToLink = `mailto:leomirandadev@gmail.com?subject=${subject}&body= ${firstName} ${lastName}, ${email}.%0D%0A${message}`;
    window.location.href = mailToLink;
  }

  return (
    <section id="contact" className="container py-24 sm:py-32">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">
            {t("title")}
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold">
            {t("heading")}
          </h2>
          <p className="mb-8 text-muted-foreground lg:w-5/6">
            {t("description")}
          </p>

          <div className="flex flex-col gap-4">
            {contactData.map(({ icon, label, value }, index) => (
              <div key={index}>
                <div className="flex gap-2 mb-1">
                  {icon}
                  <div className="font-bold">{label}</div>
                </div>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="text-primary text-2xl">{t("cardTitle")}</CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-4">
                <div className="flex flex-col md:flex-row gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("form.firstName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.placeholders.firstName")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("form.lastName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.placeholders.lastName")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.email")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={t("form.placeholders.email")} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.subject")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("form.subject")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {temasConsulta.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                            {t(`topics.${item.value}`)}
                          </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder={t("form.placeholders.message")}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4 bg-primary hover:bg-primary/90">
                  {t("form.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </section>
  );
};