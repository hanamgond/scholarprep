
using Application.Interface.Security;

namespace Infrastructure.Helper;
public class BcryptPasswordHasher : IPasswordHasher
{
    public string Hash(string pwd) => BCrypt.Net.BCrypt.HashPassword(pwd);
    public bool Verify(string hash, string pwd) => BCrypt.Net.BCrypt.Verify(pwd, hash);
}

