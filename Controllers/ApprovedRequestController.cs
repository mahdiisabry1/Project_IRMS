using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Project_IRMS.Buisness;
using Project_IRMS.Models;

namespace Project_IRMS.Controllers
{
    public class ApprovedRequestController : Controller
    {
        private readonly ApprovedInternDetailsService _service;

        public ApprovedRequestController()
        {
            _service = new ApprovedInternDetailsService();
        }

        // GET: ApprovedRequest
        public ActionResult Index()
        {
            var tableName = Session["Tablename"]?.ToString();
            if (string.IsNullOrEmpty(tableName))
            {
                ModelState.AddModelError("", "Table name is missing.");
                return View(); // Return the view with an error message
            }

            // Fetch interns from the business layer
            List<Intern> interns = _service.GetAllInterns(tableName);
            ViewBag.Interns = interns;

            return View();
        }
    }
}