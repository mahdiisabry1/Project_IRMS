using Project_IRMS.Buisness;
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