import "./Contact.css";

export default function ContactSocialMedia({
  address = "Cra. 45 #50-20, Sabaneta, Antioquia",
  phone = "+57 300 000 0000",
  whatsapp = "+57 300 000 0000",
  email = "hola@zugarez.com",
  hours = [
    { day: "Lun–Vie", time: "8:00 – 20:00" },
    { day: "Sáb",     time: "8:00 – 20:00" },
    { day: "Dom",     time: "9:00 – 18:00" },
  ],
  mapUrl = "https://www.google.com/maps?q=Mirador%20Monteluna",
}) {
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;
  const waHref  = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;

  return (
  
      <div className="contenedorSocialMedia">
          
          <aside className="contactAbout" aria-labelledby="about-contact-title">
        <h3 id="about-contact-title">Visítanos</h3>

        <div className="contactMedia__grid" id ="contactoRedes">
          {/* Dirección */}
          <div className="contact__block contact__carta">
            <div className="contact__label__carta">Dirección</div>
            <p className="contact__text__carta">{address}</p>
            <a
              className="contact__mapa"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Cómo llegar
            </a>
          </div>

          {/* Horario */}
          <div className="contact__block contact__carta">
            <div className="contact__label__carta">Horario</div>
            <ul className="contact__hours__carta">
              {hours.map((h, i) => (
                <li key={i}>
                  <span>{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="contact__block contact__carta">
            <div className="contact__label__carta">Contacto</div>
            <ul className="contact__list">
              <li>📞 <a href={telHref}>{phone}</a></li>
              <li>💬 <a href={waHref} target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li>✉️ <a href={`mailto:${email}`}>{email}</a></li>
            </ul>
          </div>
        </div>
      </aside>

      </div>

  );
}
