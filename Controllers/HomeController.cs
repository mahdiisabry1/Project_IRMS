using System.Web.Mvc;

namespace Project_IRMS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        // Logout action to clear session and redirect to login page
        public ActionResult Logout()
        {
            // Clear session
            Session.Clear();

            // Optionally, also abandon the session
            Session.Abandon();

            // Redirect to the Login page
            return RedirectToAction("Index", "Login");
        }
    }
}