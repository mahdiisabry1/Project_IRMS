using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Project_IRMS.Models;
using System.Data;
using Project_IRMS.Data;

namespace Project_IRMS.Buisness
{
    public class ViewInternDetailsService
    {
        private readonly ViewInternDetails _dataAccess;

        public ViewInternDetailsService()
        {
            _dataAccess = new ViewInternDetails(); //connecting businesslayer with datalayer 
        }
        public List<Intern> GetAllInterns(string tablename)
        {
            var internList = new List<Intern>();
            DataTable dataTable = _dataAccess.GetInternDetails(tablename);

            foreach (DataRow row in dataTable.Rows)
            {
                internList.Add(new Intern
                {
                    InternID = Convert.ToInt32(row["InternID"]),
                    FirstName = row["FirstName"].ToString(),
                    LastName = row["LastName"].ToString(),
                    University = row["University"].ToString(),
                    Gender = row["Gender"].ToString(),
                    Email = row["Email"].ToString(),
                    ContactNo = row["ContactNo"].ToString(),
                    Degree = row["Degree"].ToString(),
                    Division = row["Division"].ToString(),
                    ProfileImage = row.IsNull("ProfileImage") ? null : (byte[])row["ProfileImage"],
                    CV = row.IsNull("CV") ? null : (byte[])row["CV"]
                });
            }

            return internList;
        }
        //
        public void ProcessInternDetails(string targetTable, string sourceTable,int id, string firstName, string lastName, string university,string gender, string email, string contactNo, string degree, string division, byte[] profileImage, byte[] cv,string status)
        {
            // Insert into the target table
            _dataAccess.InsertInternDetails(targetTable, firstName, lastName, university,gender, email, contactNo, degree, division, profileImage, cv,status);

            // Delete from the source table
            _dataAccess.DeleteInternDetails(sourceTable, id);
        }
        //


    }
}
