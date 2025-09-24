using Microsoft.AspNetCore.SignalR;

namespace WebRTC.Server
{
    public class VideoChatHub : Hub
    {
        [HubMethodName("invite")]
        public async Task Invite(string roomId, string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.All.SendAsync(userId, roomId);
        }

        [HubMethodName("invite-all")]
        public async Task InviteAll(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.AllExcept(Context.ConnectionId).SendAsync("invite-all", roomId);
        }

        [HubMethodName("accept-invite")]
        public async Task AcceptInvite(string roomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.GroupExcept(roomId, Context.ConnectionId).SendAsync("invite-accepted", roomId);
        }

        [HubMethodName("offer")]
        public async Task Offer(object offer, string roomId)
        {
            await Clients.GroupExcept(roomId, Context.ConnectionId).SendAsync("offer", offer);
        }

        [HubMethodName("answer")]
        public async Task Answer(object answer, string roomId)
        {
            await Clients.GroupExcept(roomId, Context.ConnectionId).SendAsync("answer", answer);
        }

        [HubMethodName("ice-candidate")]
        public async Task IceCandidate(object candidate, string roomId)
        {
            await Clients.GroupExcept(roomId, Context.ConnectionId).SendAsync("ice-candidate", candidate);
        }

        [HubMethodName("end-call")]
        public async Task EndCall(string roomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            await Clients.GroupExcept(roomId, Context.ConnectionId).SendAsync("end-call");
        }
    }
}
