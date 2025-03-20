using Project_IRMS.Buisness;
using System;
using System.Web;
using System.Web.Mvc;

namespace Project_IRMS.Controllers
{
    public class UpdateRequestController : Controller
    {
        private readonly InternDetailsService _internService;
        // GET: UpdateRequest
        public UpdateRequestController()
        {
            _internService = new InternDetailsService();
        }

        [HttpPost]
        public ActionResult SubmitRequest(FormCollection form)
        {
            try
            {
                // Retrieve the table name from the session
                var tablename = Session["Tablename"]?.ToString();
                if (string.IsNullOrEmpty(tablename))
                {
                    return Json(new { success = false, message = "Table is missing" });
                }

                // Extract form data
                string internId = form["internId"];
                string firstName = form["firstName"];
                string lastName = form["lastName"];
                string university = form["university"];
                string gender = form["gender"];
                string email = form["email"];
                string contactNo = form["contactNo"];
                string degree = form["degree"];
                string division = form["division"];
                string status = "new"; // Default status

                // Call the service layer to update intern details
                _internService.UpdateInternDetails(
                    tablename, // Pass the table name from the session
                    internId,
                    firstName,
                    lastName,
                    university,
                    gender,
                    email,
                    contactNo,
                    degree,
                    division,
                    status
                );

                return Json(new { success = true, message = "Request submitted successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception (ex) here
                return Json(new { success = false, message = "An error occurred: " + ex.Message });
            }
        }
    }
}