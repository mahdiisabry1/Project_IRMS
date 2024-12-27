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
        public ActionResult SubmitRequest(FormCollection form, HttpPostedFileBase profileImage, HttpPostedFileBase cv)
        {
            try
            {
                // Retrieve form data
                int id =Convert.ToInt32( form["id"]);
                string firstName = form["firstName"];
                string lastName = form["lastName"];
                string university = form["university"];
                string gender = form["gender"];
                string email = form["email"];
                string contactNo = form["contactNo"];
                string degree = form["degree"];
                string division = form["division"];

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
                string targetTable = division == "IT" ? "itInterns" : "hrInterns";

                // Process intern details
                _service.ProcessInternDetails(targetTable, "hrInterns",id, firstName, lastName, university,gender, email, contactNo, degree, division, profileImageBytes, cvBytes);

                return Json(new { success = true, message = "Request processed successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }
    }
}
