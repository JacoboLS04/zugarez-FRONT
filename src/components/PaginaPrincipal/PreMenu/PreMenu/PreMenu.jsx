import MenuCard from "../Card/MenuCard.jsx";
import "./PreMenu.css";

import imgBebidasFrias from "../../../Assest/Imgs/MenuImgs/Granizado.png";
import imgBebidasCalientes from "../../../Assest/Imgs/MenuImgs/Cafe.png";
import imgEmpanada from "../../../Assest/Imgs/MenuImgs/Empanada.png";
import imgRefrescos from "../../../Assest/Imgs/MenuImgs/Refrescos.png";
import imgPasteleria from "../../../Assest/Imgs/MenuImgs/Pastel.png";
import imgCroassaint from "../../../Assest/Imgs/MenuImgs/Croassaint.png";


export default function PreMenuContainer() {
return (
    

    <section className="PreMenuSection" id="PreMenuContainer">
    
      <h2 className="PreMenuTitle">Productos</h2>

 
      <div className="PreMenuContainer">
        <MenuCard title="Frías" image={imgBebidasFrias} />
        <MenuCard title="Pa´ Picar" image={imgEmpanada} />
        <MenuCard title="Refrescos" image={imgRefrescos} />
        <MenuCard title="Calientes" image={imgBebidasCalientes} />
        <MenuCard title="Pasteleria" image={imgPasteleria} />
        <MenuCard title="Panaderia" image={imgCroassaint} />
        
      </div>
    </section>
  
    
    
);
}
