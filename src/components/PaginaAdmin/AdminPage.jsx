import Header from "./Header/Header";
import CrudMongoApp from "../CrudMongoApp/CrudMongoApp";
import Footer from "../PaginaPrincipal/Footer/Footer";

import AdminLayout from "./AdminLayout/AdminLayout";
import { authService } from "../../services/authService";

function AdminPage() {
  return (
    
      
        <div className="Admin-page">
          {console.log(authService.getUser)}
           <Header/>
           <AdminLayout/>
            <Footer/>
        </div>
        
  
    
  );
}

export default AdminPage;