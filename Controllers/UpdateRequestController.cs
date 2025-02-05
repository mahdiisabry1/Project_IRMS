using Project_IRMS.Buisness;
using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}