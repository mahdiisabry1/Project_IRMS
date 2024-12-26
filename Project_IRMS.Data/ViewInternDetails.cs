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

        public DataTable GetInternDetails(string tablename)
        {
            // Validate table name against a list of allowed names
            string[] allowedTables = { "InternDetails", "hrInterns", "itInterns" }; // Add your valid table names here
            if (!allowedTables.Contains(tablename))
                throw new ArgumentException("Invalid table name.");

            //
            string query = $@"SELECT * from {tablename} ";
            return _sqlHelper.ExecuteQuery(query);
        }
    }
}
