import MenuCard from "../Card/MenuCard.jsx";
import "./PreMenu.css";

import imgBebidasFrias from "../../../../../Assest/Imgs/MenuImgs/Granizado.png";
import imgBebidasCalientes from "../../../../../Assest/Imgs/MenuImgs/Cafe.png";
import imgEmpanada from "../../../../../Assest/Imgs/MenuImgs/Empanada.png";
import imgRefrescos from "../../../../../Assest/Imgs/MenuImgs/Refrescos.png";
import imgPasteleria from "../../../../../Assest/Imgs/MenuImgs/Pastel.png";
import imgCroassaint from "../../../../../Assest/Imgs/MenuImgs/Croassaint.png";


import { useNavigate } from "react-router-dom";

export default function PreMenuContainer() {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/menu?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="PreMenuSection" id="PreMenuSection">
      <h2 className="PreMenuTitle">Productos</h2>

      <div className="PreMenuContainer">
        <div onClick={() => handleClick("Frías")}>
          <MenuCard title="Frías" image={imgBebidasFrias} />
        </div>
        <div onClick={() => handleClick("PaPicar")}>
          <MenuCard title="Pa´ Picar" image={imgEmpanada} />
        </div>
        <div onClick={() => handleClick("Calientes")}>
          <MenuCard title="Calientes" image={imgBebidasCalientes} />
        </div>
        <div onClick={() => handleClick("Refrescos")}>
          <MenuCard title="Refrescos" image={imgRefrescos} />
        </div>
        <div onClick={() => handleClick("Pastelería")}>
          <MenuCard title="Pastelería" image={imgPasteleria} />
        </div>
        <div onClick={() => handleClick("Croassaint")}>
          <MenuCard title="Croassaint" image={imgCroassaint} />
        </div>
      </div>
    </section>
  );
}
