import { Navbar } from "@/components/global/navbar";
import { SearchExperience } from "@/components/v2/search-experience";
import { FooterSection } from "@/components/sections/footer";

export default function MainPage() {
  return (
    <>
      <Navbar />
      <SearchExperience />
      <FooterSection />
    </>
  );
}
