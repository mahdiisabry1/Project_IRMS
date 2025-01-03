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
        public ActionResult SubmitRequest(FormCollection form)
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

              
                byte[] cvBytes = null;
                

                // Retrieve the profile image source (URL or Base64 string)
                string profileImageSrc = form["profileImage"];

                // Handle the profile image
                byte[] profileImageBytes = null;
                if (!string.IsNullOrEmpty(profileImageSrc))
                {
                    
                        // Extract the Base64 string and convert it to byte array
                        var base64Data = profileImageSrc.Split(',')[1];
                        profileImageBytes = Convert.FromBase64String(base64Data);
                    
                   
                }

                // Retrieve the Base64-encoded CV string
                string base64CV = form["cv"];
                if (!string.IsNullOrEmpty(base64CV))
                {
                    // Convert Base64 string to byte array
                    cvBytes = Convert.FromBase64String(base64CV);
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
