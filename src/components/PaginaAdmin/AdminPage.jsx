import Header from "./Header/Header";
import CrudMongoApp from "../CrudMongoApp/CrudMongoApp";

import AdminLayout from "./AdminLayout";

function AdminPage() {
  return (
    
      
        <div className="Admin-page">
           <Header/>
           <AdminLayout/>
           <CrudMongoApp/>

        </div>
        
  
    
  );
}

export default AdminPage;