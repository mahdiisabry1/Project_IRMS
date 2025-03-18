using System.Data;
using Project_IRMS.Data;

namespace Project_IRMS.Buisness
{
    public class UserLoginBusiness
    {
        private readonly UserLoginData _userLoginData;
        public UserLoginBusiness()
        {
            _userLoginData = new UserLoginData();
        }
        public DataTable ValidateUser(string username, string password)
        {
            return _userLoginData.AuthenticateUser(username, password);
        }

    }
}
