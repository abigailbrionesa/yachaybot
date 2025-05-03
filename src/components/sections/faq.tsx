"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export const FAQSection = () => {
  const t = useTranslations("FAQ");

  const FAQList = [
    {
      question: t("faq1.question"),
      answer: t("faq1.answer"),
      value: "item-1",
    },
    {
      question: t("faq2.question"),
      answer: t("faq2.answer"),
      value: "item-2",
    },
    {
      question: t("faq3.question"),
      answer: t("faq3.answer"),
      value: "item-3",
    },
    {
      question: t("faq4.question"),
      answer: t("faq4.answer"),
      value: "item-4",
    },
    {
      question: t("faq5.question"),
      answer: t("faq5.answer"),
      value: "item-5",
    },
  ];

  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-primary text-center mb-2 tracking-wider">
          {t("subtitle")}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          {t("title")}
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left text-lg">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-justify">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};