using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Project_IRMS.Models; // Assuming your model is in this namespace

namespace Project_IRMS.Controllers
{
    public class SentRequestController : Controller // Inherit from Controller
    {
        // GET: SentRequest/Index
        public ActionResult Index()
        {
            

            // Pass the model to the view
            return View();
        }

        // Method to simulate data retrieval (replace with your actual data source)
        
    }

   
}