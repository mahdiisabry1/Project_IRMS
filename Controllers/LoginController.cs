using System.Web.Mvc;
using System.Data;
using Project_IRMS.Buisness;

namespace Project_IRMS.Controllers
{
    public class LoginController : Controller
    {
        private readonly UserLoginBusiness _userLoginBusiness;
        // GET: Login

        public LoginController()
        {
            _userLoginBusiness = new UserLoginBusiness();  // Initialize the object here
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(string username, string password)
        {
            // Validate user credentials using the Business Layer.
            DataTable userDetails = _userLoginBusiness.ValidateUser(username, password);

            // Check if user details are returned (successful login).
            if (userDetails != null && userDetails.Rows.Count > 0)
            {
                // Store user details in session for later use.
                Session["Username"] = userDetails.Rows[0]["Username"].ToString();
                Session["Role"] = userDetails.Rows[0]["Role"].ToString();
                Session["Tablename"] = userDetails.Rows[0]["Table_name"].ToString();

                // Redirect to the main layout or dashboard.
                return RedirectToAction("Index", "Home");
            }

            // Authentication failed. Add error message to ViewBag.
            ViewBag.ErrorMessage = "Invalid username or password.";
            return View("Index");
        }
    }
}