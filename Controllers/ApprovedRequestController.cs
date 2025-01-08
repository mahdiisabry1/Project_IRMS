using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
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
                return Json(new { success = false, message = "Table name is missing." }, JsonRequestBehavior.AllowGet);
            }

            // Fetch interns from the business layer
            List<Intern> interns = _service.GetAllInterns(tableName);
            ViewBag.Interns = interns;

            return View();
        }
    }
}