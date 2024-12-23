using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Project_IRMS.Data.Common;

namespace Project_IRMS.Data
{
    public class ViewInternDetails
    {
        private readonly SqlServerHelper _sqlHelper;

        public ViewInternDetails()
        {
            _sqlHelper = new SqlServerHelper();
        }

        public DataTable GetInternDetails()
        {
            string query = "SELECT * from InternDetails ";
            return _sqlHelper.ExecuteQuery(query);
        }
    }
}
