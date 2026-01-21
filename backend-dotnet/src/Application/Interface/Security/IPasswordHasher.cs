namespace Application.Interface.Security;

public interface IPasswordHasher { string Hash(string pwd); bool Verify(string hash, string pwd); }
