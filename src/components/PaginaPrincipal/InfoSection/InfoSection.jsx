import "./InfoSection.css";
import NosotrosTexto from "./NosotrosTexto";
import ImageCarousel from "./ImageCarousel";
import AboutContactInfo from "./AboutContactInfo";

const imgs = [
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1600&auto=format&fit=crop",
];

const items = [
    { n: "4.7★ ", t: "Calificación promedio" },
    { n: "+10k ", t: "Cafés servidos" },
    { n: "+4k ", t: "Postres vendidos" },
    { n: "+30", t: "Empleados" },
    { n: "+50", t: "Productos" },
    { n: "2018 ", t: "Desde siempre" },
    
  ];

export default function AboutSection({ images = [] }) {
  return (
    <section id="nosotrosTexto" className="about">
      <div  className="about__inner">
        <NosotrosTexto/>
        <ImageCarousel images={imgs} />

        <ul className="about__highlights">
      {items.map((it, i) => (
        <li key={i}>
          <span className="h-num">{it.n}</span>
          <span className="h-txt">{it.t}</span>
        </li>
      ))}
    </ul>
      </div>

      <AboutContactInfo />
    </section>
  );
}
