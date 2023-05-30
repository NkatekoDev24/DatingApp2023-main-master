using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class VisitsRepository : IVisitsRepository
    {
        private readonly DataContext _context;
        public VisitsRepository(DataContext context)
        {
            _context = context;
            
        }
        public async Task<UserVisit> GetUserVisit(int sourceUserId, int targetUserId)
        {
            return await _context.Visits.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<PagedList<VisitDto>> GetUserVisits(VisitsParams visitsParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var visits = _context.Visits.AsQueryable();

            if (visitsParams.Predicate == "visited")
            {
                visits = visits.Where(visits => visits.SourceUserId == visitsParams.UserId);
                users = visits.Select(visits => visits.TargetUser); // List of users visits by the current user
            }

            if (visitsParams.Predicate == "visitedBy")
            {
                visits = visits.Where(visits => visits.TargetUserId == visitsParams.UserId);
                users = visits.Select(visits => visits.SourceUser); // List of users who have visitsd the current user
            }

            var visitsdUsers =  users.Select(user => new VisitDto
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id
            });

            return await PagedList<VisitDto>.CreateAsync(visitsdUsers, visitsParams.PageNumber, visitsParams.PageSize);
        }

        public async Task<AppUser> GetUserWithVisits(int userId)
        {
            return await _context.Users
                .Include(x => x.VisitedUser)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}