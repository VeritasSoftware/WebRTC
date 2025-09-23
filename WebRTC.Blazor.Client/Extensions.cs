using Microsoft.Extensions.DependencyInjection;

namespace WebRTC.Blazor.Client
{
    public static class Extensions
    {
        public static IServiceCollection AddWebRTCBlazorClient(this IServiceCollection services)
        {
            services.AddScoped<IWebRTCService, WebRTCService>();
            return services;
        }
    }
}
