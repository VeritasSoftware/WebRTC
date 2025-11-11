# .NET WebRTC Server

A .NET library for WebRTC, enabling real-time communication in your web applications.

### Supports .NET 8/9.

## Features

- High-level API for simplified WebRTC operations
- Peer-to-peer audio+video chat
- Peer-to-peer text chat
- Peer-to-peer screen sharing
- Peer-to-peer file transfer
- Client available for `Blazor`, `Angular`, `React`
- Cross-platform support (Windows, macOS, Linux) for Server

## Client packages

Blazor, Angular, React clients are available.

|Packages|Downloads|
|---------------------------|:---:|
|*WebRTC.Blazor.Client*|[![Downloads count](https://img.shields.io/nuget/dt/WebRTC.Blazor.Client)](https://www.nuget.org/packages/WebRTC.Blazor.Client)|
|*ts-webrtc-angular-client*|[![Downloads count](https://img.shields.io/npm/dy/ts-webrtc-angular-client)](https://www.npmjs.com/package/ts-webrtc-angular-client)|
|*ts-webrtc-react-client*|[![Downloads count](https://img.shields.io/npm/dy/ts-webrtc-react-client)](https://www.npmjs.com/package/ts-webrtc-react-client)|

## Server

You can use any ASP.NET Core web application to host the Server. Server supports .NET 8.0 & 9.0.

[**Browse server library**](https://github.com/VeritasSoftware/WebRTC/tree/master/WebRTC.Server).

You can even use just a Console app as a Server.

Just create one with Web Sdk (project file):

```
<Project Sdk="Microsoft.NET.Sdk.Web">
```

```csharp
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", builder => builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials().SetIsOriginAllowed(origin => true)
                                                    .WithOrigins("https://localhost:7086/"));
});
```

```csharp
app.UseCors("MyPolicy");
.
.
app.MapHub<VideoChatHub>("/chathub");
```

## Documentation

https://github.com/VeritasSoftware/WebRTC