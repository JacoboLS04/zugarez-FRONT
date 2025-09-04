import Header from "./Header/Header";
import CrudMongoApp from "../CrudMongoApp/CrudMongoApp";
import Footer from "../PaginaPrincipal/Footer/Footer";

import AdminLayout from "./AdminLayout/AdminLayout";

function AdminPage() {
  return (
    
      
        <div className="Admin-page">
           <Header/>
           <AdminLayout/>
            <Footer/>
        </div>
        
  
    
  );
}

export default AdminPage;