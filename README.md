# .NET WebRTC

A .NET library for WebRTC, enabling real-time communication in your web applications.

## Features

- Peer-to-peer audio and video communication
- Data channels for real-time data transfer
- High-level API for simplified WebRTC operations
- Client available for Blazor
- Easy integration with ASP.NET Core web applications
- Cross-platform support (Windows, macOS, Linux) for Server

## Server

You can use any ASP.NET Core web application to host the Server.

You can even use just a Console app as a Server.

Just create one with Web Sdk (project file):

```
<Project Sdk="Microsoft.NET.Sdk.Web">
```

I have used a Web API (SampleApi).

```csharp
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(origin => true)
                                                    .WithOrigins("https://localhost:7126/", "https://b3a7a636da8d.ngrok-free.app", "https://2ddcfb6b2f8d.ngrok-free.app/"));
});
```

```csharp
app.UseCors("MyPolicy");
.
.
app.MapHub<VideoChatHub>("/chathub");
```

## Blazor Client

You can go through my SampleBlazorWebApp to see how to use the Client.

## WebRTC communication supported by the system
