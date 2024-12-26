using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
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

        [HttpPost]
        public ActionResult SubmitRequest(string firstName, string lastName, string university, string email, string contactNo, string degree, string division, HttpPostedFileBase profileImage, HttpPostedFileBase cv)
        {
            try
            {
                if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName))
                {
                    return Json(new { success = false, message = "First name and Last name are required." });
                }

                byte[] profileImageBytes = null;
                byte[] cvBytes = null;

                // Convert profile image to byte array
                if (profileImage != null && profileImage.ContentLength > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        profileImage.InputStream.CopyTo(ms);
                        profileImageBytes = ms.ToArray();
                    }
                }

                // Convert CV file to byte array
                if (cv != null && cv.ContentLength > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        cv.InputStream.CopyTo(ms);
                        cvBytes = ms.ToArray();
                    }
                }

                // Determine target table
                string targetTable = division == "IT" ? "itInterns" : "otherInterns";

                // Process intern details
                _service.ProcessInternDetails(targetTable, "hrInterns", firstName, lastName, university, email, contactNo, degree, division, profileImageBytes, cvBytes);

                return Json(new { success = true, message = "Request processed successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }
    }
}
