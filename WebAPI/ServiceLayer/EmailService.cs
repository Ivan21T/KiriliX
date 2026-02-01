using MailKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class EmailService
    {
        private readonly string _fromEmail = "it.kirilix@gmail.com";
        private readonly string _password = "nstj khpm pjvb jypj"; 
        private readonly string _smtpServer = "smtp.gmail.com";
        private readonly int _port = 587;

        public async Task SendEmail(string to, string subject, string body)
        {
            var message = new MailMessage(_fromEmail, to)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true 
            };

            using var smtp = new SmtpClient(_smtpServer, _port)
            {
                Credentials = new NetworkCredential(_fromEmail, _password),
                EnableSsl = true
            };

            smtp.Send(message);
        }

        public async Task SendOtpEmail(string to, string otpCode,DateTime time)
        {
            var expiryTime = time.ToString("HH:mm");

            string htmlTemplate = @"
            <div style=""font-family: system-ui, sans-serif, Arial; font-size: 14px"">
              <a style=""text-decoration: none; outline: none"" href=""[Website Link]"" target=""_blank""></a>
              <p style=""padding-top: 14px; border-top: 1px solid #eaeaea"">
               За да се удостоверите, моля, използвайте следния еднократен код (OTP):
              </p>
              <p style=""font-size: 22px""><strong>{{passcode}}</strong></p>
              <p>Този еднократен код (OTP) ще бъде валиден за 15 минути до <strong>{{time}}</strong>.</p>
              <p>
                Не споделяйте този еднократен код (OTP) с никого. Ако не сте направили тази заявка, можете безопасно да игнорирате този имейл.<br />KiriliX никога няма да се свързва с вас относно този имейл или да иска каквито и да е кодове за вход или линкове. Внимавайте за фишинг измами.
              </p>
              <p>Благодарим ви, че използвате KiriliX!</p>
            </div>";

            htmlTemplate = htmlTemplate.Replace("{{passcode}}", otpCode)
                                       .Replace("{{time}}", expiryTime);

            await SendEmail(to, "Вашият OTP код за KiriliX", htmlTemplate);
        }
    }

}
