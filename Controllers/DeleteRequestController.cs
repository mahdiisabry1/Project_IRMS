using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Project_IRMS.Buisness;
using System.Web.Mvc;

namespace Project_IRMS.Controllers
{
    public class DeleteRequestController : Controller { 

        private readonly InternDetailsService _internService;
        
        public DeleteRequestController()
        {
            _internService = new InternDetailsService();
        }
    }
}