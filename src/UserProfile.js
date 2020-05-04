
import * as Cookies from "js-cookie";


var UserProfile = (function() {
    
    
    var userPhone = "";
    var admin = false;

    var getPhone = function() {
        userPhone = Cookies.get("phone")
        return userPhone;    // Or pull this from cookie/localStorage
    };
  
    var setPhone = function(phone) {
        Cookies.set("phone", phone, {expires: 14});
        userPhone = phone;
        // Also set this in cookie/localStorage
    };

    var getAdmin = function() {
        admin = Cookies.get("admin")
        return admin;    // Or pull this from cookie/localStorage
    };
    
    var setAdmin = function(adminVal) {
        Cookies.remove("admin");
        Cookies.set("admin", adminVal, {expires: 14});
        admin = adminVal;     
        // Also set this in cookie/localStorage
    };
  
    return {
      getPhone: getPhone,
      setPhone: setPhone,
      getAdmin: getAdmin,
      setAdmin: setAdmin
    }
  
  })();
  
  export default UserProfile;