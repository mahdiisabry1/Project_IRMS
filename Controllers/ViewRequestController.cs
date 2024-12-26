using System.Collections.Generic;
using System.Web.Mvc;
using Project_IRMS.Buisness;
using Project_IRMS.Models;

namespace Project_IRMS.Controllers
{
    public class ViewRequestController : Controller
    {
        private readonly ViewInternDetailsService _service;

        public ViewRequestController()
        {
            _service = new ViewInternDetailsService();
        }

        // GET: ViewRequest
        public ActionResult Index()
        {
            var tableName = Session["Tablename"]?.ToString();
            if (string.IsNullOrEmpty(tableName))
            {
                return Json(new { success = false, message = "Table name is missing." });
            }
            // Fetch interns from the business layer
            List<Intern> interns = _service.GetAllInterns(tableName);

            // Pass the interns to the view using ViewBag
            ViewBag.Interns = interns;

            return View();
        }
    }
}
